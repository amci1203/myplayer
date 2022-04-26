import { useState, useEffect } from 'react'

import Incrementer from '@components/controls/incrementer'

const useSpeedControl = media => {
  const [speed, setSpeed] = useState(100)

  useEffect(() => {
    if (!media.current) return
    media.current.playbackRate = (speed / 100).toFixed(2)
  }, [media, speed])

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

  const SpeedControl = () => (
    <Incrementer {...sprops}>
      &times;&nbsp;{(speed / 100).toFixed(2)}
    </Incrementer>
  )

  return { SpeedControl }
}

export default useSpeedControl
