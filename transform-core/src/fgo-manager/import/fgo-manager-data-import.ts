import { Array2D, ImmutableRecord } from '@fgo-planner/common-core';
import { GameServant, NewMasterServantUpdate } from '@fgo-planner/data-core';
import { TransformLogger } from '../../logger';
import { RosterSheetToMasterServantUpdatesTransformWorker } from './roster-sheet-to-master-servant-updates-transform-worker';

/**
 * Transforms the 'Roster' sheet data from FGO Manager (exported as CSV) into an
 * array of `NewMasterServantUpdate` objects that can be used to add new
 * servants and/or update existing servants.
 *
 * @param sheetData The CSV data, in the form of a 2D string array.
 *
 * @param gameServantNameMap Map of FGO Manager servant names to their
 * corresponding `GameServant` objects.
 *
 * @param logger (optional) Logger to append logs to.
 *
 * @return An array of `NewMasterServantUpdate` that can be used to update the
 * master account's servants.
 */
export function transformRosterSheetToMasterServantUpdates(
    sheetData: Array2D<string>,
    gameServantNameMap: ImmutableRecord<string, GameServant>,
    logger?: TransformLogger
): Array<NewMasterServantUpdate> {

    try {
        const worker = new RosterSheetToMasterServantUpdatesTransformWorker(
            sheetData,
            gameServantNameMap,
            logger
        );
        return worker.parse();
        
    } catch (e: any) {
        const message: string = typeof e === 'string' ? e : e.message;
        logger?.error(message);
    }
    
    return [];
}
