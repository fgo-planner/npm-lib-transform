import { GameSoundtrack } from '@fgo-planner/data-types';
import { BaseLogger } from '../../logger';
import { AtlasAcademySoundtracksTransformerWorker } from './atlas-academy-soundtracks-transformer-worker.class';
import { AtlasAcademyNiceBgmEntity } from './types/atlas-academy-nice-bgm-entity.type';

/**
 * Transforms an array of `NiceBgmEntity` from Atlas Academy to an array of
 * `GameSoundtrack`.
 *
 * Unlike with servants and items, the JP BGM data should already include the
 * necessary English strings, so additional English data set is not needed.
 */
export class AtlasAcademySoundtracksTransformer {

    private constructor() {
        
    }

    static transform(
        niceSoundtracksJp: ReadonlyArray<AtlasAcademyNiceBgmEntity>,
        logger?: BaseLogger<number>
    ): Array<GameSoundtrack> {

        const worker = new AtlasAcademySoundtracksTransformerWorker(
            niceSoundtracksJp,
            logger
        );

        return worker.transform();
    }

}
