import { NiceItemBGType } from './nice-item-bg-type.type';
import { NiceItemType } from './nice-item-type.type';
import { NiceItemUse } from './nice-item-use.type';

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

};
