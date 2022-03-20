import dynamic from 'next/dynamic'

export { default as MainMvStakingInterface } from './MainMvStakingInterface'
export { default as MvInfoTable } from './MvInfoTable'
export { default as MvTVL } from './MvTVL'
export { default as AllocationChart } from './AllocationChart'
export const TVLHistoryChart = dynamic(() => import('./TVLHistoryChart'), {
  ssr: false,
})
