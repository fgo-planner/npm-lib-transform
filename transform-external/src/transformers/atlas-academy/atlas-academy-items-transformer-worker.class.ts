import { GameItem, GameItemBackground, GameItemUsage } from '@fgo-planner/data-types';
import { BaseLogger } from '../../logger';
import { ReadonlyRecord } from '../../types/internal';
import { AtlasAcademyTransformUtils } from './atlas-academy-transform.utils';
import { AtlasAcademyNiceItemBGType } from './types/atlas-academy-nice-item-bg-type.type';
import { AtlasAcademyNiceItemType } from './types/atlas-academy-nice-item-type.type';
import { AtlasAcademyNiceItemUse } from './types/atlas-academy-nice-item-use.type';
import { AtlasAcademyNiceItem } from './types/atlas-academy-nice-item.type';

/**
 * Used internally by `AtlasAcademyItemsTransformer`, do not add to module
 * exports.
 */
export class AtlasAcademyItemsTransformerWorker {

    //#region Constants

    private static readonly _QpName = 'Quantum Particles';

    //#endregion


    //#region Enum maps

    /**
     * Maps the `AtlasAcademyNiceItemBGType` values to the `GameItemBackground`
     * enum values.
     */
    private static readonly _ItemBackgroundMap = {
        'zero': GameItemBackground.None,
        'bronze': GameItemBackground.Bronze,
        'silver': GameItemBackground.Silver,
        'gold': GameItemBackground.Gold,
        'questClearQPReward': GameItemBackground.QPReward
    } as ReadonlyRecord<AtlasAcademyNiceItemBGType, GameItemBackground>;

    /**
     * Maps the `AtlasAcademyNiceItemUse` values to the `GameItemUsage`
     * enum values.
     */
    private static readonly _ItemUsageMap = {
        'skill': GameItemUsage.Skill,
        'ascension': GameItemUsage.Ascension,
        'costume': GameItemUsage.Costume
    } as ReadonlyRecord<AtlasAcademyNiceItemUse, GameItemUsage>;

    //#endregion


    //#region Additional data

    /**
     * Types of items that are imported even if they don't have any enhancement
     * uses defined.
     */
    private static readonly _AdditionalItemImportTypes = new Set<AtlasAcademyNiceItemType>([
        'questRewardQp',    // QP
        'chargeStone',      // Saint quartz
        'gachaTicket',      // Summon tickets
        'friendPoint',      // Friend points
        'anonymous',        // USOs
        'tdLvUp'            // Statues and grails
    ]);

    //#endregion


    private readonly _niceItemEnMap: Record<number, AtlasAcademyNiceItem>;

    constructor(
        private readonly _niceItemsJp: ReadonlyArray<AtlasAcademyNiceItem>,
        niceItemsEn: ReadonlyArray<AtlasAcademyNiceItem>,
        private readonly _logger?: BaseLogger<number>
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

    private _transformItemData(niceItem: AtlasAcademyNiceItem): GameItem | null {
        if (!this._shouldImportItem(niceItem)) {
            return null;
        }

        this._logger?.info(niceItem.id, 'Processing item');

        const background = AtlasAcademyItemsTransformerWorker._ItemBackgroundMap[niceItem.background];
        const uses = niceItem.uses.map(use => AtlasAcademyItemsTransformerWorker._ItemUsageMap[use]);
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
    private _shouldImportItem(item: AtlasAcademyNiceItem): boolean {
        const { type, uses } = item;
        if (uses.length) {
            // Always import if the item has enhancement uses defined.
            return true;
        }
        return AtlasAcademyItemsTransformerWorker._AdditionalItemImportTypes.has(type);
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
            gameItem.name = AtlasAcademyItemsTransformerWorker._QpName;
        }
    }

}
