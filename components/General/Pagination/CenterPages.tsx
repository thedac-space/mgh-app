import { prepareCopy } from "immer/dist/internal"
import { useEffect, useState } from "react"
import IndexItem from "./IndexItem"

interface ICenterPages {
  controlPageIndex: number
  pageLenght: number
  setControlPageIndex: Function
}

const CenterPages = ({ controlPageIndex, setControlPageIndex, pageLenght }: ICenterPages) => {
  const [centerArray, setCenterArray] = useState<any[]>([])

  const giveCenterItems = () => {
    const auxArray: any[] = []
    let preCounter = 0, postCounter = 0
    for (let index = controlPageIndex - 2; index <= controlPageIndex + 2; index++) {
      (index >= 1)
        ? (index <= pageLenght)
          ? auxArray.push(<IndexItem index={index} isSelected={index === controlPageIndex} setControlPageIndex={setControlPageIndex} />)
          : postCounter = postCounter + 1
        : preCounter = preCounter + 1
    }

    for (let index = 1; index <= preCounter; index++) {
      if ((4 - preCounter) + index <= pageLenght)
        auxArray.push(<IndexItem index={(5 - preCounter) + index} isSelected={false} setControlPageIndex={setControlPageIndex} />)
    }
    for (let index = 1; index <= postCounter; index++) {
      if (pageLenght - (4 - postCounter) - index >= 1)
        auxArray.unshift(<IndexItem index={pageLenght - (4 - postCounter) - index} isSelected={false} setControlPageIndex={setControlPageIndex} />)
    }
    setCenterArray(auxArray)
  }

  useEffect(() => {
    giveCenterItems()
  }, [controlPageIndex])

  return (
    <> {centerArray.map((item) => item)} </>
  )
}

export default CenterPages