import { Key } from "react"

export interface TopSellingDataTable {
  asset: string,
  date: string,
  external_link: string,
  from: string,
  image: string,
  owner: string,
  price: string,
  symbol: string
}

export interface TopSellingData {
  dataLand: any,
  dataTable: TopSellingDataTable,
  requestDate: Date,
  tokenId: string,
  totalCounter: Number,
  yesterdayCounter: Number,
  prevMonthCounter: Number,
  prevYearCounter: Number
}

export interface TopSellingRequestItem {
  position: any,
  data: TopSellingData
}

export interface TopSellings{
  totalTop: {}[],
  yesterdayTop: {}[],
  monthTop: {}[],
  yearTop: {}[]
}