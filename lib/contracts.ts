import { Interface } from "ethers/lib/utils"

import stakingAbi from "../backend/abi/stakingAbi.json"
import tokenAbi from "../backend/abi/tokenAbi.json"

export const Contracts = {
    MGH_TOKEN: {
        MATIC_TESTNET: {
            address: "0xA26fcc9847F24C7D78f4e77Ba39A37B8A9eaFB02",
            abi: new Interface(tokenAbi)
        }
    },
    MGH_STAKING: {
        MATIC_TESTNET: {
            address: "0x7d267713502F979ffE3c49622fd0DC24d6D607D0",
            abi: new Interface(stakingAbi)
        }
    }

}