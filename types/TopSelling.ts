export interface TopSellingDataTable {
  asset: string,
  date: string,
  external_link: string,
  buyer: string,
  image: string,
  eth_price: string,
  symbol: string
  landId: number,
}

export interface TopSellingRequestItem {
  position: any,
  dataTable: TopSellingDataTable,
}

export interface TopSellings{
  totalTop: {}[],
  yesterdayTop: {}[],
  monthTop: {}[],
  yearTop: {}[]
}