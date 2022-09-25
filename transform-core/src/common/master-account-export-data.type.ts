import { MasterServantExportData } from './master-servant-export-data.type';

export type MasterAccountExportData = {
    
    source: {

        id: string;

        name?: string;

        friendId?: string;
        
    }

    resources?: {

        items: Record<number, number>;

        qp: number;

    };

    servants?: Array<MasterServantExportData>;

    // lastServantInstanceId: number;

    costumes?: Array<number>;

    soundtracks?: Array<number>;

};
