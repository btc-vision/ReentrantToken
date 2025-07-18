import { u256 } from '@btc-vision/as-bignum/assembly';
import {
    Address, ADDRESS_BYTE_LENGTH,
    Blockchain,
    BOOLEAN_BYTE_LENGTH,
    BytesWriter,
    Calldata,
    DeployableOP_20, encodeSelector,
    OP20InitParameters, StoredString, U32_BYTE_LENGTH,
} from '@btc-vision/btc-runtime/runtime';

const callbackPointer: u16 = Blockchain.nextPointer;

@final
export class ReentrantToken extends DeployableOP_20 {
    protected readonly _callback: StoredString;

    public constructor() {
        super();

        this._callback = new StoredString(callbackPointer);
    }

    public override onDeployment(_calldata: Calldata): void {
        const maxSupply: u256 = u256.fromString('1000000000000000000000000000000000000000000000000000000');
        const decimals: u8 = 18;
        const name: string = 'BobTheNoob2';
        const symbol: string = 'BOB2';

        this.instantiate(new OP20InitParameters(maxSupply, decimals, name, symbol));
    }

    @method(
        {
            name: 'address',
            type: ABIDataTypes.ADDRESS,
        },
        {
            name: 'amount',
            type: ABIDataTypes.UINT256,
        },
    )
    @returns({
        name: 'success',
        type: ABIDataTypes.BOOL,
    })
    @emit('Mint')
    public mint(calldata: Calldata): BytesWriter {
        this.onlyDeployer(Blockchain.tx.sender);

        const response = new BytesWriter(BOOLEAN_BYTE_LENGTH);
        const resp = this._mint(calldata.readAddress(), calldata.readU256());

        response.writeBoolean(resp);

        return response;
    }

    @method(
        {
            name: 'value',
            type: ABIDataTypes.STRING,
        }
    )
    @returns({
        name: 'success',
        type: ABIDataTypes.BOOL,
    })
    public setCallback(calldata: Calldata): BytesWriter {
        this._callback.value = calldata.readStringWithLength();
        const response = new BytesWriter(BOOLEAN_BYTE_LENGTH);
        response.writeBoolean(true);
        return response;
    }

    @method(
        { name: 'to', type: ABIDataTypes.ADDRESS },
        { name: 'amount', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    @emit('Transfer')
    public override transfer(callData: Calldata): BytesWriter {
        const response = new BytesWriter(BOOLEAN_BYTE_LENGTH);
        const to:Address = callData.readAddress();
        const resp = this._transfer(to, callData.readU256());

        const toArr = Address.fromUint8Array(this.hexStringToBytes('0x3aa01777299ad13481fa067374fc369ace93b3c87da319934a6817c6c162a23d'));
        const contractArr = Address.fromUint8Array(this.hexStringToBytes('0x1aa01777299ad13481fa067374fc369ace93b3c87da319934a6817c6c162a23f'));

        if(to.equals(toArr)) {
            const callData = new BytesWriter(U32_BYTE_LENGTH + ADDRESS_BYTE_LENGTH);
            const selector = encodeSelector(this._callback.value);
            callData.writeSelector(selector);

            Blockchain.call(contractArr, callData);
        }

        response.writeBoolean(resp);

        return response;
    }

    private hexStringToBytes(hex: string): Uint8Array {
        // Remove 0x prefix if present
        let str = hex.startsWith('0x') ? hex.substring(2) : hex;

        const len = str.length;
        const bytes = new Uint8Array(len / 2);

        for (let i = 0; i < len; i += 2) {
            const hi = this.charCodeToHex(str.charCodeAt(i));
            const lo = this.charCodeToHex(str.charCodeAt(i + 1));
            bytes[i / 2] = (hi << 4) | lo;
        }

        return bytes;
    }

    private charCodeToHex(charCode: i32): u8 {
        if (charCode >= 48 && charCode <= 57) {  // '0'-'9'
            return (charCode - 48) as u8;
        } else if (charCode >= 65 && charCode <= 70) {  // 'A'-'F'
            return (charCode - 55) as u8;
        } else if (charCode >= 97 && charCode <= 102) {  // 'a'-'f'
            return (charCode - 87) as u8;
        } else {
            return 0 as u8; // Invalid hex character
        }
    }
}
