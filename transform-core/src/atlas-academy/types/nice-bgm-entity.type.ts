import { NiceShop } from './nice-shop.type';

/**
 * Partial type definition for Atlas Academy's `NiceBgmEntity` data schema.
 */
export type NiceBgmEntity = {

    id: number;

    name: string;

    fileName: string;

    audioAsset?: string;

    priority: number;

    detail: string;

    notReleased: boolean;

    shop?: NiceShop;

    logo: any;

};
