import { AtlasAcademyNiceCostume } from './atlas-academy-nice-costume.type';
import { AtlasAcademyNiceLoreStats } from './atlas-academy-nice-lore-stats.type';

/**
 * Partial type definition for the `profile` path in the `NiceServant` data
 * schema.
 */
export type AtlasAcademyNiceServantProfile = {
    cv: string;
    illustrator: string;
    stats: AtlasAcademyNiceLoreStats;
    costume: Record<number, AtlasAcademyNiceCostume>;
};
