import { AiFillStar } from 'react-icons/ai'

// Mockup data for frontend sketching
import { Land } from './LandList'

const LandItem = ({ land }: { land: Land }) => {
  const removeLand = () => {
    console.log('removed land')
  }

  return (
    <li className='flex text-white mb-5 gap-4'>
      {/* Star */}
      <AiFillStar
        onClick={removeLand}
        className='text-yellow-500 hover:animate-spin-slower cursor-pointer transition-all text-5xl'
      />
      <div>
        {/* Name and Coordenates */}
        <h4 className='border-none'>
          <span className='text-3xl'>{land.name}</span> ({land.lat}, {land.lng})
        </h4>

        {/* Links */}
        <a className='block' href={land.openseaLink} target='_blank'>
          Opensea Link
        </a>
        <a className='block' href={land.sandboxLink} target='_blank'>
          Sandbox Link
        </a>
      </div>
    </li>
  )
}

export default LandItem
