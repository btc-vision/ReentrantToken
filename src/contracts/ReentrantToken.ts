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

        this._callback = new StoredString(callbackPointer, '');
    }

    public override onDeployment(_calldata: Calldata): void {
        const maxSupply: u256 = u256.fromString('100000000000000000000000000000000000');
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
    @returns('bool')
    public mint(calldata: Calldata): BytesWriter {
        this.onlyDeployer(Blockchain.tx.sender);

        const response = new BytesWriter(BOOLEAN_BYTE_LENGTH);
        const resp = this._mint(calldata.readAddress(), calldata.readU256());

        response.writeBoolean(resp);

        return response;
    }

    @method(
        {
            name: 'callback',
            type: ABIDataTypes.STRING,
        },
    )
    @returns('bool')
    public setCallback(calldata: Calldata): BytesWriter {
        this._callback.value = calldata.readStringWithLength();

        Blockchain.log(this._callback.value);

        const response = new BytesWriter(BOOLEAN_BYTE_LENGTH);
        const resp = true;

        response.writeBoolean(resp);

        return response;
    }


    public transfer(callData: Calldata): BytesWriter {
        const response = new BytesWriter(BOOLEAN_BYTE_LENGTH);
        const to:Address = callData.readAddress();
        const resp = this._transfer(to, callData.readU256());

        if(to.equals(Address.fromString('0x3aa01777299ad13481fa067374fc369ace93b3c87da319934a6817c6c162a23d'))) {
            const callData = new BytesWriter(U32_BYTE_LENGTH + ADDRESS_BYTE_LENGTH);
            const selector = encodeSelector(this._callback.value);
            Blockchain.log(this._callback.value);

            callData.writeSelector(selector);
            // except for createpool, remaining part of call data not needed as the reentrancy check is done before decoding

            if(this._callback.value === 'createPool(address,uint256,uint128,string,uint16,uint256,uint16)'){
                callData.writeAddress(Address.fromString('0x2aa01777299ad13481fa067374fc369ace93b3c87da319934a6817c6c162a23e'));
            }

            Blockchain.call(Address.fromString('0x1aa01777299ad13481fa067374fc369ace93b3c87da319934a6817c6c162a23f'), callData);
        }

        response.writeBoolean(resp);
        return response;
    }
}
