import { Array2D, Immutable } from '@fgo-planner/common-core';
import { BatchMasterServantUpdate, GameServant } from '@fgo-planner/data-core';
import { MasterAccountImportData, TransformLogger } from '../../common';
import { RosterSheetToMasterServantUpdatesTransformWorker } from './RosterSheetToMasterServantUpdatesTransformWorker';

/**
 * Transforms the 'Roster' sheet data from FGO Manager (exported as CSV) into an
 * array of `BatchMasterServantUpdate` objects that can be used to add new
 * servants and/or update existing servants.
 *
 * @param sheetData The CSV data, in the form of a 2D string array.
 *
 * @param gameServantNameMap Map of FGO Manager servant names to their
 * corresponding `GameServant` objects.
 *
 * @param logger (optional) A logger to use in place of the default
 * `TransformLogger`.
 *
 * @return A `MasterAccountImportData` data transfer object containing a
 * `BatchMasterServantUpdate` array. 
 */
export function transformRosterSheetToMasterAccountImportData(
    sheetData: Array2D<string>,
    gameServantNameMap: ReadonlyMap<string, Immutable<GameServant>>,
    logger = new TransformLogger()
): MasterAccountImportData {

    const servants = _transformRosterSheetToMasterServantUpdates(sheetData, gameServantNameMap, logger);

    return {
        metadata: {},
        servants,
        logger
    };
}

function _transformRosterSheetToMasterServantUpdates(
    sheetData: Array2D<string>,
    gameServantNameMap: ReadonlyMap<string, Immutable<GameServant>>,
    logger: TransformLogger
): Array<BatchMasterServantUpdate> {

    try {
        const worker = new RosterSheetToMasterServantUpdatesTransformWorker(
            sheetData,
            gameServantNameMap,
            logger
        );
        return worker.parse();

    } catch (e: any) {
        const message: string = typeof e === 'string' ? e : e.message;
        logger.error(message);
    }

    return [];
}
