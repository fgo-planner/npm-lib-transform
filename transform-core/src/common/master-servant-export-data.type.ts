import { MasterServantAscensionLevel, MasterServantBondLevel, MasterServantNoblePhantasmLevel, MasterServantSkillLevel } from '@fgo-planner/data-core';

export type MasterServantExportData = {
    
    instanceId: number;

    gameId: number;

    summoned: boolean;

    summonDate: number | null;

    np: MasterServantNoblePhantasmLevel;

    level: number;

    ascension: MasterServantAscensionLevel;

    fouAtk: number | null;

    fouHp: number | null;

    skills: {
        1: MasterServantSkillLevel;
        2: MasterServantSkillLevel | null;
        3: MasterServantSkillLevel | null;
    };

    appendSkills: {
        1: MasterServantSkillLevel | null;
        2: MasterServantSkillLevel | null;
        3: MasterServantSkillLevel | null;
    };

    bondLevel: MasterServantBondLevel | null;

};
