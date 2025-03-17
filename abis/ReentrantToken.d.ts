import { Address, AddressMap } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the mint function call.
 */
export type Mint = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the setCallback function call.
 */
export type SetCallback = CallResult<
    {
        returnVal1: boolean;
    },
    OPNetEvent<never>[]
>;

// ------------------------------------------------------------------
// IReentrantToken
// ------------------------------------------------------------------
export interface IReentrantToken extends IOP_NETContract {
    mint(address: Address, amount: bigint): Promise<Mint>;
    setCallback(callback: string): Promise<SetCallback>;
}
