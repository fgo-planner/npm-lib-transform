import { GameItemQuantity } from '@fgo-planner/data-core';
import { NiceItemAmount } from './types/nice-item-amount.type';

/**
 * Contains common functions used by the Atlas Academy data transformers. Used
 * internally, do not add to module exports.
 */
export class AtlasAcademyTransformUtils {

    private constructor() {
        
    }

    static transformItemAmountData({ item, amount }: NiceItemAmount): GameItemQuantity {
        return {
            itemId: item.id,
            quantity: amount
        };
    }
    
    static toMap<T extends { id: number }>(niceData: ReadonlyArray<T>): Record<number, T> {
        // TODO Use ArrayUtils for this
        const result: Record<number, T> = {};
        for (const data of niceData) {
            result[data.id] = data;
        }
        return result;
    }

}