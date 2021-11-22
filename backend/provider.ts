import WalletConnectProvider from "@walletconnect/web3-provider"
import { useEffect, useState } from "react"
import { getLocal, removeLocal } from "../lib/local"
import { Provider } from "../state/types"

const useProvider = () => {
    const [provider, setProvider] = useState<any>()
    const providerId = getLocal("provider")
    console.log("useProvider")
    console.log(providerId, provider)

    useEffect(() => {
        console.log("useEffect", providerId)
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
            console.log("undefined", providerId)
            setProvider(undefined)
        }
        console.log(provider)
    }, [providerId])

    return provider
}

export default useProvider