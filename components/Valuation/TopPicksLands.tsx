import React, { useEffect, useState } from 'react'
import { typedKeys } from '../../lib/utilities'
import { Metaverse } from '../../lib/metaverse'
import axios from 'axios'
import { RiLoader3Fill } from 'react-icons/ri'

interface Props {
  metaverse: Metaverse
}

const TopPicksLands = ({ metaverse }: Props) => {
  const [loading, setLoading] = useState(true)

  const [picks, setPicks] = useState({})

  useEffect(() => {
    const setData = async () => {
      setLoading(true)
      await axios
        .get('https://services.itrmachines.com/val-analytics/topPicks', {
          params: { metaverse: metaverse },
        })
        .then((response) => {
          setPicks(response.data)
          setLoading(false)
        })
    }
    setData().catch((e) => console.log(e))
  }, [metaverse])

  return (
    <>
      <div className='flex flex-col items-start gray-box'>
        <p className={`text-lg xl:text-xl font-medium text-gray-300 mb-4`}>
          Top picks:{' '}
        </p>
        {loading ? (
          <p className='text-gray-300 flex gap-2'>
            Loading Lands{' '}
            <RiLoader3Fill className='animate-spin-slow h-5 w-5 xs:h-6 xs:w-6' />
          </p>
        ) : (
          <table className='text-center w-full'>
            <thead className='bg-transparent flex text-white w-full'>
              <tr className='flex w-full mb-4'>
                <th className='p-4 w-1/4 bg-slate-800'></th>
                <th className='p-4 w-1/4 uppercase bg-slate-800 '>Coord</th>
                <th className='p-4 w-1/4 uppercase bg-slate-800 '>
                  Current price
                </th>
                <th className='p-4 w-1/4 uppercase bg-slate-800 '>
                  Predicted price
                </th>
                <th className='p-4 w-1/4 uppercase bg-slate-800 '>Gap</th>
              </tr>
            </thead>
            <tbody className='bg-transparent flex flex-col items-center justify-between overflow-y-scroll w-full h-52 scrollbar ml-5'>
              {typedKeys(picks).map((key) => {
                return (
                  <tr key={key} className='flex w-full mb-4'>
                    <td className='flex justify-center content-center p-4 w-1/4'>
                      <img
                        src={picks[key]['images']['image_url']}
                        className='h-12 w-12 bg-white rounded-full border mb-4 mt-4'
                      />
                    </td>
                    <td className='flex justify-center content-center items-center text-xl 2xl:text-2xl font-medium text-sky-400 pt-0.5 w-1/4 hover:underline'>
                      <a href={picks[key]['external_link']}>
                        X:{picks[key]['coords']['x']}, Y:
                        {picks[key]['coords']['y']}
                      </a>
                    </td>
                    <td className='flex justify-center content-center items-center text-xl 2xl:text-2xl font-medium text-gray-300 pt-0.5 w-1/4'>
                      <span>
                        {parseFloat(picks[key]['current_price_eth']).toFixed(2)}
                      </span>
                    </td>
                    <td className='flex justify-center content-center items-center text-xl 2xl:text-2xl font-medium text-gray-300 pt-0.5 w-1/4'>
                      <span>
                        {parseFloat(picks[key]['eth_predicted_price']).toFixed(
                          2
                        )}
                      </span>
                    </td>
                    <td className='flex justify-center content-center items-center text-xl 2xl:text-2xl font-medium text-gray-300 pt-0.5 w-1/4'>
                      <span>{parseFloat(picks[key]['gap']).toFixed(2)}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default TopPicksLands
