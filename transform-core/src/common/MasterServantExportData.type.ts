import { InstantiatedServantAscensionLevel, InstantiatedServantBondLevel, InstantiatedServantNoblePhantasmLevel, InstantiatedServantSkillLevel } from '@fgo-planner/data-core';

export type MasterServantExportData = {
    
    instanceId: number;

    gameId: number;

    summoned: boolean;

    summonDate: number | null;

    np: InstantiatedServantNoblePhantasmLevel;

    level: number;

    ascension: InstantiatedServantAscensionLevel;

    fouAtk: number | null;

    fouHp: number | null;

    skills: {
        1: InstantiatedServantSkillLevel;
        2: InstantiatedServantSkillLevel | null;
        3: InstantiatedServantSkillLevel | null;
    };

    appendSkills: {
        1: InstantiatedServantSkillLevel | null;
        2: InstantiatedServantSkillLevel | null;
        3: InstantiatedServantSkillLevel | null;
    };

    bondLevel: InstantiatedServantBondLevel | null;

};
