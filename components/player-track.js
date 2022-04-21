import { getTrackBackground } from 'react-range'

export const Track = (values, min, max) => ({ props, children }) => (
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

export const Thumb = ({ props, isDragged }) => (
  <div className='h-5 w-5 rounded-full shadow'
    {...props}
    style={{
      ...props.style,
      backgroundColor: isDragged ? '#548BF4' :'#FFF',
    }}
  />
)

export const Mark = ({ props, index }) => index % 5 ? null : (
  <div {...props} className='h-3 w-[1px] bg-gray-600' />
)