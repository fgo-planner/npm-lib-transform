import { Immutable, ImmutableRecord, MathUtils, ReadonlyRecord } from '@fgo-planner/common-core';
import { GameServant, ImportedMasterServantUpdate, MasterServantAscensionLevel, MasterServantBondLevel, MasterServantConstants, MasterServantNoblePhantasmLevel, MasterServantSkillLevel, MasterServantUpdateBoolean, MasterServantUpdateIndeterminate as Indeterminate, MasterServantUpdateIndeterminateValue as IndeterminateValue, MasterServantUtils } from '@fgo-planner/data-core';
import { parse as parseDate } from 'date-fns';
import { TransformLogger } from '../../common/logger';

//#region Local type definitions

enum Column {
    ServantName = 'ServantName',
    NoblePhantasmLevel = 'NoblePhantasmLevel',
    Level = 'Level',
    SkillLevel1 = 'SkillLevel1',
    SkillLevel2 = 'SkillLevel2',
    SkillLevel3 = 'SkillLevel3',
    FouHp = 'FouHp',
    FouAtk = 'FouAtk',
    BondLevel = 'BondLevel',
    AcquisitionDate = 'AcquisitionDate'
}

//#endregion


//#region Constants

const HeaderRowIndex = 1;

const LevelPrefix = 'Lv. ';

const NoblePhantasmLevelPrefix = 'NP';

const AcquisitionDateFormat = 'yyyy. MM. dd.';

const MasterServantUpdateType = 'Imported';

//#endregion


//#region Enum maps

const ColumnNames = {
    [Column.ServantName]: 'Name',
    [Column.NoblePhantasmLevel]: 'NP',
    [Column.Level]: 'Level',
    [Column.SkillLevel1]: '1',
    [Column.SkillLevel2]: '2',
    [Column.SkillLevel3]: '3',
    [Column.FouHp]: 'HP',
    [Column.FouAtk]: 'ATK',
    [Column.BondLevel]: 'Bond',
    [Column.AcquisitionDate]: 'Acquisition'
} as ReadonlyRecord<Column, string>;

//#endregion


/**
 * Helper class for internal use only, do not add to module exports.
 */
export class RosterSheetToMasterServantUpdatesTransformWorker {

    private readonly _headerMap: Record<Column, number>;

    private _currentRowIndex: number;

    private _currentRowData?: Array<string>;

    constructor(
        private _data: Array<Array<string>>,
        private _gameServantNameMap: ImmutableRecord<string, GameServant>,
        private _logger: TransformLogger<number>
    ) {
        this._headerMap = this._parseHeader(_data);
        this._currentRowIndex = HeaderRowIndex + 1;  // Start one row below the header.
    }

    private _parseHeader(data: Array<Array<string>>): Record<Column, number> {
        const headerRowIndex = HeaderRowIndex;
        if (data.length <= headerRowIndex) {
            throw Error('Header is missing or invalid');
        }
        const headerRow = data[headerRowIndex];
        const result: Partial<Record<Column, number>> = {};
        let key: any;
        for (key in Column) {
            const column = key as Column;
            result[column] = this._findColumnInHeader(headerRow, column);
        }
        return result as Record<Column, number>;
    }

    private _findColumnInHeader(headerRow: Array<string>, column: Column): number {
        const columnName = ColumnNames[column];
        for (let i = 0, length = headerRow.length; i < length; i++) {
            if (headerRow[i] === columnName) {
                return i;
            }
        }
        console.log(ColumnNames);
        throw Error(`Column ${column} : '${columnName}' could not be found in header.`);
    }

    /**
     * Uncaught exceptions may be thrown.
     */
    parse(): Array<ImportedMasterServantUpdate> {
        if (this._data.length <= this._currentRowIndex) {
            this._logger.warn('Data does not contain any servants');
            return [];
        }
        const result: Array<ImportedMasterServantUpdate> = [];
        for (; this._currentRowIndex < this._data.length; this._currentRowIndex++) {
            this._currentRowData = this._data[this._currentRowIndex];
            if (!this._currentRowData?.length) {
                this._logger.info(this._currentRowIndex, 'Skipping empty row');
                continue;
            }
            try {
                const servant = this._parseCurrentRow();
                result.push(servant);
            } catch (e: any) {
                const message: string = typeof e === 'string' ? e : e.message;
                this._logger.error(this._currentRowIndex, message);
            }
        }
        return result;
    }

    private _parseCurrentRow(): ImportedMasterServantUpdate {

        const gameServant = this._parseGameServant();
        const gameId = gameServant._id;
        const summonDate = this._parseSummonDate();
        const np = this._parseNoblePhantasm();
        const { level, ascension } = this._parseLevelAndAscension(gameServant);
        const bondLevel = this._parseBond();
        const fouHp = this._parseFou('FouHp');
        const fouAtk = this._parseFou('FouAtk');
        const skill1 = this._parseSkill(1, false);
        const skill2 = this._parseSkill(2, true);
        const skill3 = this._parseSkill(3, true);

        return {
            type: MasterServantUpdateType,
            gameId,
            summoned: MasterServantUpdateBoolean.True,
            summonDate,
            np,
            level,
            ascension,
            fouHp,
            fouAtk,
            skills: {
                1: skill1,
                2: skill2,
                3: skill3
            },
            appendSkills: {
                1: IndeterminateValue,
                2: IndeterminateValue,
                3: IndeterminateValue
            },
            bondLevel,
            unlockedCostumes: new Map()
        };
    }

