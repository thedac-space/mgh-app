import { ethers } from "ethers";
import { useAppDispatch } from "../state/hooks";
import { disconnect, setAddress } from "../state/account";
import { removeLocal } from "../lib/local";
import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import useProvider from "./provider";


export default function useConnectWallet() {
  const [walletProvider, setProvider] = useState<Web3Provider>()
  const dispatch = useAppDispatch()
  const provider = useProvider()

  useEffect(() => {
    if (!provider) {
      return
    }

    const web3Provider = new ethers.providers.Web3Provider(provider, "any");

    setProvider(web3Provider)

    web3Provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        window.location.reload();
      }
    })
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: string[]) => {
      // dispatch(setAddress(accounts[0]))
      if (accounts.length === 0) {
        removeLocal("provider")
        dispatch(disconnect())
      }
      console.log("accountsChanged", accounts);
    });

    // Subscribe to provider connection
    provider.on("connect", (info: { chainId: number }) => {
      console.log(info);
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error: { code: number; message: string }) => {
      console.log(error);
    });
  }, [provider])

  const getAddress = async () => {
    const address = await walletProvider?.listAccounts()
    return address ? address[0] : null
  }

  const getChainId = async () => {
    const network = await walletProvider?.getNetwork()
    return network ? network.chainId : null
  }

  return { walletProvider, provider, getAddress, getChainId }

}
