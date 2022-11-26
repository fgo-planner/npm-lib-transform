import { NiceCostume } from './NiceCostume.type';
import { NiceLoreStats } from './NiceLoreStats.type';

/**
 * Partial type definition for the `profile` path in the `NiceServant` data
 * schema.
 */
export type NiceServantProfile = {
    cv: string;
    illustrator: string;
    stats: NiceLoreStats;
    costume: Record<number, NiceCostume>;
};
