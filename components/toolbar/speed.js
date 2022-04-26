import { useState, useEffect } from 'react'

import Incrementer from '@components/toolbar/incrementer'

const SpeedControl = ({ media, track }) => {
  const [speed, setSpeed] = useState(100)

  useEffect(() => {
    if (!media) return
    media.playbackRate = (speed / 100).toFixed(2)
  }, [track, speed])

  const increment = () => {
    if (speed == 150) return
    setSpeed(speed + 5)
  }

  const decrement = () => {
    if (speed == 25) return
    setSpeed(speed - 5)
  }

  const sprops = {
    increment,
    decrement,
    disableIncrement: speed == 150,
    disableDecrement: speed == 25,
  }

  return (
    <Incrementer {...sprops}>
      &times;&nbsp;{(speed / 100).toFixed(2)}
    </Incrementer>
  )
}

export default SpeedControl
