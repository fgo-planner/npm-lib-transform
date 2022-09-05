import { GameSoundtrack } from '@fgo-planner/data-types';
import { BaseLogger } from '../logger';
import { AtlasAcademyTransformUtils } from './atlas-academy-transform.utils';
import { AtlasAcademyNiceBgmEntity } from './types/atlas-academy-nice-bgm-entity.type';

/**
 * Used internally by `AtlasAcademySoundtracksTransformer`, do not add to module
 * exports.
 */
export class AtlasAcademySoundtracksTransformerWorker {

    constructor(
        private readonly _niceSoundtracksJp: ReadonlyArray<AtlasAcademyNiceBgmEntity>,
        private readonly _logger?: BaseLogger<number>
    ) {}

    /**
     * Uncaught exceptions may be thrown.
     */
    transform(): Array<GameSoundtrack> {
        const result: Array<GameSoundtrack> = [];
        for (const niceSoundtrackJp of this._niceSoundtracksJp) {
            const gameSoundtrack = this._transformSoundtrackData(niceSoundtrackJp);
            if (gameSoundtrack) {
                result.push(gameSoundtrack);
            }
        }
        return result;
    }

    private _transformSoundtrackData(NiceBgm: AtlasAcademyNiceBgmEntity): GameSoundtrack | null {
        if (NiceBgm.notReleased) {
            return null;
        }

        this._logger?.info(NiceBgm.id, 'Processing soundtrack');

        let material = undefined;
        if (NiceBgm.shop) {
            material = AtlasAcademyTransformUtils.transformItemAmountData(NiceBgm.shop.cost);
        }
        const result: GameSoundtrack = {
            _id: NiceBgm.id,
            name: NiceBgm.name,
            priority: NiceBgm.priority,
            material,
            audioUrl: NiceBgm.audioAsset,
            thumbnailUrl: NiceBgm.logo
        };

        this._logger?.info(NiceBgm.id, 'Soundtrack processed');
        return result;
    }

}
