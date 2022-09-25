import { NiceCostume } from './nice-costume.type';
import { NiceLoreStats } from './nice-lore-stats.type';

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
