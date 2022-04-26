import { Fragment } from 'react'
import {
  IoChevronBackSharp,
  IoChevronForwardSharp
} from 'react-icons/io5'

import Button from '@components/toolbar/button'

const Incrementer = props => {
  const midClass = 'bg-black rounded-md px-1 '

  if (props.className) {
    midClass += props.className
  }

  return (
    <Fragment>
      <Button
        icon={IoChevronBackSharp}
        action={props.decrement}
        disabled={props.disableDecrement ?? false}
      />
      <span onClick={props.onClick} className={midClass}>
        {props.children}
      </span>
      <Button
        icon={IoChevronForwardSharp}
        action={props.increment}
        disabled={props.disableIncrement ?? false}
      />
    </Fragment>
  )
}

export default Incrementer
