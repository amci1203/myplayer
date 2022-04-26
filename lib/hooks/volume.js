import { useState, useEffect } from 'react'

import Incrementer from '@components/controls/incrementer'

const VolumeIcon = ({ v, muted }) => {
  if (muted) return <IoVolumeMuteSharp />
  if (v < 33) return <IoVolumeOffSharp />
  if (v < 67) return <IoVolumeLowSharp />
  if (v < 90) return <IoVolumeMediumSharp />
  return <IoVolumeHighSharp />
}

const useVolumeControl = media => {
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
    if (!media.current) return
    media.current.volume = (volume / 100).toFixed(2)
  }, [file, media, volume])

  const vprops = {
    increment,
    decrement,
    disableDecrement: volume == 0,
    disableIncrement: volume == 100,
    onClick: () => setMuted(!muted),
    className: 'flex items-center w-[58px]',
  }

  const VolumeControl = () => (
    <Incrementer {...vprops}>
      <VolumeIcon v={volume} muted={muted} />&nbsp;{volume}
    </Incrementer>
  )

  return { VolumeControl, muted }
}

export default useVolumeControl
