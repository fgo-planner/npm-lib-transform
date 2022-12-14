

import { ReadonlyRecord } from '@fgo-planner/common-core';
import { ImmutableMasterAccount, ImmutableMasterServant, InstantiatedServantBondLevel } from '@fgo-planner/data-core';
import { MasterAccountExportData } from './MasterAccountExportData.type';
import { MasterServantExportData } from './MasterServantExportData.type';

export function transformMasterAccount<ID = string>(masterAccount: ImmutableMasterAccount<ID>): MasterAccountExportData {

    const {
        _id,
        name,
        friendId,
        resources: {
            items,
            qp
        },
        servants,
        costumes,
        bondLevels,
        soundtracks
    } = masterAccount;

    const exportedServants = servants.map(servant => _transformMasterServant(servant, bondLevels));

    return {
        source: {
            id: String(_id),
            name,
            friendId
        },
        servants: exportedServants,
        resources: {
            items: { ...items },
            qp
        },
        costumes: [...costumes],
        soundtracks: [...soundtracks]
    };

}

function _transformMasterServant(
    masterServant: ImmutableMasterServant,
    bondLevels: ReadonlyRecord<number, InstantiatedServantBondLevel>
): MasterServantExportData {

    const {
        instanceId,
        gameId,
        summoned,
        summonDate,
        np,
        level,
        ascension,
        fouAtk,
        fouHp,
        skills: {
            1: skill1,
            2: skill2,
            3: skill3,
        },
        appendSkills: {
            1: appendSkill1,
            2: appendSkill2,
            3: appendSkill3,
        }
    } = masterServant;

    const bondLevel = bondLevels[gameId];

    return {
        instanceId,
        gameId,
        summoned,
        summonDate: summonDate ? summonDate.getTime() : null,
        np,
        level,
        ascension,
        fouAtk: fouAtk ?? null,
        fouHp: fouHp ?? null,
        skills: {
            1: skill1,
            2: skill2 ?? null,
            3: skill3 ?? null
        },
        appendSkills: {
            1: appendSkill1 ?? null,
            2: appendSkill2 ?? null,
            3: appendSkill3 ?? null
        },
        bondLevel
    };

}
