import { NiceStatusRank } from './NiceStatusRank.type';

/**
 * Atlas Academy `NiceLoreStats` enum values used by the `flag` property in the
 * `NiceServant` data schema.
 */
export type NiceLoreStats = {
    strength: NiceStatusRank;
    endurance: NiceStatusRank;
    agility: NiceStatusRank;
    luck: NiceStatusRank;
    np: NiceStatusRank;
};
