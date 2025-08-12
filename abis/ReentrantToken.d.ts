import { Address, AddressMap } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------
export type MintedEvent = {
    readonly to: Address;
    readonly amount: bigint;
};
export type TransferredEvent = {
    readonly operator: Address;
    readonly from: Address;
    readonly to: Address;
    readonly amount: bigint;
};

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the mint function call.
 */
export type Mint = CallResult<{}, OPNetEvent<MintedEvent>[]>;

/**
 * @description Represents the result of the setCallback function call.
 */
export type SetCallback = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the safeTransfer function call.
 */
export type SafeTransfer = CallResult<{}, OPNetEvent<TransferredEvent>[]>;

// ------------------------------------------------------------------
// IReentrantToken
// ------------------------------------------------------------------
export interface IReentrantToken extends IOP_NETContract {
    mint(address: Address, amount: bigint): Promise<Mint>;
    setCallback(value: string): Promise<SetCallback>;
    safeTransfer(to: Address, amount: bigint, data: Uint8Array): Promise<SafeTransfer>;
}
