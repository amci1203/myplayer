import { useState, useEffect } from 'react'

import {
  IoVolumeMuteSharp,
  IoVolumeOffSharp,
  IoVolumeLowSharp,
  IoVolumeMediumSharp,
  IoVolumeHighSharp,
} from 'react-icons/io5'

import Incrementer from '@components/toolbar/incrementer'

const VolumeIcon = ({ v, muted }) => {
  if (muted) return <IoVolumeMuteSharp />
  if (v < 33) return <IoVolumeOffSharp />
  if (v < 67) return <IoVolumeLowSharp />
  if (v < 90) return <IoVolumeMediumSharp />
  return <IoVolumeHighSharp />
}

const VolumeControl = ({ media, track, hide }) => {
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(100)

  const increment = () => {
    if (volume == 100) return
    setVolume(volume + 5)
  }
  
  const decrement = () => {
    if (volume == 0) return
    setVolume(volume - 5)
  }

  useEffect(() => {
    if (!media) return
    media.volume = (volume / 100).toFixed(2)
  }, [track, volume])

  useEffect(() => {
    if (!media) return
    media.muted = muted
  }, [track, muted])

  if (hide) return null

  const vprops = {
    increment,
    decrement,
    disableDecrement: volume == 0,
    disableIncrement: volume == 100,
    onClick: () => setMuted(!muted),
    className: 'flex items-center w-[58px]',
  }

  return (
    <Incrementer {...vprops}>
      <VolumeIcon v={volume} muted={muted} />&nbsp;{volume}
    </Incrementer>
  )
}

export default VolumeControl
