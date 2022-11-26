import { Attribute } from './Attribute.type';
import { BasicServant } from './BasicServant.type';
import { NiceGender } from './NiceGender.type';
import { NiceLvlUpMaterial } from './NiceLvlUpMaterial.type';
import { NiceServantProfile } from './NiceServantProfile.type';
import { NiceTd } from './NiceTd.type';

type AscensionMaterialKey = 0 | 1 | 2 | 3;

type SkillMaterialKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Partial type definition for Atlas Academy's `NiceServant` data schema.
 */
export type NiceServant = BasicServant & {
    cost: number;
    lvMax: number;
    gender: NiceGender;
    attribute: Attribute;
    atkBase: number;
    atkMax: number;
    hpBase: number;
    hpMax: number;
    growthCurve: number;
    ascensionMaterials: Record<AscensionMaterialKey, NiceLvlUpMaterial>;
    skillMaterials: Record<SkillMaterialKey, NiceLvlUpMaterial>;
    appendSkillMaterials: Record<SkillMaterialKey, NiceLvlUpMaterial>;
    costumeMaterials: Record<number, NiceLvlUpMaterial>;
    noblePhantasms: Array<NiceTd>;
    profile?: NiceServantProfile;
};
