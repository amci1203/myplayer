import { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  IoPlaySharp,
  IoPauseSharp,
  IoPlaySkipBackSharp,
  IoPlaySkipForwardSharp,
  IoRepeatSharp,
  IoShuffleSharp,
} from 'react-icons/io5'

import Control from '@components/toolbar/button'
import TrackProgress from '@components/toolbar/progress'
import VolumeControl from '@components/toolbar/volume'
import SpeedControl from '@components/toolbar/speed'
import setupMediaHandlers from '@lib/setup-media-listeners'

const Toolbar = ({ media, file, mode }) => {
  const dispatch = useDispatch()
  const shuffling = useSelector(state => state.player.shuffling)
  const paused = useSelector(state => state.player.paused)
  const [looping, setLooping] = useState(false)

  useEffect(setupMediaHandlers(media, dispatch), [media])
  
  useEffect(() => {
    if (!media) return
    media.loop = looping
  }, [looping])

  const togglePlayback = () => {
    if (paused) {
      media.play()
    } else {
      media.pause()
    }
  }

  return (
    <Fragment>
      <TrackProgress media={media} track={file} hide={mode == 'PHOTO'} />
      <div className='flex items-center space-x-1'>
        <SpeedControl media={media} track={file} hide={mode == 'PHOTO'} />
        <VolumeControl media={media} track={file} hide={mode == 'PHOTO'} />
      </div>
      <div className='flex items-center'>
        <Control
          action={() => setLooping(!looping)}
          icon={IoRepeatSharp}
          active={looping}
        />
        <Control
          icon={IoShuffleSharp}
          action={dispatch.player.toggleShuffle}
          active={shuffling}
        />
        <Control
          icon={IoPlaySkipBackSharp}
          action={dispatch.player.requestPrev}
        />
        <Control
          icon={IoPlaySkipForwardSharp}
          action={dispatch.player.requestNext}
        />
        <Control
          icon={paused ? IoPlaySharp : IoPauseSharp}
          action={togglePlayback}
        />
      </div>
    </Fragment>
  )
}

export default Toolbar