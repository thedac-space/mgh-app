import { NextPage } from 'next'
import { BuyPrice, LandList, PriceEstimation } from '../components/Watchlist'
import lands from '../components/Watchlist/mockupdata.json'
import Link from 'next/link'

const WatchListPage: NextPage = () => {
  return (
    <section className='animate-fade-in-slow flex justify-around w-full text-white gap-4 relative'>
      <div>
        <div className='mt-20 flex items-center justify-center'>
          <button className='hoverlift z-10 p-4 rounded-xl bg-gradient-to-br from-pink-600 to-blue-500'>
            Add Land to Watchlist
          </button>
        </div>
        <LandList lands={lands} />
      </div>
      <PriceEstimation />
      <BuyPrice />
    </section>
  )
}

export default WatchListPage
