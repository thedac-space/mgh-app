export const chartRoutes = [
    {
        route: 'avgPriceParcel',
        label: 'Average Sale Price per Parcel',
        description:
            'This chart shows up the average price per parcel for each day',
    },
    {
        route: 'floorPrice',
        label: 'Floor Price',
        description: 'This chart shows the floor price for each day',
    },
    {
        route: 'avgPriceParcelPerArea',
        label: 'Average Sale Price per SQM',
        description: '',
    },
    { route: 'totalNumberOfSales', label: 'Total Sales', description: '' },
    { route: 'stdSalesPrices', label: 'Sales Prices', description: '' },
    { route: 'salesVolume', label: 'Daily Sales Volume', description: '' },
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
