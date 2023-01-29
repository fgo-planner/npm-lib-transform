import { GameItem, GameServantWithMetadata, GameSoundtrack } from '@fgo-planner/data-core';
import { TransformLogger } from '../../common/logger';
import { NiceBgmEntity } from '../types/NiceBgmEntity.type';
import { NiceItem } from '../types/NiceItem.type';
import { NiceServant } from '../types/NiceServant.type';
import { NiceBgmEntitiesToGameSoundtrackTransformWorker } from './NiceBgmEntitiesToGameSoundtracksTransformWorker';
import { NiceItemsToGameItemsTransformWorker } from './NiceItemsToGameItemsTransformWorker';
import { NiceServantsToGameServantsTransformWorker } from './NiceServantsToGameServantsTransformWorker';

/**
 * Transforms an array of `NiceItem` from Atlas Academy to an array of
 * `GameItem`.
 *
 * @param niceItemsJp JP Material with English names from Atlas Academy API.
 *
 * @param niceItemsEn NA Material from Atlas Academy API. This is needed because
 * as of 9/3/2022, the "JP Material with English names" does not include English
 * descriptions.
 *
 * @param logger (optional) Logger to append logs to.
 *
 * @returns Array of `GameItem`.
 */
export function transformNiceItemsToGameItems(
    niceItemsJp: ReadonlyArray<NiceItem>,
    niceItemsEn: ReadonlyArray<NiceItem>,
    logger?: TransformLogger
): Array<GameItem> {

    const worker = new NiceItemsToGameItemsTransformWorker(
        niceItemsJp,
        niceItemsEn,
        logger
    );

    return worker.transform();
}

/**
 * Transforms an array of `NiceServant` from Atlas Academy to an array of
 * `GameServant`.
 *
 * @param niceServantsJp JP Servant with English names and lore from Atlas
 * Academy API.
 *
 * @param niceServantsEn NA Material from Atlas Academy API. This is needed
 * because as of 9/3/2022, the "JP Servant with English names and lore" does not
 * include English costume names.
 *
 * @param logger (optional) Logger to append logs to.
 *
 * @returns Array of `GameServant`.
 */
export function transformNiceServantsToGameServants(
    niceServantsJp: ReadonlyArray<NiceServant>,
    niceServantsEn: ReadonlyArray<NiceServant>,
    logger?: TransformLogger
): Array<GameServantWithMetadata> {

    const worker = new NiceServantsToGameServantsTransformWorker(
        niceServantsJp,
        niceServantsEn,
        logger
    );

    return worker.transform();
}

/**
 * Transforms an array of `NiceBgmEntity` from Atlas Academy to an array of
 * `GameSoundtrack`.
 *
 * @param niceSoundtracksJp JP BGM with English names from Atlas Academy API.
 *
 * @param logger (optional) Logger to append logs to.
 *
 * @returns Array of `GameSoundtrack`.
 */
export function transformNiceBgmEntitiesToGameSoundtracks(
    niceSoundtracksJp: ReadonlyArray<NiceBgmEntity>,
    logger?: TransformLogger
): Array<GameSoundtrack> {

    const worker = new NiceBgmEntitiesToGameSoundtrackTransformWorker(
        niceSoundtracksJp,
        logger
    );

    return worker.transform();
}
