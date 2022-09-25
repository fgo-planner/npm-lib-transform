import { NiceSvtFlag } from './nice-svt-flag.type';
import { NiceSvtType } from './nice-svt-type.type';
import { SvtClass } from './svt-class.type';

/**
 * Partial type definition for Atlas Academy's `BasicServant` data schema.
 */
export type BasicServant = {
    id: number;
    collectionNo: number;
    name: string;
    type: NiceSvtType;
    flag: NiceSvtFlag;
    className: SvtClass;
    rarity: number;
};
