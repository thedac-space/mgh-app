import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useAppDispatch } from "../state/hooks";
import { connect } from "../state/account";
import { useCallback, useEffect, useState } from "react";
import { connectWallet } from "./provider";
import { Web3Provider } from "@ethersproject/providers";

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: "03bfd7b76f3749c8bb9f2c91bdba37f3",
        }
    }
};

let web3Modal: Web3Modal;
if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: false,
        providerOptions, // required
    })
}

const useWeb3 = () => {
    const [Web3Provider, setProvider] = useState<Web3Provider>()

    const disconnect =  () =>{
            web3Modal.clearCachedProvider()
        }

    const connectWallet = useCallback(async () => {

        const provider = await web3Modal.connect();

        const Web3Provider = new ethers.providers.Web3Provider(provider)
        console.log("provider: ", Web3Provider)

        const network = await Web3Provider.getNetwork()
        console.log("network: ", network)
        console.log(provider.on)

        setProvider(Web3Provider)

        // Subscribe to accounts change
        provider.on("accountsChanged", (accounts: string[]) => {
            console.log(accounts);
        });

        // Subscribe to chainId change
        provider.on("chainChanged", (chainId: number) => {
            console.log(chainId, "chain changed");
        });

        // Subscribe to provider connection
        provider.on("connect", (info: { chainId: number }) => {
            console.log(info);
        });

        // Subscribe to provider disconnection
        provider.on("disconnect", async (error: { code: number; message: string }) => {
            await disconnect()
            console.log(error);
        });
        return Web3Provider
    }, [])


    useEffect(() => {

        connectWallet()

    }, [])

    return Web3Provider
}

export default useWeb3