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

const Toolbar = ({ media, file, mode }) => {
  const dispatch = useDispatch()
  const shuffling = useSelector(state => state.player.shuffling)
  const paused = useSelector(state => state.player.paused)
  const [looping, setLooping] = useState(false)

  useEffect(() => {
    if (!media) return
    
    media.addEventListener('pause', dispatch.player.pauseTrack)
    media.addEventListener('play', dispatch.player.resumeTrack)
    media.addEventListener('ended', dispatch.player.requestNext)
    
    return () => {
      media.removeEventListener('pause', dispatch.player.pauseTrack)
      media.removeEventListener('play', dispatch.player.resumeTrack)
      media.removeEventListener('ended', dispatch.player.requestNext)
    }
  }, [media])
  
  useEffect(() => {
    if (!media) return
    media.loop = looping
  }, [looping])

  useEffect(() => {
    if (!media) return

    const actions = {
      play : dispatch.player.togglePause,
      pause: dispatch.player.togglePause,
      stop: dispatch.player.stopTrack,
      previoustrack: dispatch.player.requestPrev,
      nexttrack: dispatch.player.requestNext,
    }

    for (let [action, fn] of Object.entries(actions)) {
      navigator.mediaSession.setActionHandler(action, fn)
    }
  }, [media])

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