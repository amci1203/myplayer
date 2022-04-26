import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

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

const Toolbar = ({ media, file }) => {
  const dispatch = useDispatch()
  const mode = useSelector(state => state.player.mode)
  const shuffling = useSelector(state => state.player.shuffling)
  const paused = useSelector(state => state.player.paused)
  const [looping, setLooping] = useState(false)

  useEffect(() => {
    if (!media) return
    
    media.addEventListener('pause', dispatch.player.pauseTrack)
    media.addEventListener('play', dispatch.player.resumeTrack)
    
    return () => {
      media.removeEventListener('pause', dispatch.player.pauseTrack)
      media.removeEventListener('play', dispatch.player.resumeTrack)
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

  if (!media) {
    return <footer className='player__toolbar' />
  }

  const togglePlayback = () => {
    if (paused) {
      media.play()
    } else {
      media.pause()
    }
  }

  return (
    <footer className='player__toolbar' data-show>
      <TrackProgress media={media} track={file} />
      <div className='flex items-center space-x-1'>
        <SpeedControl media={media} track={file} />
        <VolumeControl media={media} track={file} />
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
    </footer>
  )
}

export default Toolbar