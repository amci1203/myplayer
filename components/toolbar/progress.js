import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Range, getTrackBackground } from 'react-range'

const formatTime = seconds => {
  if (Number.isNaN(seconds)) return '00:00'

  let s = Math.ceil(seconds)
  let m = String(~~(s / 60)).padStart(2, '0')
  s = String(s % 60).padStart(2, '0')

  return m + ':' + s
}

const Track = (values, min, max) => ({ props, children }) => (
  <div
    onMouseDown={props.onMouseDown}
    onTouchStart={props.onTouchStart}
    className='flex items-center w-full h-8 space-x-6'
    style={props.style}
  >
    <div
      ref={props.ref}
      children={children}
      className='h-1 w-full self-center rounded-full'
      style={{
        background: getTrackBackground({
          values,
          min,
          max,
          colors: ['#548BF4', '#CCC'],
        })
      }}
    />
  </div>
)

const Thumb = ({ props, isDragged }) => (
  <div className='h-5 w-5 rounded-full shadow'
    {...props}
    style={{
      ...props.style,
      backgroundColor: isDragged ? '#548BF4' :'#FFF',
    }}
  />
)

const TrackProgress = ({ media, track: file }) => {
  const dispatch = useDispatch()
  const [elapsed, setElapsed] = useState([0])
  const track = useRef(null)

  const startTrackProgress = () => {
    clearInterval(track.current)
    if (!media) return

    track.current = setInterval(() => {
      if (media?.ended) {
        media.pause()
        dispatch.player.requestNext()
      } else {
        setElapsed([~~(media?.currentTime ?? 0)])
      }
    }, 1000)
  }

  const stopTrackProgress = () => {
    clearInterval(track.current)
  }

  const resumeTrackProgress = (v) => {
    startTrackProgress()
    
    if (Array.isArray(v)) {
      media.currentTime = v[0]
      setElapsed(v)
    }
  }

  const handleScrub = ([to]) => {
    stopTrackProgress()
    media.currentTime = to
    setElapsed([to])
  }

  useEffect(() => {
    if (!media) return

    media.addEventListener('pause', stopTrackProgress)
    media.addEventListener('play', resumeTrackProgress)
    
    return () => {
      media.removeEventListener('pause', stopTrackProgress)
      media.removeEventListener('play', resumeTrackProgress)
    }
  }, [])

  useEffect(() => {
    if (!media) return

    if (file) {
      media.play()
      startTrackProgress()
    } else if (media) {
      media.pause()
    }
  }, [file])

  return (
    <div className='flex items-center space-x-4 w-full'>
      <span>{formatTime(elapsed)}</span>
      <Range
        step={1}
        min={0}
        max={~~(media?.duration || 1)}
        values={elapsed}
        onChange={handleScrub}
        onFinalChange={resumeTrackProgress}
        renderTrack={Track(elapsed, 0, media?.duration)}
        renderThumb={Thumb}
      />
      <span>
        -{formatTime(media?.duration - elapsed)}
      </span>
    </div>
  )
}

export default TrackProgress
