import React, { useEffect } from 'react'

const LandSquare = () => {
  return (
    <div className='relative'>
      <div
        className={
          // (i % 213 !== 0
          // ? 'bg-green-600 hover:bg-purple-500'
          'bg-green-600 hover:bg-purple-500' +
          // : 'bg-black') +
          ' text-white h-3 w-3 border border-white peer'
        }
      ></div>
      {/* <div className='peer-hover:block hidden absolute z-10 bg-opacity-90 gray-box min-w-min text-center text-white '>
                <span className='whitespace-nowrap'>Land (1, 02)</span>
                <span className='flex gap-1'>
                  {' '}
                  Price: <FaEthereum />
                  10
                </span>
              </div> */}
    </div>
  )
}

export default LandSquare
