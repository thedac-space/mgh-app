const PriceEstimation = () => {
  return (
    <>
      <div>
        <h2>Price Estimation</h2>
        <hgroup className='flex justify-between'>
          <h3>ETH</h3>
          <h3>SAND</h3>
          <h3>USDC</h3>
        </hgroup>
        <div className='flex items-center justify-center bg-grey-dark shadow-dark rounded-xl border-t border-l border-opacity-20 bg-opacity-30'>
          <h5>Respective Values</h5>
        </div>
      </div>
    </>
  )
}

export default PriceEstimation
