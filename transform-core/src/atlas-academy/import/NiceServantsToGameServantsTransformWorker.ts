import { ReadonlyRecord, StringUtils } from '@fgo-planner/common-core';
import { GameServantAttribute, GameServantCardType, GameServantClass, GameServantCostume, GameServantEnhancement, GameServantGender, GameServantGrowthCurveBase, GameServantNoblePhantasm, GameServantNoblePhantasmTarget, GameServantRarity, GameServantSkillMaterials, GameServantWithMetadata, SearchTag } from '@fgo-planner/data-core';
import { TransformLogger } from '../../common/logger';
import { AtlasAcademyTransformUtils } from '../AtlasAcademyTransformUtils';
import * as AtlasAcademy from '../types/atlas-academy';
import { AtlasAcademyServantTransformOptions } from '../types/AtlasAcademyServantTransformOptions.type';

//#region Constants

const AscensionLevelCount = 4;

const SkillLevelCount = 9;

const UnknownErrorMessage = 'Unknown error';

//#endregion


//#region Enum maps

/**
 * Maps the `SvtClass` values to the `GameServantClass` enum values.
 */
const ServantClassMap = {
    'saber': GameServantClass.Saber,
    'archer': GameServantClass.Archer,
    'lancer': GameServantClass.Lancer,
    'rider': GameServantClass.Rider,
    'caster': GameServantClass.Caster,
    'assassin': GameServantClass.Assassin,
    'berserker': GameServantClass.Berserker,
    'shielder': GameServantClass.Shielder,
    'ruler': GameServantClass.Ruler,
    'alterEgo': GameServantClass.AlterEgo,
    'avenger': GameServantClass.Avenger,
    'demonGodPillar': GameServantClass.DemonGodPillar,
    'moonCancer': GameServantClass.MoonCancer,
    'foreigner': GameServantClass.Foreigner,
    'pretender': GameServantClass.Pretender,
    'grandCaster': GameServantClass.GrandCaster,
    'beastII': GameServantClass.BeastII,
    'ushiChaosTide': GameServantClass.UshiChaosTide,
    'beastI': GameServantClass.BeastI,
    'beastILost': GameServantClass.BeastILost,
    'beastIIIR': GameServantClass.BeastIIIR,
    'beastIIIL': GameServantClass.BeastIIIL,
    'beastIV': GameServantClass.BeastIV,
    'beastUnknown': GameServantClass.BeastUnknown,
    'unknown': GameServantClass.Unknown,
    'agarthaPenth': GameServantClass.AgarthaPenth,
    'cccFinaleEmiyaAlter': GameServantClass.CCCFinaleEmiyaAlter,
    'salemAbby': GameServantClass.SalemAbby,
    'uOlgaMarie': GameServantClass.UOlgaMarie,
    'uOlgaMarieAlienGod': GameServantClass.UOlgaMarieAlienGod,
    'beast': GameServantClass.Beast,
    'beastVI': GameServantClass.BeastVI,
    'atlasUnmappedClass': GameServantClass.Unknown,
    'ALL': GameServantClass.All
} as ReadonlyRecord<AtlasAcademy.SvtClass, GameServantClass>;

/**
 * Maps the `NiceGender` values to the `GameServantGender` enum values.
 */
const ServantGenderMap = {
    'male': GameServantGender.Male,
    'female': GameServantGender.Female,
    'unknown': GameServantGender.Unknown
} as ReadonlyRecord<AtlasAcademy.NiceGender, GameServantGender>;

/**
 * Maps the `Attribute` values to the `GameServantAttribute` enum values.
 */
const ServantAttributeMap = {
    'human': GameServantAttribute.Man,
    'sky': GameServantAttribute.Sky,
    'earth': GameServantAttribute.Earth,
    'star': GameServantAttribute.Star,
    'beast': GameServantAttribute.Beast
} as ReadonlyRecord<AtlasAcademy.Attribute, GameServantAttribute>;

/**
 * Maps the `NiceCardType` values to the `GameServantCardType` enum
 * values.
 */
