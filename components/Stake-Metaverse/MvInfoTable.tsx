import React from 'react'

const MvInfoTable = () => {
  return (
    <div className='gray-box'>
      <table className='w-full text-left'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Markeplace</th>
            <th>NFTID</th>
            <th>Value</th>
            <th>Buy/Sell</th>
            <th>Etherscan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>15.97</td>
            <td>OpenSea</td>
            <td>1847261</td>
            <td>15 ETH</td>
            <td>Buy</td>
            <td>www.etherscan.io/tx</td>
          </tr>
          <tr>
            <td>15.97</td>
            <td>OpenSea</td>
            <td>1847261</td>
            <td>15 ETH</td>
            <td>Buy</td>
            <td>www.etherscan.io/tx</td>
          </tr>
          <tr>
            <td>15.97</td>
            <td>OpenSea</td>
            <td>1847261</td>
            <td>15 ETH</td>
            <td>Buy</td>
            <td>www.etherscan.io/tx</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default MvInfoTable
