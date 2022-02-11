import React from 'react'
import { Fade } from 'react-awesome-reveal'
import { IPriceCard } from '../../lib/valuation/valuationTypes'
import { HorizontalPriceCard } from '../General'

const PortfolioList = ({
  formattedAssets,
}: {
  formattedAssets: IPriceCard[]
}) => {
  return (
    <ul className='grid gap-4 md:gap-12 sm:grid-cols-2'>
      <Fade duration={400} className='w-full flex justify-center'>
        {formattedAssets.map(
          ({ apiData, showCard, predictions, processing }) => (
            <li key={apiData?.tokenId} className='w-75vw sm:w-full gray-box'>
              <HorizontalPriceCard
                verticalUnder='lg'
                apiData={apiData}
                showCard={showCard}
                predictions={predictions}
                processing={processing}
              />
            </li>
          )
        )}
      </Fade>
    </ul>
  )
}

export default PortfolioList
