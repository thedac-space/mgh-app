import BaseTable, { Column } from "react-base-table"
import 'react-base-table/styles.css'

const data: any = [
  {
    col0: '1',
  }
]

const TestPage = () => {
  return (
    <>
      <h1 className="text-white">test page</h1>
      <BaseTable data={data} className='w-full' width={500}>
        <Column key="col0" dataKey="col0" width={100}/>
        <Column key="col1" dataKey="col1" width={100} />
      </BaseTable>
    </>
  )
}

export default TestPage