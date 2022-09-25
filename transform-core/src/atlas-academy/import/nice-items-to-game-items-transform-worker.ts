import { ReadonlyRecord } from '@fgo-planner/common-core';
import { GameItem, GameItemBackground, GameItemUsage } from '@fgo-planner/data-core';
import { TransformLogger } from '../../common/logger';
import { AtlasAcademyTransformUtils } from '../atlas-academy-transform.utils';
import * as AtlasAcademy from '../types';

//#region Constants

const QpName = 'Quantum Particles';

//#endregion


//#region Enum maps

/**
 * Maps the `NiceItemBGType` values to the `GameItemBackground`
 * enum values.
 */
const ItemBackgroundMap = {
    'zero': GameItemBackground.None,
    'bronze': GameItemBackground.Bronze,
    'silver': GameItemBackground.Silver,
    'gold': GameItemBackground.Gold,
    'questClearQPReward': GameItemBackground.QPReward
} as ReadonlyRecord<AtlasAcademy.NiceItemBGType, GameItemBackground>;

/**
 * Maps the `NiceItemUse` values to the `GameItemUsage`
 * enum values.
 */
const ItemUsageMap = {
    'skill': GameItemUsage.Skill,
    'ascension': GameItemUsage.Ascension,
    'costume': GameItemUsage.Costume
} as ReadonlyRecord<AtlasAcademy.NiceItemUse, GameItemUsage>;

//#endregion


//#region Additional data

/**
 * Types of items that are imported even if they don't have any enhancement
 * uses defined.
 */
const AdditionalItemImportTypes = new Set<AtlasAcademy.NiceItemType>([
    'questRewardQp',    // QP
    'chargeStone',      // Saint quartz
    'gachaTicket',      // Summon tickets
    'friendPoint',      // Friend points
    'anonymous',        // USOs
    'tdLvUp'            // Statues and grails
]) as ReadonlySet<AtlasAcademy.NiceItemType>;

//#endregion


/**
 * Helper class for internal use only, do not add to module exports.
 */
export class NiceItemsToGameItemsTransformWorker {

    private readonly _niceItemEnMap: Record<number, AtlasAcademy.NiceItem>;

    constructor(
        private readonly _niceItemsJp: ReadonlyArray<AtlasAcademy.NiceItem>,
        niceItemsEn: ReadonlyArray<AtlasAcademy.NiceItem>,
        private readonly _logger?: TransformLogger
    ) {
        this._niceItemEnMap = AtlasAcademyTransformUtils.toMap(niceItemsEn);
    }

    /**
     * Uncaught exceptions may be thrown.
     */
    transform(): Array<GameItem> {
        const result: Array<GameItem> = [];
        for (const niceItemJp of this._niceItemsJp) {
            const gameItem = this._transformItemData(niceItemJp);
            if (gameItem) {
                result.push(gameItem);
            }
        }
        return result;
    }

    private _transformItemData(niceItem: AtlasAcademy.NiceItem): GameItem | null {
        if (!this._shouldImportItem(niceItem)) {
            return null;
        }

        this._logger?.info(niceItem.id, 'Processing item');

        const background = ItemBackgroundMap[niceItem.background];
        const uses = niceItem.uses.map(use => ItemUsageMap[use]);
        const result: GameItem = {
            _id: niceItem.id,
            name: niceItem.name,
            description: niceItem.detail,
            background,
            uses
        };
        this._populateItemEnglishStrings(result);
        this._additionalTransforms(result);

        this._logger?.info(niceItem.id, 'Item processed');
        return result;
    }

    /**
     * Only enhancement items and a select number of master items will be imported.
     */
    private _shouldImportItem(item: AtlasAcademy.NiceItem): boolean {
        const { type, uses } = item;
        if (uses.length) {
            // Always import if the item has enhancement uses defined.
            return true;
        }
        return AdditionalItemImportTypes.has(type);
    }

    /**
     * Populate the given item with English strings using the given lookup map. If the
     * string data is not present in the map, the Japanese values will be retained.
     */
    private _populateItemEnglishStrings(gameItem: GameItem): void {
        const strings = this._niceItemEnMap[gameItem._id];
        if (!strings) {
            this._logger?.warn(
                `English strings not available for item with ID ${gameItem._id}. 
                English string population will be skipped.`
            );
            return;
        }
        gameItem.name = strings.name;
        gameItem.description = strings.detail;
    }

    private _additionalTransforms(gameItem: GameItem) {
        /**
         * Friend Point ID should be 12 to match its image ID.
         */
        if (gameItem._id === 4) {
            gameItem._id = 12;
        }
        /**
         * Remove 'Quest Clear Reward' from QP name.
         */
        if (gameItem._id === 5) {
            gameItem.name = QpName;
        }
    }

}
