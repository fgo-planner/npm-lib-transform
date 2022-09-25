import { ImmutableMasterAccount } from '@fgo-planner/data-core';
import { MasterAccountExportUtils } from '../../common';

export function transformMasterAccountToJson<ID = string>(masterAccount: ImmutableMasterAccount<ID>): string {
    const masterAccountExportData = MasterAccountExportUtils.transformMasterAccount(masterAccount);
    return JSON.stringify(masterAccountExportData);
}
