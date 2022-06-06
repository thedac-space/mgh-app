import React from 'react'

const PurchaseKeyFeatures = () => {
  const features = [
    'Portfolio Valuation',
    'Valuation of Estates',
    'Metaverse Heatmap',
    'Metaverse Analytics',
    'And more...',
  ]
  return (
    <div className='flex '>
      {/* Features */}
      <ul className='w-2/4 flex flex-col gap-2'>
        {features.map((feature) => (
          <li className='text-2xl' key={feature}>
            {feature}
          </li>
        ))}
      </ul>
      {/* Looping Video */}
      <video className='w-2/4' autoPlay loop muted controls>
        <source src='/videos/heatmap-video.mp4' type='video/mp4' />
      </video>
    </div>
  )
}

export default PurchaseKeyFeatures
