import { GameItem } from '@fgo-planner/data-types';
import { BaseLogger } from '../../logger';
import { AtlasAcademyItemsTransformerWorker } from './atlas-academy-items-transformer-worker.class';
import { AtlasAcademyNiceItem } from './types/atlas-academy-nice-item.type';

/**
 * Transforms an array of `NiceItem` from Atlas Academy to an array of
 * `GameItem`.
 *
 * Note that as of 9/3/2022, the JP item data with English names does not
 * include English descriptions, so additional English data set from NA is
 * needed.
 */
export class AtlasAcademyItemsTransformer {

    private constructor() {
        
    }

    static transform(
        niceItemsJp: ReadonlyArray<AtlasAcademyNiceItem>,
        niceItemsEn: ReadonlyArray<AtlasAcademyNiceItem>,
        logger?: BaseLogger<number>
    ): Array<GameItem> {

        const worker = new AtlasAcademyItemsTransformerWorker(
            niceItemsJp,
            niceItemsEn,
            logger
        );

        return worker.transform();
    }

}
