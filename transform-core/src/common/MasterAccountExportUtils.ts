

import { Immutable, ReadonlyRecord, DateTimeUtils } from '@fgo-planner/common-core';
import { MasterAccount, MasterServant, InstantiatedServantBondLevel } from '@fgo-planner/data-core';
import { MasterAccountExportData } from './MasterAccountExportData.type';
import { MasterServantExportData } from './MasterServantExportData.type';

export function transformMasterAccount<ID = string>(masterAccount: Immutable<MasterAccount<ID>>): MasterAccountExportData {

    const {
        _id,
        name,
        friendId,
        resources: {
            items,
            qp
        },
        servants: {
            servants,
            bondLevels
        },
        costumes,
        soundtracks
    } = masterAccount;

    const exportedServants = servants.map(servant => _transformMasterServant(servant, bondLevels));

    return {
        source: {
            id: String(_id),
            name,
            friendId
        },
        servants: {
            servants: exportedServants
        },
        resources: {
            items: { ...items },
            qp
        },
        costumes: {
            unlocked: [...costumes.unlocked],
            noCostUnlock: [...costumes.noCostUnlock]
        },
        soundtracks: {
            unlocked: [...soundtracks.unlocked]
        }
    };

}

function _transformMasterServant(
    masterServant: Immutable<MasterServant>,
    bondLevels: ReadonlyRecord<number, InstantiatedServantBondLevel>
): MasterServantExportData {

    const {
        instanceId,
        servantId,
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
            3: skill3
        },
        appendSkills: {
            1: appendSkill1,
            2: appendSkill2,
            3: appendSkill3
        }
    } = masterServant;

    const bondLevel = bondLevels[servantId];

    return {
        instanceId,
        servantId,
        summoned,
        summonDate: DateTimeUtils.getTime(summonDate) || null,
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
