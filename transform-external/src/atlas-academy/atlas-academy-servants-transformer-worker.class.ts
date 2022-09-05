import { ExternalLink, GameServant, GameServantAttribute, GameServantCardType, GameServantClass, GameServantCostume, GameServantEnhancement, GameServantGender, GameServantGrowthCurve, GameServantNoblePhantasm, GameServantNoblePhantasmTarget, GameServantRarity, GameServantSkillMaterials } from '@fgo-planner/data-types';
import { BaseLogger } from '../logger';
import { ReadonlyRecord } from '@fgo-planner/common-types';
import { AtlasAcademyTransformUtils } from './atlas-academy-transform.utils';
import { AtlasAcademyAttribute } from './types/atlas-academy-attribute.type';
import { AtlasAcademyNiceCardType } from './types/atlas-academy-nice-card-type.type';
import { FunctionType } from './types/atlas-academy-nice-function.type';
import { AtlasAcademyNiceGender } from './types/atlas-academy-nice-gender.type';
import { AtlasAcademyNiceLvlUpMaterial } from './types/atlas-academy-nice-lvl-up-material.type';
import { AscensionMaterialKey, AtlasAcademyNiceServant, SkillMaterialKey } from './types/atlas-academy-nice-servant.type';
import { AtlasAcademyNiceTd } from './types/atlas-academy-nice-td.type';
import { AtlasAcademySvtClass } from './types/atlas-academy-svt-class.type';

/**
 * Used internally by functions in `atlas-academy-data-transformers.ts`, do not
 * add to module exports.
 */
export class AtlasAcademyServantsTransformerWorker {

    //#region Constants

    private static readonly _AscensionLevelCount = 4;

    private static readonly _SkillLevelCount = 9;

    //#endregion


    //#region Enum maps

    /**
     * Maps the `AtlasAcademySvtClass` values to the `GameServantClass` enum
     * values.
     */
    private static readonly _ServantClassMap = {
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
        'demonGodPillar': GameServantClass.Unknown,
        'moonCancer': GameServantClass.MoonCancer,
        'foreigner': GameServantClass.Foreigner,
        'grandCaster': GameServantClass.Caster,
        'beastII': GameServantClass.BeastII,
        'beastI': GameServantClass.BeastI,
        'beastIIIR': GameServantClass.BeastIIIR,
        'beastIIIL': GameServantClass.BeastIIIL,
        'beastUnknown': GameServantClass.Unknown,
        'pretender': GameServantClass.Pretender,
        'unknown': GameServantClass.Unknown,
        'ALL': GameServantClass.Unknown // TODO Implement 'All' class
    } as ReadonlyRecord<AtlasAcademySvtClass, GameServantClass>;

    /**
     * Maps the `AtlasAcademyNiceGender` values to the `GameServantGender` enum
     * values.
     */
    private static readonly _ServantGenderMap = {
        'male': GameServantGender.Male,
        'female': GameServantGender.Female,
        'unknown': GameServantGender.None
    } as ReadonlyRecord<AtlasAcademyNiceGender, GameServantGender>;

    /**
     * Maps the `AtlasAcademyAttribute` values to the `GameServantAttribute` enum
     * values.
     */
    private static readonly _ServantAttributeMap = {
        'human': GameServantAttribute.Man,
        'sky': GameServantAttribute.Sky,
        'earth': GameServantAttribute.Earth,
        'star': GameServantAttribute.Star,
        'beast': GameServantAttribute.Beast
    } as ReadonlyRecord<AtlasAcademyAttribute, GameServantAttribute>;

    /**
     * Maps the `AtlasAcademyNiceCardType` values to the `GameServantCardType` enum
     * values.
     */
    private static readonly _ServantCardTypeMap = {
        'buster': GameServantCardType.Buster,
        'arts': GameServantCardType.Arts,
        'quick': GameServantCardType.Quick
    } as ReadonlyRecord<AtlasAcademyNiceCardType, GameServantCardType>;

    //#endregion


    private readonly _niceServantEnMap: Record<number, AtlasAcademyNiceServant>;

    constructor(
        private readonly _niceServantsJp: ReadonlyArray<AtlasAcademyNiceServant>,
        niceServantsEn: ReadonlyArray<AtlasAcademyNiceServant>,
        private readonly _logger?: BaseLogger<number>
    ) {
        this._niceServantEnMap = AtlasAcademyTransformUtils.toMap(niceServantsEn);
    }

