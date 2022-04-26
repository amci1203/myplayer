import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { getTrackBackground } from 'react-range'

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
      className='h-1 w-full self-center'
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

const useTrackProgress = (media, track) => {
  const dispatch = useDispatch()
  const [elapsed, setElapsed] = useState([0]) 

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

  const TrackProgress = () => (
    <div className='flex items-center space-x-4 w-full'>
      <span>{formatTime(elapsed)}</span>
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
  )

  return { TrackProgress }
}

export default useTrackProgress