    private _parseGameServant(): Immutable<GameServant> {
        const value = this._parseDataFromCurrentRow(Column.ServantName);
        if (!value) {
            throw Error('Servant name is missing, row will be skipped.');
        }
        const result = this._gameServantNameMap[value];
        if (result === undefined) {
            throw Error(`Data for servant name '${value}' could not be found, row will be skipped.`);
        }
        return result;
    }

    private _parseNoblePhantasm(): MasterServantNoblePhantasmLevel | Indeterminate {
        const value = this._parseDataFromCurrentRow(Column.NoblePhantasmLevel);
        if (!value) {
            return IndeterminateValue;
        }
        const cleanValue = value.substring(NoblePhantasmLevelPrefix.length);
        let result = Number(cleanValue);
        if (isNaN(result)) {
            this._logger.warn(this._currentRowIndex, `'${value}' is not a NP level value.`);
            return IndeterminateValue;
        }
        result = ~~MathUtils.clamp(result, MasterServantConstants.MinNoblePhantasmLevel, MasterServantConstants.MaxNoblePhantasmLevel);
        return result as MasterServantNoblePhantasmLevel;
    }

    private _parseLevelAndAscension(gameServant: Immutable<GameServant>): {
        level: number | Indeterminate;
        ascension: MasterServantAscensionLevel | Indeterminate;
    } {
        const column = Column.Level;
        const value = this._parseDataFromCurrentRow(column);
        if (!value) {
            return {
                level: IndeterminateValue,
                ascension: IndeterminateValue
            };
        }
        const cleanValue = value.substring(LevelPrefix.length);
        let level = Number(cleanValue);
        if (isNaN(level)) {
            this._logger.warn(this._currentRowIndex, `${this._getColumnLabel(column)} '${value}' is not a valid value.`);
            return {
                level: IndeterminateValue,
                ascension: IndeterminateValue
            };
        }
        level = ~~MathUtils.clamp(level, MasterServantConstants.MinLevel, MasterServantConstants.MaxLevel);
        const ascension = MasterServantUtils.roundToNearestValidAscensionLevel(level, 0, gameServant);
        return { level, ascension };
    }

    private _parseBond(): MasterServantBondLevel | Indeterminate {
        const column = Column.BondLevel;
        const value = this._parseDataFromCurrentRow(column);
        if (!value) {
            return IndeterminateValue;
        }
        let result = Number(value);
        if (isNaN(result)) {
            this._logger.warn(this._currentRowIndex, `${this._getColumnLabel(column)} '${value}' is not a valid number.`);
            return IndeterminateValue;
        }
        result = ~~MathUtils.clamp(result, MasterServantConstants.MinBondLevel, MasterServantConstants.MaxBondLevel);
        return result as MasterServantBondLevel;
    }

    private _parseFou(stat: 'FouHp' | 'FouAtk'): number | Indeterminate {
        const column = Column[stat];
        const value = this._parseDataFromCurrentRow(column);
        if (!value) {
            return IndeterminateValue;
        }
        let result = Number(value);
        if (isNaN(result)) {
            this._logger.warn(this._currentRowIndex, `${this._getColumnLabel(column)} '${value}' is not a valid number.`);
            return IndeterminateValue;
        }
        result = MasterServantUtils.roundToNearestValidFouValue(result);
        return result;
    }

    private _parseSkill(skill: 1 | 2 | 3, canBeNull: false): MasterServantSkillLevel | Indeterminate;
    private _parseSkill(skill: 1 | 2 | 3, canBeNull: true): MasterServantSkillLevel | null;
    private _parseSkill(skill: 1 | 2 | 3, canBeNull: boolean): MasterServantSkillLevel | Indeterminate | null {
        const path = `SkillLevel${skill}` as keyof typeof Column;
        const column = Column[path];
        const value = this._parseDataFromCurrentRow(column);
        if (!value) {
            return canBeNull ? null : IndeterminateValue;
        }
        let result = Number(value);
        if (result === 0) {
            return canBeNull ? null : IndeterminateValue;
        }
        if (isNaN(result)) {
            this._logger.warn(this._currentRowIndex, `${this._getColumnLabel(column)} '${value}' is not a valid number.`);
            return canBeNull ? null : IndeterminateValue;
        }
        result = ~~MathUtils.clamp(result, MasterServantConstants.MinSkillLevel, MasterServantConstants.MaxSkillLevel);
        return result as MasterServantSkillLevel;
    }

    private _parseSummonDate(): number | Indeterminate {
        const column = Column.AcquisitionDate;
        const value = this._parseDataFromCurrentRow(column);
        if (!value) {
            return IndeterminateValue;
        }
        try {
            const date = parseDate(value, AcquisitionDateFormat, new Date(0));
            return date.getTime();
        } catch (e) {
            console.error(e);
            this._logger.warn(this._currentRowIndex, `${this._getColumnLabel(column)} Date value '${value}' could not be parsed.`);
            return IndeterminateValue;
        }
    }

    private _parseDataFromCurrentRow(column: Column): string | undefined {
        const columnIndex = this._headerMap[column];
        return this._currentRowData?.[columnIndex];
    }

    private _getColumnLabel(column: Column): string {
        return `Column ${ColumnNames[column]}:`;
    }

}
