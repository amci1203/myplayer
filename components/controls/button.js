import { createElement } from 'react'

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

export default Control
