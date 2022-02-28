import React, { useEffect, useState } from 'react'
import { FaRegThumbsDown, FaRegThumbsUp, FaSadTear, FaSmile, FaThumbsDown, FaThumbsUp } from 'react-icons/fa'
import { Metaverse } from '../../lib/enums'
import {
  dislikeLand,
  getValuationScores,
  likeLand,
} from '../../lib/FirebaseUtilities'
import { useAppSelector } from '../../state/hooks'

export interface Score {
  likes: string[]
  dislikes: string[]
}

interface Props {
  landId: string
  metaverse: Metaverse
}
const LandLikeBox = ({ landId, metaverse }: Props) => {
  const { address } = useAppSelector((state) => state.account)
  const [score, setScore] = useState<Score>()
  const [refetch, setRefetch] = useState(false)
  const [userReacted, setUserReacted] = useState({
    liked: false,
    disliked: false,
  })

  const like = async () => {
    if (!address || !score) return
    // If user already liked take like away
    if (userReacted.liked) {
      /////// Instant Feedback
      setUserReacted({ liked: false, disliked: false })
      setScore({
        likes: score?.likes.filter((wallet) => wallet !== address),
        dislikes: score?.dislikes.filter((wallet) => wallet !== address),
      })
      // taking like out
      await likeLand(landId, address, metaverse)
    } else {
      /////// Instant Feedback
      setUserReacted({ liked: true, disliked: false })
      setScore({
        likes: [...score.likes, address],
        dislikes: score?.dislikes.filter((wallet) => wallet !== address),
      })
      // liking
      await likeLand(landId, address, metaverse)
    }
    setRefetch(!refetch)
  }

  const dislike = async () => {
    if (!address || !score) return
    // If user already dislike then take dislike out
    if (userReacted.disliked) {
      /////// Instant Feedback
      setUserReacted({ liked: false, disliked: false })
      setScore({
        likes: score.likes.filter((wallet) => wallet !== address),
        dislikes: score.dislikes.filter((wallet) => wallet !== address),
      })
      // taking dislike out
      await dislikeLand(landId, address, metaverse)
    } else {
      /////// Instant Feedback
      setUserReacted({ liked: false, disliked: true })
      setScore({
        likes: score.likes.filter((wallet) => wallet !== address),
        dislikes: [...score?.dislikes, address],
      })
      // disliking
      await dislikeLand(landId, address, metaverse)
    }
    setRefetch(!refetch)
  }

  useEffect(() => {
    const fetchLikes = async () => {
      if (!landId) return
      const score = (await getValuationScores(landId, metaverse)) as
        | Score
        | undefined
      if (!score) return setRefetch(!refetch)
      setScore(score)
      if (!address) return
      const liked = score?.likes.includes(address) || false
      const disliked = score?.dislikes.includes(address) || false
      setUserReacted({ liked: liked, disliked: disliked })
    }
    fetchLikes()
  }, [landId, refetch, address])

  return (
    <div className='flex text-center w-full justify-start font-medium gap-8 text-gray-200'>
      {/* Like */}
      <div className='flex items-end gap-4'>
        <FaRegThumbsUp
          onClick={like}
          role='button'
          className={
            'h-8 md:h-10 w-8 md:w-10 hover:text-green-500 transition-all ' +
            (userReacted.liked ? 'text-green-500' : '')
          }
        />
        <p className='text-green-500 text-xl font-medium'>{score?.likes.length || 0}</p>
      </div>
      {/* Dislike */}
      <div className='flex items-end gap-4'>
      {/* <div> */}
        <FaRegThumbsDown
          onClick={dislike}
          role='button'
          className={
            'h-8 md:h-10 w-8 md:w-10 hover:text-red-500 transition-all ' +
            (userReacted.disliked && 'text-red-500')
          }
        />
        <p className='text-red-500 font-medium text-xl'>{score?.dislikes.length || 0}</p>
      </div>
    </div>
  )
}

export default LandLikeBox
