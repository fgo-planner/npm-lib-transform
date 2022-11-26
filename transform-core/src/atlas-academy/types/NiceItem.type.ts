import { NiceItemBGType } from './NiceItemBgType.type';
import { NiceItemType } from './NiceItemType.type';
import { NiceItemUse } from './NiceItemUse.type';

/**
 * Partial type definition for Atlas Academy's `NiceItem` data schema.
 */
export type NiceItem = {

    id: number;

    name: string;

    type: NiceItemType;

    uses: NiceItemUse[];

    detail: string;

    background: NiceItemBGType;

    priority: number;

};
