import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import useConnectWeb3 from '../backend/connectWeb3'
import { WalletModal } from '../components'
import PurchaseModal from '../components/General/PurchaseModal'
import { PurchaseActionButton } from '../components/Purchase/index'

const Liquidity: NextPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [openModalWallet, setOpenModalWallet] = useState<boolean>(false)
    const { web3Provider } = useConnectWeb3()
    useEffect(() => console.log(web3Provider))
    return (
        <>
            <Head>
                <title>MGH - Test</title>
                <meta
                    name="description"
                    content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data."
                />
            </Head>

            <div className="w-full -mb-4 xs:-mb-6 sm:-mb-10 xl:-mb-0 h-full flex flex-col items-center justify-center animate__animated animate__fadeIn animate__slow">
                {/* Connect Wallet */}{' '}
                {!web3Provider && (
                    <>
                        <h3 className="text-slate-50">
                            Conecta tu billetera para continuar
                        </h3>
                        <button
                            onClick={() => setOpenModalWallet(true)}
                            className="mt-10 z-30 disabled:opacity-50 disabled:hover:shadow-dark disabled:cursor-default relative flex justify-center items-center  transition ease-in-out duration-500 shadow-dark rounded-xl w-full max-w-sm py-3 sm:py-4 group"
                        >
                            <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80" />
                            <span className="pt-1 z-10 text-gray-200 font-medium text-lg sm:text-xl">
                                Connect Wallet
                            </span>
                        </button>
                    </>
                )}
                {openModalWallet && (
                    <WalletModal onDismiss={() => setOpenModalWallet(false)} />
                )}
                {openModal && (
                    <PurchaseModal onDismiss={() => setOpenModal(false)} />
                )}
                {web3Provider && (
                    <>
                        <h3 className="text-slate-50">
                            Activa aqui el Purchasin Modal
                        </h3>
                        <PurchaseActionButton
                            onClick={() => {
                                setOpenModal(true)
                            }}
                            disabled={false}
                            text={'click me'}
                        />
                    </>
                )}
            </div>
        </>
    )
}

export default Liquidity
