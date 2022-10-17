import { ArrayUtils } from '@fgo-planner/common-core';
import { GameItemQuantities } from '@fgo-planner/data-core';
import { NiceItemAmount } from './types/nice-item-amount.type';

function transformItemAmountData(value: NiceItemAmount | Array<NiceItemAmount>): GameItemQuantities {
    if (Array.isArray(value)) {
        return ArrayUtils.mapArrayToObject(value, _getItemId, _getAmount);
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
    return ArrayUtils.mapArrayToObject(niceData, _getElementId);
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
