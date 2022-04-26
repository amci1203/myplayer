import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import {
  IoPlaySharp,
  IoPauseSharp,
  IoPlaySkipBackSharp,
  IoPlaySkipForwardSharp,
  IoRepeatSharp,
  IoShuffleSharp,
} from 'react-icons/io5'

import Control from '@components/controls/button'
import useVolumeControl from '@hooks/volume'
import useSpeedControl from '@lib/hooks/playback-speed'
import useTrackProgress from '@lib/hooks/track-progress'

const AudioPlayer = props => {
  const dispatch = useDispatch()
  const file = useSelector(state => state.player.track, shallowEqual)
  const mode = useSelector(state => state.player.mode)
  const shuffling = useSelector(state => state.player.shuffling)
  const media = useRef(null)
  const track = useRef(null)

  const [paused, setPaused] = useState(false)
  const [looping, setLooping] = useState(false)
  const { VolumeControl, muted } = useVolumeControl(media)
  const { SpeedControl } = useSpeedControl(media)
  const { TrackProgress } = useTrackProgress(media, track)

  useEffect(() => {
    const actions = {
      play: setPaused(!paused),
      pause: setPaused(!paused),
      stop: dispatch.player.stopTrack,
      previoustrack: dispatch.player.requestPrev,
      nexttrack: dispatch.player.requestNext,
    }

    for (let [action, fn] of Object.entries(actions)) {
      navigator.mediaSession.setActionHandler(action, fn)
    }
  }, [shuffling])

  useEffect(() => {
    if (!media.current) return

    if (file) {
      media.current.play()
      setPaused(false)
      startTrackProgress()
    } else if (media.current) {
      media.current.pause()
    }
  }, [file])

  useEffect(() => {
    if (!media.current) return

    if (paused) {
      media.current.pause()
      clearInterval(track.current)
    } else {
      media.current.play()
      startTrackProgress()
    }
  }, [paused])

  if (!file || mode == 'MUSIC') {
    return <footer className='player__toolbar' />
  }

  return (
    <footer className='player__toolbar' data-show>
      <audio
        ref={media}
        src={file}
        loop={looping}
        muted={muted}
        controls
      />
      <TrackProgress />
      <div className='flex items-center space-x-1'>
        <SpeedControl />
        <VolumeControl />
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
          action={() => setPaused(!paused)}
        />
      </div>
    </footer>
  )
}

export default AudioPlayer