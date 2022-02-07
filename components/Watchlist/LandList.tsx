import LandItem from './LandItem'

// Mockup
export interface Land {
  name: string
  lng: number
  lat: number
  openseaLink?: string
  sandboxLink?: string
}

const LandList = ({ lands }: { lands: Land[] }) => {
  return (
    <ul className='mt-32'>
      {lands.map((land) => (
        <LandItem land={land} />
      ))}
    </ul>
  )
}

export default LandList
