import { ItemQuantities, GameSoundtrack } from '@fgo-planner/data-core';
import { TransformLogger } from '../../common/logger';
import { AtlasAcademyTransformUtils } from '../AtlasAcademyTransformUtils';
import * as AtlasAcademy from '../Types';

/**
 * Helper class for internal use only, do not add to module exports.
 */
export class NiceBgmEntitiesToGameSoundtrackTransformWorker {

    constructor(
        private readonly _niceBgmEntitiesJp: ReadonlyArray<AtlasAcademy.NiceBgmEntity>,
        private readonly _logger?: TransformLogger
    ) {}

    /**
     * Uncaught exceptions may be thrown.
     */
    transform(): Array<GameSoundtrack> {
        const result: Array<GameSoundtrack> = [];
        for (const niceSoundtrackJp of this._niceBgmEntitiesJp) {
            const gameSoundtrack = this._transformSoundtrackData(niceSoundtrackJp);
            if (gameSoundtrack) {
                result.push(gameSoundtrack);
            }
        }
        return result;
    }

    private _transformSoundtrackData(niceBgm: AtlasAcademy.NiceBgmEntity): GameSoundtrack | null {
        if (niceBgm.notReleased) {
            return null;
        }

        this._logger?.info(niceBgm.id, 'Processing soundtrack');

        let material: ItemQuantities | undefined;
        if (niceBgm.shop) {
            material = AtlasAcademyTransformUtils.transformItemAmountData(niceBgm.shop.cost);
        }
        const result: GameSoundtrack = {
            _id: niceBgm.id,
            name: niceBgm.name,
            priority: niceBgm.priority,
            material,
            audioUrl: niceBgm.audioAsset,
            thumbnailUrl: niceBgm.logo
        };

        this._logger?.info(niceBgm.id, 'Soundtrack processed');
        return result;
    }

}
