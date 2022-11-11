import { ImportedMasterServantUpdate, ServantUpdateUtils } from '@fgo-planner/data-core';
import { MasterAccountImportData, MasterServantExportData, TransformLogger } from '../../common';
import { MasterAccountExportData } from '../../common/master-account-export-data.type';

const ImportedMasterServantUpdateType = 'Imported';

export function transformMasterAccountData(
    data: object,
    logger = new TransformLogger()
): MasterAccountImportData {

    const result = {
        logger
    } as MasterAccountImportData;

    let masterAccountData: MasterAccountExportData;
    try {
        masterAccountData = _validateData(data);
    } catch (e: any) {
        const message: string = typeof e === 'string' ? e : e.message;
        logger.error(message);
        return result;
    }

    const {
        source,
        resources,
        servants,
        costumes,
        soundtracks
    } = masterAccountData;

    result.metadata = {
        fgoPlannerSourceAccount: source
    };

    if (resources) {
        result.resources = resources;
    }

    if (servants) {
        result.servants = servants.map(_transformMasterServant);
    }

    if (costumes) {
        result.costumes = costumes;
    }

    if (soundtracks) {
        result.soundtracks = soundtracks;
    }

    return result;
}

function _validateData(data: object): MasterAccountExportData {

    // TODO Implement data validation

    return data as MasterAccountExportData;
}

function _transformMasterServant(masterServant: MasterServantExportData): ImportedMasterServantUpdate {

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
        },
        bondLevel
    } = masterServant;

    return {
        type: ImportedMasterServantUpdateType,
        instanceId,
        gameId,
        summoned: ServantUpdateUtils.fromBoolean(summoned),
        summonDate: summonDate,
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
        },
        bondLevel,
        unlockedCostumes: new Map()
    };

}
