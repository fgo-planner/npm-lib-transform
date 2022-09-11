import { Array2D, ImmutableRecord } from '@fgo-planner/common-core';
import { GameServant, NewMasterServantUpdate } from '@fgo-planner/data-core';
import { TransformLogger } from '../../logger';
import { FgoManagerRosterParser } from './fgo-manager-roster-parser.class';

/**
 * Transform the 'Roster' sheet data from FGO Manager (exported as CSV) into an
 * array of `NewMasterServantUpdate`.
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
export function parseRosterSheet(
    sheetData: Array2D<string>,
    gameServantNameMap: ImmutableRecord<string, GameServant>,
    logger?: TransformLogger
): Array<NewMasterServantUpdate> {

    try {
        const worker = new FgoManagerRosterParser(
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
