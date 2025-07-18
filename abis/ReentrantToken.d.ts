import { Address, AddressMap } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------
export type MintEvent = {
    readonly address: Address;
    readonly amount: bigint;
};
export type TransferEvent = {
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
export type Mint = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<MintEvent>[]
>;

/**
 * @description Represents the result of the setCallback function call.
 */
export type SetCallback = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the transfer function call.
 */
export type Transfer = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<TransferEvent>[]
>;

// ------------------------------------------------------------------
// IReentrantToken
// ------------------------------------------------------------------
export interface IReentrantToken extends IOP_NETContract {
    mint(address: Address, amount: bigint): Promise<Mint>;
    setCallback(value: string): Promise<SetCallback>;
    transfer(to: Address, amount: bigint): Promise<Transfer>;
}
