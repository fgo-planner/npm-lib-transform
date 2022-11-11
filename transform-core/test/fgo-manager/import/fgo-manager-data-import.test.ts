import { Array2D } from '@fgo-planner/common-core';
import { InstantiatedServantUpdateIndeterminateValue as IndeterminateValue } from '@fgo-planner/data-core';
import { GameServant_1100900, GameServant_201300, GameServant_504400 } from '@fgo-planner/data-test-resources';
import { LoggerMessageLevel } from '../../../src/common/logger';
import { FgoManagerDataImport } from '../../../src/fgo-manager';
import { DebugTransformLogger } from '../../resources/debug-transform-logger.class';

describe('parseRosterSheet', () => {

    const gameServantNameMap = {
        'Arash': GameServant_201300,
        'Chen Gong': GameServant_504400,
        'Space Ishtar': GameServant_1100900
    };

    /* eslint-disable max-len */
    const topRow = ['General Information', '', '', '', '', 'Deck', '', '', '', '', '', 'NP', '', '', 'Levels', '', 'Skills', '', '', 'Fou', '', 'Bond', '', 'Extra'];
    const headerRow = ['Name', 'R', 'Class', 'Attr.', 'Availability', 'C1', 'C2', 'C3', 'C4', 'C5', 'isMaxAscended', 'Type', 'Target', 'Damage', 'NP', 'Level', '1', '2', '3', 'HP', 'ATK', 'Bond', 'BP', 'Acquisition'];
    const spaceIshtarRow = ['Space Ishtar', '5*', 'Avenger', 'Star', 'Limited', 'B', 'B', 'A', 'A', 'Q', 'TRUE', 'Arts', 'AoE', '52341', 'NP5', 'Lv. 90', '10', '10', '10', '1000', '1000', '6', '', '2021. 10. 18.'];
    /* eslint-enable max-len */

    it('should return the provided logger', () => {

        const data: Array2D<string> = [];

        const logger = new DebugTransformLogger();

        const result = FgoManagerDataImport.transformRosterSheetToMasterAccountImportData(data, gameServantNameMap, logger);

        expect(result.logger).toBe(logger);
    });

    it('should return a default logger if not provided', () => {

        const data: Array2D<string> = [];

        const result = FgoManagerDataImport.transformRosterSheetToMasterAccountImportData(data, gameServantNameMap);

        expect(result.logger).toBeDefined();
    });

    it('should log error and return empty result if given an empty input', () => {

        const data: Array2D<string> = [];

        const logger = new DebugTransformLogger();

        const result = FgoManagerDataImport.transformRosterSheetToMasterAccountImportData(data, gameServantNameMap, logger);

        expect(result.servants).toBeDefined();
        expect(result.servants?.length).toStrictEqual(0);

        expect(logger.messages.length).toBeGreaterThanOrEqual(1);
        const message = logger.findMessage(LoggerMessageLevel.Error, 'Header is missing or invalid');
        expect(message).toBeDefined();
    });

    it('should log error and return empty result if data is missing header', () => {

        const data = [
            topRow,
            spaceIshtarRow
        ];

        const logger = new DebugTransformLogger();

        const result = FgoManagerDataImport.transformRosterSheetToMasterAccountImportData(data, gameServantNameMap, logger);

        expect(result.servants).toBeDefined();
        expect(result.servants?.length).toStrictEqual(0);

        expect(logger.messages.length).toBeGreaterThanOrEqual(1);
        const message = logger.findMessage(LoggerMessageLevel.Error, 'could not be found');
        expect(message).toBeDefined();
    });

    it('should log warning and return empty result if data contains no servants', () => {

        const data = [
            topRow,
            headerRow
        ];

        const logger = new DebugTransformLogger();

        const result = FgoManagerDataImport.transformRosterSheetToMasterAccountImportData(data, gameServantNameMap, logger);

        expect(result.servants).toBeDefined();
        expect(result.servants?.length).toStrictEqual(0);

        expect(logger.messages.length).toBeGreaterThanOrEqual(1);
        const message = logger.findMessage(LoggerMessageLevel.Warn, 'Data does not contain any servant');
        expect(message).toBeDefined();
    });

    it('should return servants if data is valid', () => {

        const data = [
            topRow,
            headerRow,
            spaceIshtarRow
        ];

        const logger = new DebugTransformLogger();

        const result = FgoManagerDataImport.transformRosterSheetToMasterAccountImportData(data, gameServantNameMap, logger);

        expect(result.servants).toBeDefined();
        expect(result.servants?.length).toStrictEqual(1);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const servant1 = result.servants![0];
        expect(servant1.gameId).toStrictEqual(GameServant_1100900._id);
        expect(servant1.level).toStrictEqual(90);
        expect(servant1.np).toStrictEqual(5);
        expect(servant1.fouHp).toStrictEqual(1000);
        expect(servant1.fouAtk).toStrictEqual(1000);
        expect(servant1.skills[1]).toStrictEqual(10);
        expect(servant1.skills[2]).toStrictEqual(10);
        expect(servant1.skills[3]).toStrictEqual(10);
        expect(servant1.appendSkills[1]).toStrictEqual(IndeterminateValue);
        expect(servant1.appendSkills[2]).toStrictEqual(IndeterminateValue);
        expect(servant1.appendSkills[3]).toStrictEqual(IndeterminateValue);
        expect(servant1.bondLevel).toStrictEqual(6);
        expect(servant1.summonDate).toStrictEqual(1634515200000);
        expect(servant1.unlockedCostumes.size).toStrictEqual(0);

    });

    it('should return servants if data is valid with empty rows', () => {

        const data = [
            topRow,
            headerRow,
            [],
            spaceIshtarRow,
            [],
            []
        ];

        const logger = new DebugTransformLogger();

        const result = FgoManagerDataImport.transformRosterSheetToMasterAccountImportData(data, gameServantNameMap, logger);

        expect(result.servants).toBeDefined();
        expect(result.servants?.length).toStrictEqual(1);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const servant1 = result.servants![0];
        expect(servant1.gameId).toStrictEqual(GameServant_1100900._id);
        expect(servant1.level).toStrictEqual(90);
        expect(servant1.np).toStrictEqual(5);
        expect(servant1.fouHp).toStrictEqual(1000);
        expect(servant1.fouAtk).toStrictEqual(1000);
        expect(servant1.skills[1]).toStrictEqual(10);
        expect(servant1.skills[2]).toStrictEqual(10);
        expect(servant1.skills[3]).toStrictEqual(10);
        expect(servant1.appendSkills[1]).toStrictEqual(IndeterminateValue);
        expect(servant1.appendSkills[2]).toStrictEqual(IndeterminateValue);
        expect(servant1.appendSkills[3]).toStrictEqual(IndeterminateValue);
        expect(servant1.bondLevel).toStrictEqual(6);
        expect(servant1.summonDate).toStrictEqual(1634515200000);
        expect(servant1.unlockedCostumes.size).toStrictEqual(0);

    });

});
