import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

import { Provider } from "../lib/enums";
import { useAppDispatch } from "../state/hooks";
import { disconnect, setAddress, setChain } from "../state/account";
import { removeLocal } from "../lib/local";
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

    web3Provider.listAccounts().then(res => {
      dispatch(setAddress(res[0]))
    })

    web3Provider.getNetwork().then(res => {
      dispatch(setChain(res.chainId))
    })

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      }
      console.log("accountsChanged", accounts);
    }

    const handleChainChanged = (newChainId: string) => {
      window.location.reload();
      console.log("chainChanged", newChainId);
    }

    const handleConnect = (info: { chainId: number }) => {
      console.log(info)
    }

    const handleDisconnect = (error: { code: number; message: string }) => {
      console.log(error)
    }

    provider.on("accountsChanged", handleAccountsChanged)
    provider.on("chainChanged", handleChainChanged)
    provider.on("connect", handleConnect);
    provider.on("disconnect", handleDisconnect);

    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged)
        provider.removeListener('chainChanged', handleChainChanged)
        provider.removeListener('connect', handleConnect)
        provider.removeListener('disconnect', handleDisconnect)
      }
    }
  }, [provider])

  const disconnectWallet = async () => {
    if (provider === Provider.WALLETCONNECT) {
      await provider.disconnect()
    }
    removeLocal("provider")
    dispatch(disconnect())
  }

  return { walletProvider, provider, disconnectWallet }

}
