type AscensionKey = 0 | 1 | 2 | 3;

/**
 * Partial type definition for servant name changes.
 */
type OverWriteServantName = {
    ascension: Record<AscensionKey, string>;
    costume: Record<number, string>;
};

/**
 * Partial type definition for Atlas Academy's `AscensionAdd` data schema.
 */
export type AscensionAdd = {
    overWriteServantName: OverWriteServantName;
    overWriteServantBattleName: OverWriteServantName;
};
