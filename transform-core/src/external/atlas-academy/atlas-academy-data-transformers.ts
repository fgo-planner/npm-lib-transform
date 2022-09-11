import { GameItem, GameServant, GameSoundtrack } from '@fgo-planner/data-core';
import { TransformLogger } from '../../logger';
import { AtlasAcademyItemsTransformer } from './atlas-academy-items-transformer.class';
import { AtlasAcademyServantsTransformer } from './atlas-academy-servants-transformer.class';
import { AtlasAcademySoundtracksTransformer } from './atlas-academy-soundtracks-transformer.class';
import { AtlasAcademyNiceBgmEntity } from './types/atlas-academy-nice-bgm-entity.type';
import { AtlasAcademyNiceItem } from './types/atlas-academy-nice-item.type';
import { AtlasAcademyNiceServant } from './types/atlas-academy-nice-servant.type';

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
export function transformNiceItems(
    niceItemsJp: ReadonlyArray<AtlasAcademyNiceItem>,
    niceItemsEn: ReadonlyArray<AtlasAcademyNiceItem>,
    logger?: TransformLogger
): Array<GameItem> {

    const worker = new AtlasAcademyItemsTransformer(
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
export function transformNiceServants(
    niceServantsJp: ReadonlyArray<AtlasAcademyNiceServant>,
    niceServantsEn: ReadonlyArray<AtlasAcademyNiceServant>,
    logger?: TransformLogger
): Array<GameServant> {

    const worker = new AtlasAcademyServantsTransformer(
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
export function transformNiceBgmEntities(
    niceSoundtracksJp: ReadonlyArray<AtlasAcademyNiceBgmEntity>,
    logger?: TransformLogger
): Array<GameSoundtrack> {

    const worker = new AtlasAcademySoundtracksTransformer(
        niceSoundtracksJp,
        logger
    );

    return worker.transform();
}
