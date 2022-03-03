import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import useConnectWeb3 from '../../backend/connectWeb3'
import { getPrice, handleTokenID } from '../../lib/valuation/valuationUtils'
import { Wallets } from '../../lib/wallets'
import { useAppSelector } from '../../state/hooks'

const MvInfoTable = () => {
  const { address } = useAppSelector((state) => state.account)
  const { web3Provider } = useConnectWeb3()
  const [orders, setOrders] = useState<any[]>()
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`/api/fetchOrders/${Wallets.BOT}`)
      const { orders } = await res.json()
      setOrders(orders?.slice(0, 3))
    }
    fetchOrders()
  }, [address, web3Provider])
  return (
    <div className='gray-box bg-opacity-10'>
      <table className='w-full text-left'>
        {/* TABLE HEAD */}
        <thead>
          <tr>
            <th>Date</th>
            {/* <th>Markeplace</th> */}
            <th>NFTID</th>
            <th>Value</th>
            <th>Buy/Sell</th>
            <th>Etherscan</th>
          </tr>
        </thead>
        <tbody>
          {/* ORDERS */}
          {orders &&
            orders?.map((order: any) => (
              <tr key={order.id}>
                <td>{new Date(order?.closing_date).toDateString()}</td>
                {/* <td>OpenSea</td> */}
                <td>{handleTokenID(order?.metadata?.asset.id)}</td>
                <td>{getPrice(order).toFixed(2)} ETH</td>
                <td>Buy</td>
                <td>
                  <a href={order.id} className='cursor-pointer' target='_blank'>
                    1230....212
                  </a>{' '}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default MvInfoTable
