import { MasterServantExportData } from './MasterServantExportData.type';

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

    servants?: {

        servants: Array<MasterServantExportData>;

    };

    costumes?: {

        unlocked: Array<number>;

        noCostUnlock: Array<number>;

    };

    soundtracks?: {

        unlocked: Array<number>;

    };

};
