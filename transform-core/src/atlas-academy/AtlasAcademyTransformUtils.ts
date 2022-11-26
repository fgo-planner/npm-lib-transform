import { CollectionUtils } from '@fgo-planner/common-core';
import { ItemQuantities } from '@fgo-planner/data-core';
import { NiceItemAmount } from './types/NiceItemAmount.type';

function transformItemAmountData(value: NiceItemAmount | Array<NiceItemAmount>): ItemQuantities {
    if (Array.isArray(value)) {
        return CollectionUtils.mapIterableToObject(value, _getItemId, _getAmount);
    }
    return {
        [value.item.id]: value.amount
    };
}

function _getItemId(niceItemAmount: NiceItemAmount): number {
    return niceItemAmount.item.id;
}

function _getAmount(niceItemAmount: NiceItemAmount): number {
    return niceItemAmount.amount;
}

function toMap<T extends { id: number }>(niceData: ReadonlyArray<T>): Record<number, T> {
    return CollectionUtils.mapIterableToObject(niceData, _getElementId);
}

function _getElementId<T extends { id: number }>(niceData: T): number {
    return niceData.id;
}

/**
 * Contains common functions used by the Atlas Academy data transformers. Used
 * internally, do not add to module exports.
 */
export const AtlasAcademyTransformUtils = {
    transformItemAmountData,
    toMap
};