    /**
     * Uncaught exceptions may be thrown.
     */
    transform(): Array<GameServant> {
        const result: Array<GameServant> = [];
        for (const niceServantJp of this._niceServantsJp) {
            const gameServant = this._transformServantData(niceServantJp);
            if (gameServant) {
                result.push(gameServant);
            }
        }
        return result;
    }

    private _transformServantData(niceServant: AtlasAcademyNiceServant): GameServant | null {

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
            for (let i = 0; i < AtlasAcademyServantsTransformerWorker._AscensionLevelCount; i++) {
                const ascensionMaterial = niceServant.ascensionMaterials[i as AscensionMaterialKey];
                /**
                 * Atlas Academy ascension materials start at index 0 instead of 1. We need to
                 * add 1 to the index to have it line up with target data model.
                 */
                ascensionMaterials[i + 1] = this._transformEnhancementMaterials(ascensionMaterial);
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

        const result: GameServant = {
            _id: niceServant.id,
            name: niceServant.name,
            collectionNo: niceServant.collectionNo,
            class: AtlasAcademyServantsTransformerWorker._ServantClassMap[niceServant.className],
            rarity: niceServant.rarity as GameServantRarity,
            cost: niceServant.cost,
            maxLevel: niceServant.lvMax,
            gender: AtlasAcademyServantsTransformerWorker._ServantGenderMap[niceServant.gender],
            attribute: AtlasAcademyServantsTransformerWorker._ServantAttributeMap[niceServant.attribute],
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
                displayName: niceServant.name,
                links: [] as Array<ExternalLink>
            }
        };

        this._populateServantEnglishStrings(result);

        this._logger?.info(niceServant.id, 'Servant processed');
        return result;
    }

    private _transformSkillMaterials(skillMaterials: Record<SkillMaterialKey, AtlasAcademyNiceLvlUpMaterial>): GameServantSkillMaterials {
        const result = {} as any;
        for (let i = 1; i <= AtlasAcademyServantsTransformerWorker._SkillLevelCount; i++) {
            const skillMaterial = skillMaterials[i as SkillMaterialKey];
            result[i] = this._transformEnhancementMaterials(skillMaterial);
        }
        return result;
    }

    /**
     * Converts an Atlas Academy `AtlasAcademyNiceLvlUpMaterial` object into a
     * `GameServantEnhancement` object.
     */
    private _transformEnhancementMaterials(material: AtlasAcademyNiceLvlUpMaterial): GameServantEnhancement {
        const materials = material.items.map(AtlasAcademyTransformUtils.transformItemAmountData);
        return {
            materials,
            qp: material.qp
        };
    }

    /**
     * Converts a servant's in-game growth curve ID to a `GameServantGrowthCurve`
     * value.
     */
    private _convertGrowthCurve(growthCurve: number): GameServantGrowthCurve {
        if (growthCurve <= 5) {
            return GameServantGrowthCurve.Linear;
        } else if (growthCurve <= 10) {
            return GameServantGrowthCurve.ReverseS;
        } else if (growthCurve <= 15) {
            return GameServantGrowthCurve.S;
        } else if (growthCurve <= 25) {
            return GameServantGrowthCurve.SemiReverseS;
        }
        return GameServantGrowthCurve.SemiS;
    }

    /**
     * Converts an array of Atlas Academy `AtlasAcademyNiceTd` into an array of
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
    private _parseNoblePhantasms(noblePhantasms: Array<AtlasAcademyNiceTd>): Array<GameServantNoblePhantasm> {
        const result = [] as Array<GameServantNoblePhantasm>;
        for (const { card, functions } of noblePhantasms) {
            const cardType = AtlasAcademyServantsTransformerWorker._ServantCardTypeMap[card];
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
    private _isDamagingNp(funcType: FunctionType): boolean {
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
    private _populateServantEnglishStrings(gameServant: GameServant): void {
        const servantEnData = this._niceServantEnMap[gameServant._id];
        if (!servantEnData) {
            this._logger?.warn(gameServant._id, 'English strings not available for servant. English string population will be skipped.');
            return;
        }
        /**
         * Populate English names
         */
        gameServant.name = servantEnData.name;
        gameServant.metadata.displayName = servantEnData.name;
        /**
         * Populate English costume names if available.
         */
        /** */
        const costumeEnDataMap = servantEnData.profile?.costume;
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
