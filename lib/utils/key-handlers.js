export const onKeyCode = (code, fn) => ev => ev.charCode == code && fn(ev)
export const onKey = (key, fn) => ev => ev.key == key && fn(ev)

export const handleKeys = map => ev => {
  if (ev.charCode in map) return map[ev.charCode](ev)
  if (ev.key in map) return map[ev.key](ev)
}

export const onEnterKey = fn => onKeyCode(13, fn)
