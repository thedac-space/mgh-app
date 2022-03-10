import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { FaEthereum } from 'react-icons/fa'
import useConnectWeb3 from '../../backend/connectWeb3'
import { getPrice, handleTokenID } from '../../lib/valuation/valuationUtils'
import { Wallets } from '../../lib/wallets'
import { useAppSelector } from '../../state/hooks'
import { OptimizedImage } from '../General'

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
      <table className='w-full font-medium text-left text-[0.92rem] sm:text-base lg:text-lg'>
        {/* TABLE HEAD */}
        <thead>
          <tr>
            <th className='mb-2'>Date</th>
            <th className='mb-2 hidden md:table-cell'>NFT ID</th>
            <th className='mb-2'>Value</th>
            <th className='mb-2'>Type</th>
            <th className='mb-2'>Etherscan</th>
          </tr>
        </thead>
        <tbody>
          {/* ORDERS */}
          {orders &&
            orders?.map((order: any) => (
              <tr key={order.id}>
                <td className='mb-3'>
                  {new Date(order?.closing_date).toLocaleDateString('en-GB')}
                </td>
                <td className='hidden md:table-cell mb-3'>
                  {handleTokenID(order?.metadata?.asset.id)}
                </td>
                <td className='mb-3'>
                  <span className='flex gap-1'>
                    <FaEthereum className='relative top-0.5' />
                    {getPrice(order).toFixed(2)}{' '}
                  </span>
                </td>
                <td className='mb-3'>Buy</td>
                <td className='mb-3'>
                  <a
                    href={'https://etherscan.com/address/' + order.id}
                    className='cursor-pointer'
                    target='_blank'
                  >
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
