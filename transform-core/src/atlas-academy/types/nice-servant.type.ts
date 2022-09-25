import { Attribute } from './attribute.type';
import { BasicServant } from './basic-servant.type';
import { NiceGender } from './nice-gender.type';
import { NiceLvlUpMaterial } from './nice-lvl-up-material.type';
import { NiceServantProfile } from './nice-servant-profile.type';
import { NiceTd } from './nice-td.type';

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