const ServantCardTypeMap = {
    'buster': GameServantCardType.Buster,
    'arts': GameServantCardType.Arts,
    'quick': GameServantCardType.Quick
} as ReadonlyRecord<AtlasAcademy.NiceCardType, GameServantCardType>;

//#endregion


/**
 * Helper class for internal use only, do not add to module exports.
 */
export class NiceServantsToGameServantsTransformWorker {

    private readonly _niceServantEnMap: Record<number, AtlasAcademy.NiceServant>;

    constructor(
        private readonly _niceServantsJp: ReadonlyArray<AtlasAcademy.NiceServant>,
        niceServantsEn: ReadonlyArray<AtlasAcademy.NiceServant>,
        private readonly _options: AtlasAcademyServantTransformOptions,
        private readonly _logger?: TransformLogger
    ) {
        this._niceServantEnMap = AtlasAcademyTransformUtils.toMap(niceServantsEn);
    }

    /**
     * Uncaught exceptions may be thrown.
     */
    transform(): Array<GameServantWithMetadata> {
        const {
            minCollectionNo = 0,
            maxCollectionNo = Number.MAX_SAFE_INTEGER
        } = this._options;

        this._logger?.info(`Only servants collectionNo between ${minCollectionNo} and ${maxCollectionNo} will be processed.`);

        const result: Array<GameServantWithMetadata> = [];
        for (const niceServantJp of this._niceServantsJp) {
            if (niceServantJp.collectionNo < minCollectionNo || niceServantJp.collectionNo > maxCollectionNo) {
                continue;
            }
            try {
                const gameServant = this._transformServantData(niceServantJp);
                if (gameServant) {
                    result.push(gameServant);
                }
            } catch (error: unknown) {
                let errorMessage: string;
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                } else {
                    errorMessage = UnknownErrorMessage;
                }
                this._logger?.error(niceServantJp.id, `Error occurred while processing servant: ${errorMessage}`);
            }
        }
        return result;
    }

    private _transformServantData(niceServant: AtlasAcademy.NiceServant): GameServantWithMetadata | null {

        /**
         * Currently only normal servants (and Mash) are supported.
         */
        if (niceServant.type !== 'normal' && niceServant.type !== 'heroine') {
            return null;
        }

        this._logger?.info(niceServant.id, `Processing servant collectionNo=${niceServant.collectionNo}`);

        let ascensionMaterials: any;
        /**
         * Mash does not have any ascension materials to import.
         */
        if (niceServant.type !== 'heroine') {
            ascensionMaterials = {};
            for (let i = 0; i < AscensionLevelCount; i++) {
                const ascensionMaterialKey = i as keyof AtlasAcademy.NiceServant['ascensionMaterials'];
                const ascensionMaterial = niceServant.ascensionMaterials[ascensionMaterialKey];
                /**
                 * Atlas Academy ascension materials start at index 0 instead of 1. We need to
                 * add 1 to the index to have it line up with target data model.
                 */
                ascensionMaterials[ascensionMaterialKey + 1] = this._transformEnhancementMaterials(ascensionMaterial);
            }
        }

        const skillMaterials = this._transformSkillMaterials(niceServant.skillMaterials);

        const appendSkillMaterials = this._transformSkillMaterials(niceServant.appendSkillMaterials);

        const costumes: Record<number, GameServantCostume> = {};
        if (niceServant.profile) {
            const costumeEntries = Object.entries(niceServant.profile.costume);
            for (const [id, costume] of costumeEntries) {
                const costumeId = Number(id); // Costume IDs should always be numbers.
                let materials: GameServantEnhancement;
                const costumeMaterials = niceServant.costumeMaterials[costumeId];
                /**
                 * Some costumes do not require materials (ie. Mash's idol costume). For these
                 * costumes, the map will not contain an entry for the costume's ID.
                 */
                if (!costumeMaterials) {
                    materials = { materials: [], qp: 0 };
                } else {
                    materials = this._transformEnhancementMaterials(costumeMaterials);
                }
                costumes[costumeId] = {
                    collectionNo: costume.costumeCollectionNo,
                    name: costume.name,
                    materials
                };
            }
        }

        const np = this._parseNoblePhantasms(niceServant.noblePhantasms);

        const result: GameServantWithMetadata = {
            _id: niceServant.id,
            name: niceServant.name,
            displayName: niceServant.name,
            collectionNo: niceServant.collectionNo,
            class: ServantClassMap[niceServant.className],
            rarity: niceServant.rarity as GameServantRarity,
            cost: niceServant.cost,
            maxLevel: niceServant.lvMax,
            gender: ServantGenderMap[niceServant.gender],
            attribute: ServantAttributeMap[niceServant.attribute],
            hpBase: niceServant.hpBase,
            hpMax: niceServant.hpMax,
            atkBase: niceServant.atkBase,
            atkMax: niceServant.atkMax,
            growthCurve: this._convertGrowthCurve(niceServant.growthCurve),
            ascensionMaterials,
            skillMaterials,
            appendSkillMaterials,
            costumes,
            np,
            metadata: {
                searchTags: [],
                links: []
            }
        };

        this._populateServantEnglishStrings(result, niceServant);

        this._logger?.info(niceServant.id, 'Servant processed');
        return result;
    }

    private _transformSkillMaterials(skillMaterials: AtlasAcademy.NiceServant['skillMaterials']): GameServantSkillMaterials {
        const result = {} as any;
        for (let i = 1; i <= SkillLevelCount; i++) {
            const skillMaterialKey = i as keyof AtlasAcademy.NiceServant['skillMaterials'];
            const skillMaterial = skillMaterials[skillMaterialKey];
            result[skillMaterialKey] = this._transformEnhancementMaterials(skillMaterial);
        }
        return result;
    }

    /**
     * Converts an Atlas Academy `NiceLvlUpMaterial` object into a
     * `GameServantEnhancement` object.
     */
    private _transformEnhancementMaterials(material: AtlasAcademy.NiceLvlUpMaterial): GameServantEnhancement {
        const materials = AtlasAcademyTransformUtils.transformItemAmountData(material.items);
        return {
            materials,
            qp: material.qp
        };
    }

    /**
     * Converts a servant's growth curve ID to a `GameServantGrowthCurveBase` value.
     */
    private _convertGrowthCurve(growthCurve: number): GameServantGrowthCurveBase {
        if (growthCurve <= 5) {
            return GameServantGrowthCurveBase.Linear;
        } else if (growthCurve <= 10) {
            return GameServantGrowthCurveBase.ReverseS;
        } else if (growthCurve <= 15) {
            return GameServantGrowthCurveBase.S;
        } else if (growthCurve <= 25) {
            return GameServantGrowthCurveBase.SemiReverseS;
        }
        return GameServantGrowthCurveBase.SemiS;
    }

    /**
     * Converts an array of Atlas Academy `NiceTd` into an array of
     * `GameServantNoblePhantasm`.
     *
     * Note that for the GameServantNoblePhantasm array, we only care about unique
     * combinations of card and target types. Examples:
     *
     * - Fairy Knight Lancelot has two noble phantasms: an arts type single target
     *   and a buster type AOE. She will have two entries in the resulting array.
     *
     * - Space Ishtar has switchable noble phantasm card types. She will have three
     *   entries in the resulting array.
     *
     * - Mash has two noble phantasm, but both are support art types. She will only
     *   have one entry in the resulting array.
     *
     */
    private _parseNoblePhantasms(noblePhantasms: Array<AtlasAcademy.NiceTd>): Array<GameServantNoblePhantasm> {
        const result = [] as Array<GameServantNoblePhantasm>;
        for (const { card, functions } of noblePhantasms) {
            const cardType = ServantCardTypeMap[card];
            if (!cardType) {
                this._logger?.error(`Unknown card type '${card}' encountered when parsing noble phantasm.`);
                continue;
            }
            let isDamageNp = false;
            let isAoe = false;
            for (const { funcType, funcTargetType } of functions) {
                if (this._isDamagingNp(funcType)) {
                    isDamageNp = true;
                    isAoe = funcTargetType === 'enemyAll';
                    break; // Assume that there is only one 'damageNp' function for each noble phantasm.
                }
            }
            const target = !isDamageNp ? GameServantNoblePhantasmTarget.Support
                : isAoe ? GameServantNoblePhantasmTarget.All : GameServantNoblePhantasmTarget.One;
            /**
             * Whether the combination already exists in the result.
             */
            let exists = false;
            for (const np of result) {
                if (np.cardType === cardType && np.target === target) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                result.push({ cardType, target });
            }
        }
        return result;
    }

    /**
     * Determines if the given function type indicates a damaging noble phantasm.
     */
    private _isDamagingNp(funcType: AtlasAcademy.FunctionType): boolean {
        return funcType === 'damageNp' ||
            funcType === 'damageNpPierce' ||
            funcType === 'damageNpIndividual' ||
            funcType === 'damageNpStateIndividual' ||
            funcType === 'damageNpCounter' ||
            funcType === 'damageNpStateIndividualFix' ||
            funcType === 'damageNpSafe' ||
            funcType === 'damageNpRare' ||
            funcType === 'damageNpAndCheckIndividuality' ||
            funcType === 'damageNpIndividualSum';
    }

    /**
     * Populate the given servant with their English strings using the lookup map.
     * If the name is not present in the map, the Japanese names will be retained.
     */
    private _populateServantEnglishStrings(gameServant: GameServantWithMetadata, niceServant: AtlasAcademy.NiceServant): void {
        const niceServantEn = this._niceServantEnMap[gameServant._id];
        if (!niceServantEn) {
            this._logger?.warn(gameServant._id, 'EN data not available for servant.');
            /**
             * Populate search tags from JP data.
             */
            this._populateSearchTags(gameServant, niceServant);
        } else {
            /**
             * Populate English names.
             */
            gameServant.name = niceServantEn.name;
            gameServant.displayName = niceServantEn.name;
            /**
             * Populate search tags.
             */
            this._populateSearchTags(gameServant, niceServantEn);
            /**
             * Populate English costume names if available.
             */
            /** */
            const costumeEnDataMap = niceServantEn.profile?.costume;
            if (costumeEnDataMap) {
                const costumeEntries = Object.entries(gameServant.costumes);
                for (const [id, costume] of costumeEntries) {
                    const costumeEnData = costumeEnDataMap[Number(id)];
                    if (!costumeEnData) {
                        continue;
                    }
                    costume.name = costumeEnData.name;
                }
            }
        }
    }

    private _populateSearchTags(gameServant: GameServantWithMetadata, niceServant: AtlasAcademy.NiceServant): void {

        const {
            name,
            ascensionAdd: {
                overWriteServantName,
                overWriteServantBattleName
            }
        } = niceServant;

        const searchTags = gameServant.metadata.searchTags;

        this._addSearchTag(StringUtils.normalizeDiacritic(name), searchTags);

        for (let value of Object.values(overWriteServantName.ascension)) {
            value = StringUtils.normalizeDiacritic(value);
            if (!this._isInSearchTags(value, searchTags)) {
                this._addSearchTag(value, searchTags);
            }
        }

        for (let value of Object.values(overWriteServantBattleName.ascension)) {
            value = StringUtils.normalizeDiacritic(value);
            if (!this._isInSearchTags(value, searchTags)) {
                this._addSearchTag(value, searchTags);
            }
        }
    }

    private _addSearchTag(value: string, searchTags: Array<SearchTag>): void {
        searchTags.push({
            value,
            enabled: true
        });
    }

    /**
     * Checks whether the value already exists in the search tags.
     */
    private _isInSearchTags(value: string, searchTags: Array<SearchTag>): boolean {
        value = value.toLowerCase();
        for (const searchTag of searchTags) {
            if (searchTag.value.toLowerCase().indexOf(value) !== -1) {
                return true;
            }
        }
        return false;
    }

}
