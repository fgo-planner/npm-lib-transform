

import { ArrayUtils, ReadonlyRecord } from '@fgo-planner/common-core';
import { GameItemQuantityUtils, ImmutableMasterAccount, ImmutableMasterServant, MasterServantBondLevel } from '@fgo-planner/data-core';
import { MasterAccountExportData } from './master-account-export-data.type';
import { MasterServantExportData } from './master-servant-export-data.type';

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

    const exportedItems = ArrayUtils.mapArrayToObject(items, GameItemQuantityUtils.getItemId, GameItemQuantityUtils.getQuantity);

    return {
        source: {
            id: String(_id),
            name,
            friendId
        },
        servants: exportedServants,
        resources: {
            items: exportedItems,
            qp
        },
        costumes: [...costumes],
        soundtracks: [...soundtracks]
    };

}

function _transformMasterServant(
    masterServant: ImmutableMasterServant,
    bondLevels: ReadonlyRecord<number, MasterServantBondLevel>
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
