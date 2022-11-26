import { NiceSvtFlag } from './NiceSvtFlag.type';
import { NiceSvtType } from './NiceSvtType.type';
import { SvtClass } from './SvtClass.type';

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
