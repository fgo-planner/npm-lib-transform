import { BatchMasterServantUpdate } from '@fgo-planner/data-core';
import { TransformLogger } from './logger/TransformLogger.class';

export type MasterAccountImportData = {

    metadata: {

        fgoPlannerSourceAccount?: {

            id: string;
    
            name?: string;
    
            friendId?: string;

        }
        
    }

    resources?: {

        items: Record<number, number>;

        qp: number;

    };

    servants?: Array<BatchMasterServantUpdate>;

    // lastServantInstanceId: number;

    costumes?: Array<number>;

    soundtracks?: Array<number>;

    logger: TransformLogger;

};
