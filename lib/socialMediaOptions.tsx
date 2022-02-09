import { FaTelegram, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import { FiCopy } from 'react-icons/fi'
import { IAPIData, IPredictions } from './types'
/**
 *
 * @returns List of Social Media Options
 */
export const SocialMediaOptions = (
  apiData?: IAPIData,
  predictions?: IPredictions
) => {
  const mghLink = `https://app.metagamehub.io/valuation`
  // Text for Portfolio
  const portfolioText =
    'Here%20is%20my%20Metaverse%20collection!%20%23MyNFTs%20%23MGHDAO%0A%0A&url=https://app.metagamehub.io/portfolio?wallet='

  // Text for Card Valuation
  const valuationText = `Check%20out%20this%20LAND%20valuation%20in%20the%20Metaverse!%20%23MyNFTs%20%23MGHDAO%0A%0A**************%0A${predictions?.ethPrediction.toFixed(
    2
  )}%20ETH%0A${predictions?.usdPrediction.toFixed(
    2
  )}%20USDC%0A**************%0A%0A${apiData?.opensea_link}&url=${mghLink}`

  // Whatsapp Text for Portfolio
  const whatsappPortfolioText =
    'Here%20is%20my%20Metaverse%20collection!%20%23MyNFTs%20%23MGHDAO%0A%0Ahttps://app.metagamehub.io/portfolio?wallet='

  // Whatsapp Text for Card Valuation
  const whatsappValuationText = `Check%20out%20this%20LAND%20valuation%20in%20the%20Metaverse!%20%23MyNFTs%20%23MGHDAO%0A%0A**************%0A${predictions?.ethPrediction.toFixed(
    2
  )}%20ETH%0A${predictions?.usdPrediction.toFixed(
    2
  )}%20USDC%0A**************%0A%0A${apiData?.opensea_link}%0A%0A${mghLink}`
  return {
    twitter: {
      portfolioLink: `https://twitter.com/intent/tweet?text=${portfolioText}`,
      valuationLink: `https://twitter.com/intent/tweet?text=${valuationText}`,

      icon: (
        <FaTwitter
          title='Copy to Twitter'
          role='link'
          className='block w-8 h-8 lg:h-10 lg:w-10 m-auto transition ease-in-out duration-300 hover:scale-105  text-blue-400'
        />
      ),
    },
    whatsapp: {
      portfolioLink: `whatsapp://send?text=${whatsappPortfolioText}`,
      valuationLink: `whatsapp://send?text=${whatsappValuationText}`,
      icon: (
        <FaWhatsapp
          title='Copy to Whatsapp'
          role='link'
          className='block w-8 h-8 lg:h-10 lg:w-10 m-auto transition ease-in-out duration-300 hover:scale-105 text-green-500 '
        />
      ),
    },
    telegram: {
      portfolioLink: `https://telegram.me/share/?text=${portfolioText}`,
      valuationLink: `https://telegram.me/share/?text=${valuationText}`,
      icon: (
        <FaTelegram
          title='Copy to Telegram'
          role='link'
          className='block w-8 h-8 lg:h-10 lg:w-10 m-auto transition ease-in-out duration-300 hover:scale-105  text-blue-400 '
        />
      ),
    },
    external: {
      portfolioLink: 'Copy Link',
      icon: (
        <FiCopy
          title='Copy Link'
          role='button'
          className='block w-8 h-8 lg:h-10 lg:w-10 transition ease-in-out duration-300 hover:scale-105 m-auto text-white'
        />
      ),
    },
  }
}
