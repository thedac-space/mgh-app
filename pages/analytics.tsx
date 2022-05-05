import { NextPage } from 'next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { formatName } from '../lib/utilities'
import { useAppSelector } from '../state/hooks'

const Analytics: NextPage = () => {
  const [userGraphs, setUserGraphs] = useState<any[]>(['floorprice', 'another'])

  const { address } = useAppSelector((state) => state.account)
  useEffect(() => {
    if (!address) return

    // Request Graphs for user From Firebase
    // set the user graphs

    return () => {}
  }, [address])

  const addGraph = (graphType: any /* Create Graph Type */) => {
    // Api Call to Firebase to add the graph for user
    // Update state to add this graph
    setUserGraphs((previous) => [...previous, ''])
  }

  const removeGraph = (graphType: any /* Create Graph Type */) => {
    // Api Call to Firebase to remove the graph for user
    // Update state to remove this graph
    setUserGraphs((previous) => [...previous, ''])
  }

  return (
    <section>
      {/* Main Header */}
      <div className='gray-box flex flex-col sm:flex-row justify-between items-center mb-8'>
        <h1 className='text-transparent bg-clip-text lg:text-5xl text-3xl bg-gradient-to-br green-text-gradient mb-0 sm:mb-2'>
          Analytics
        </h1>
        {/* Links Wrapper */}
        <div className='flex gap-5'>
          {/* Links */}
          {['portfolio', 'watchlist', 'valuation'].map((option) => (
            <Link key={option} href={`/${option}`}>
              <a className='hover:scale-105 font-medium text-white px-5 py-3 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-green-500/30 transition-all duration-300'>
                <span className='text-xl'>{formatName(option)}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>

      {/* Graphs loop */}
      {userGraphs?.map((graph) => (
        // Graph Component with graph info.. Logic for Fetching should be inside component.
        <h2>GRAPH COMPONENT</h2>
      ))}
      <BiPlus
        onClick={() => addGraph('')}
        className='m-auto cursor-pointer text-6xl hover:scale-120 transition-all text-gray-200 hover:text-white'
      />

      {/* Top Selling Lands */}
      <h3>TOP SELLING LANDS COMPONENT</h3>
    </section>
  )
}

export default Analytics
