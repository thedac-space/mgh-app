export const chartRoutes = [
  { route: 'avgPriceParcel', label: 'Average Price per Parcel' },
  { route: 'floorPrice', label: 'Floor Price' },
  { route: 'avgPriceParcelPerArea', label: 'Average Price per Area' },
  { route: 'maxPrice', label: 'Max Price' },
  { route: 'totalNumberOfSales', label: 'Total Sales' },
  { route: 'stdSalesPrices', label: 'Sales Prices' },
  { route: 'salesVolume', label: 'Sales Volume' },
]

export const chartSymbolOptions = {
  ETH: { key: 'ethPrediction' },
  USDC: { key: 'usdPrediction' },
  METAVERSE: {
    key: 'metaversePrediction',
    sandbox: 'SAND',
    decentraland: 'MANA',
    'axie-infinity': 'AXS',
  },
} as const
