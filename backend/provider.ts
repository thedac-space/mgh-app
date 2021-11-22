import { useEffect, useState } from "react"
import WalletConnectProvider from "@walletconnect/web3-provider"

import { getLocal, removeLocal } from "../lib/local"
import { Provider } from "../lib/enums"


const useProvider = () => {
    const [provider, setProvider] = useState<any>()
    const providerId = getLocal("provider")

    useEffect(() => {

        if (providerId === Provider.METAMASK) {
            window.ethereum.enable()
                .then(() => {
                    setProvider(window.ethereum)
                })
                .catch(() => {
                    removeLocal("provider")
                })

        } else if (providerId === Provider.WALLETCONNECT) {
            const walletConnect = new WalletConnectProvider({
                infuraId: "03bfd7b76f3749c8bb9f2c91bdba37f3"
            })
            walletConnect.enable()
                .then(() => {
                    setProvider(walletConnect)
                })
                .catch(() => {
                    removeLocal("provider")
                })
        } else {
            setProvider(undefined)
        }

    }, [providerId])

    return provider
}

export default useProvider