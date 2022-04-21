import { createElement, useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { Range } from 'react-range'

import {
  IoPlaySharp,
  IoPauseSharp,
  IoPlaySkipBackSharp,
  IoPlaySkipForwardSharp,
  IoRepeatSharp,
  IoShuffleSharp,
  IoChevronBackSharp,
  IoChevronForwardSharp,
  IoVolumeOffSharp,
  IoVolumeLowSharp,
  IoVolumeMediumSharp,
  IoVolumeHighSharp,
  IoVolumeMuteSharp,
} from 'react-icons/io5'

import { Thumb, Track } from '@components/player-track'

const formatTime = seconds => {
  if (Number.isNaN(seconds)) return '00:00'

  let s = Math.ceil(seconds)
  let m = String(~~(s / 60)).padStart(2, '0')
  s = String(s % 60).padStart(2, '0')

  return m + ':' + s
}

const Control = ({ action, icon, size, disabled, active }) => {
  const bp = {
    disabled,
    onClick: action,
    className: 'player__toolbar__control',
  }

  const ip = { size: size ?? 24 }

  if (active === false || disabled) {
    ip.style = { color: '#FFF5' }
  }

  return createElement('button', bp, createElement(icon, ip))
}

const VolumeIcon = ({ v, muted }) => {
  if (muted) return <IoVolumeMuteSharp />
  if (v < 33) return <IoVolumeOffSharp />
  if (v < 67) return <IoVolumeLowSharp />
  if (v < 90) return <IoVolumeMediumSharp />
  return <IoVolumeHighSharp />
}

const Player = props => {
  const dispatch = useDispatch()
  const file = useSelector(state => state.player.track, shallowEqual)
  const mode = useSelector(state => state.player.mode)
  const media = useRef(null)
  const track = useRef(null)

  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState([0])
  const [speed, setSpeed] = useState(1)
  const [volume, setVolume] = useState(100)
  const [muted, setMuted] = useState(false)
  const [shuffling, setShuffling] = useState(false)
  const [looping, setLooping] = useState(false)

  const startTrackProgress = () => {
    clearInterval(track.current)
    if (!media.current) return

    track.current = setInterval(() => {
      if (media.current?.ended) {
        dispatch.player.requestNext(shuffling)
      } else {
        setElapsed([~~(media.current?.currentTime ?? 0)])
      }
    }, [1000])
  }

  const handleScrub = ([to]) => {
    clearInterval(track.current)
    media.current.currentTime = to
    setElapsed([to])
  }

  // useEffect(() => {
  //   navigator.mediaSession.setActionHandler('play', () => console.log('play'))
  //   navigator.mediaSession.setActionHandler('pause', () => console.log('pause'))
  //   navigator.mediaSession.setActionHandler('stop', () => console.log('stop'))
  //   navigator.mediaSession.setActionHandler('seekbackward', () => console.log('seekbackward'))
  //   navigator.mediaSession.setActionHandler('seekforward', () => console.log('seekforward'))
  //   navigator.mediaSession.setActionHandler('previoustrack', () => console.log('previoustrack'))
  //   navigator.mediaSession.setActionHandler('nexttrack', () => console.log('nexttrack'))
  // }, [])

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
    media.current.playbackRate = speed.toFixed(2)
  }, [file, speed])
  
  useEffect(() => {
    if (!media.current) return
    media.current.volume = (volume / 100).toFixed(2)
  }, [file, volume])

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

  if (!file) {
    return <footer className='player__toolbar' />
  }

  const skipBack = () => dispatch.player.requestPrev(shuffling)
  const skipForward = () => dispatch.player.requestNext(shuffling)
  
  const incrementSpeed = () => {
    if (speed >= 1.50) return
    setSpeed(speed + 0.05)
  }

  const decrementSpeed = () => {
    if (speed <= 0.25) return
    setSpeed(speed - 0.05)
  }

  const incrementVolume = () => {
    if (volume == 100) return
    setVolume(volume + 5)
  }
  
  const decrementVolume = () => {
    if (volume == 0) return
    setVolume(volume - 5)
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
      <div className='flex items-center space-x-4 w-full'>
        <span>
          {formatTime(elapsed)}
        </span>
        <Range
          step={1}
          min={0}
          max={~~(media.current?.duration ?? 9999)}
          values={elapsed}
          onChange={handleScrub}
          onFinalChange={startTrackProgress}
          renderTrack={Track(elapsed, 0, media.current?.duration)}
          renderThumb={Thumb}
        />
        <span>
          -{formatTime(media.current?.duration - elapsed)}
        </span>
      </div>
      <div className='flex items-center space-x-1'>
        <Control
          action={decrementSpeed}
          icon={IoChevronBackSharp}
          disabled={speed <= 0.25}
        />
        <span className='bg-black rounded-md px-1'>
          &times;&nbsp;{speed.toFixed(2)}
        </span>
        <Control
          action={incrementSpeed}
          icon={IoChevronForwardSharp}
          disabled={speed >= 1.50}
        />
        <Control
          action={decrementVolume}
          icon={IoChevronBackSharp}
          disabled={volume == 0}
        />
        <span
          onClick={() => setMuted(!muted)}
          className='flex items-center bg-black rounded-md px-1 w-[58px]'
        >
          <VolumeIcon v={volume} muted={muted} />&nbsp;{volume}
        </span>
        <Control
          action={incrementVolume}
          icon={IoChevronForwardSharp}
          disabled={volume == 100}
        />
      </div>
      <div className='flex items-center'>
        <Control
          action={() => setLooping(!looping)}
          icon={IoRepeatSharp}
          active={looping}
        />
        <Control
          action={() => setShuffling(!shuffling)}
          icon={IoShuffleSharp}
          active={shuffling}
        />
        <Control
          action={skipBack}
          icon={IoPlaySkipBackSharp}
        />
        <Control
          action={skipForward}
          icon={IoPlaySkipForwardSharp}
        />
        <Control
          action={() => setPaused(!paused)}
          icon={paused ? IoPlaySharp : IoPauseSharp}
        />
      </div>
    </footer>
  )
}

export default Player