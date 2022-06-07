import { Metaverse } from '../../lib/metaverse';
const filterHistoryByDate = (history: any, date: Date) => {
  //date settings
  let yesterday = new Date(date).setDate(date.getDate() - 1)
  let prevMonth = new Date(date).setMonth(date.getMonth() - 1)
  let prevYear = new Date(date).setFullYear(date.getFullYear() - 1)

  //counters
  let yesterdayCounter = 0
  let prevMonthCounter = 0
  let prevYearCounter = 0

  //filter function
  for (const keyHistory in history) {
    if (parseInt(`${new Date(history[keyHistory].timestamp)}`) > yesterday)
      yesterdayCounter = yesterdayCounter + 1
    if (parseInt(`${new Date(history[keyHistory].timestamp)}`) > prevMonth) 
      prevMonthCounter = prevMonthCounter + 1
    if (parseInt(`${new Date(history[keyHistory].timestamp)}`) > prevYear)
      prevYearCounter = prevYearCounter + 1
  }
  return [ yesterdayCounter, prevMonthCounter, prevYearCounter ]
}

const sort = (Top: {}[], Aux: any, historyLenght: Number, data: any) => {
  for (let i = 0; i < Aux.length; i++) {
    if (Aux[i] < historyLenght){
      Aux[i] = historyLenght
      Top[i] = {position: i+1, data}
      break
    }
  }
}

async function downloadMap(metaverse: Metaverse) {
	let response:any = {}, from = 0
  let totalTop = [{}, {}, {}, {}, {}], totalAux = [-1, -1, -1, -1, -1]
  let yesterdayTop = [{}, {}, {}, {}, {}], yesterdayAux = [-1, -1, -1, -1, -1]
  let monthTop = [{}, {}, {}, {}, {}], monthAux = [-1, -1, -1, -1, -1]
  let yearTop = [{}, {}, {}, {}, {}], yearAux = [-1, -1, -1, -1, -1]
	do {
		let url = "https://services.itrmachines.com/" + metaverse + "/requestMap?from=" + from + "&size=2000";
		from += 2000;
		console.log("> requesting " + metaverse + ":", from);
		response = await fetch(url);
		response = await response.json();
		for (let key of Object.keys(response)){
      const date = new Date()
      const [yesterdayCounter, prevMonthCounter, prevYearCounter] = filterHistoryByDate(response[key].history, date)
      let totalCounter = 0
      if (response[key].history)
        totalCounter = response[key].history.length
      const data = {
        tokenId: key,
        requestDate: date,
        dataLand: response[key],
        dataTable: {
          owner: response[key].owner ? response[key].owner : 'anonymous',
          asset: response[key].coords ? `(x:${response[key].coords.x}, y:${response[key].coords.y})` : `no-asset`,
          from: response[key].last_transaction ? response[key].last_transaction.seller.address : 'anonymous',
          price: response[key].history ? response[key].history[0] ? response[key].history[totalCounter - 1].price.toFixed(2) : 0 : 0,
          date: response[key].history ? response[key].history[0] ? response[key].history[totalCounter - 1].time : '00-00-0000' : '00-00-0000',
          symbol: response[key].last_transaction ? response[key].last_transaction.symbol : '(symbol)',
          external_link: response[key].external_link ? response[key].external_link : 'https://opensea.io/',
          image: response[key].images ? response[key].images.image_url : false
        },
        yesterdayCounter,
        prevMonthCounter,
        prevYearCounter,
        totalCounter,
      }
			sort(totalTop, totalAux, totalCounter, data)
      sort(yesterdayTop, yesterdayAux, yesterdayCounter, data)
      sort(monthTop, monthAux, prevMonthCounter, data)
      sort(yearTop, yearAux, prevYearCounter, data)
    }
	} while (Object.keys(response).length > 0);
	return {totalTop, yesterdayTop, monthTop, yearTop};
}

export default async function TopSellingLands (metaverse: Metaverse) {
  return await downloadMap(metaverse)
}