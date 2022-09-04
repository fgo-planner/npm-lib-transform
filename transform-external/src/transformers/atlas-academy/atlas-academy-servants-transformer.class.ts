import { GameServant } from '@fgo-planner/data-types';
import { BaseLogger } from '../../logger';
import { AtlasAcademyServantsTransformerWorker } from './atlas-academy-servants-transformer-worker.class';
import { AtlasAcademyNiceServant } from './types/atlas-academy-nice-servant.type';

/**
 * Transforms an array of `NiceServant` from Atlas Academy to an array of
 * `GameServant`.
 *
 * Note that as of 9/3/2022, the JP servant data with English names does not
 * include English costume names, so additional English data set from NA is
 * needed.
 */
export class AtlasAcademyServantsTransformer {

    static transform(
        niceServantsJp: ReadonlyArray<AtlasAcademyNiceServant>,
        niceServantsEn: ReadonlyArray<AtlasAcademyNiceServant>,
        logger?: BaseLogger<number>
    ): Array<GameServant> {

        const worker = new AtlasAcademyServantsTransformerWorker(
            niceServantsJp,
            niceServantsEn,
            logger
        );

        return worker.transform();
    }

}
