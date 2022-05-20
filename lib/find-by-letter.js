import scrollTrackIntoView from '@lib/scroll-into-view'

const getStart = key => key == "'"
  ? `[data-start="'"]`
  : `[data-start='${key}']`

const findByLetter = ({ key }) => {
  const active = document.activeElement
  if (/[^a-z0-9~$#@()!`~'"]/.test(key)) return
  if (active?.tagName == 'INPUT') return

  if (key == active.getAttribute('data-start') == active.nextElementSibling?.getAttribute('data-start')) {
    active.nextElementSibling.focus()
    return
  }

  if (active.getAttribute('data-start')) {
    const curr = active.getAttribute('data-path')
    const all = [...document.querySelectorAll(`${getStart(key)}, [data-path='${curr}']`)]
    const next = all.findIndex(el => el.getAttribute('data-path') == curr) + 1

    if (next < all.length) {
      all[next].focus()
      return
    }
  }

  const el = document.querySelector(getStart(key))
  scrollTrackIntoView(el?.getAttribute('data-path'))
  el?.focus()
}

export default findByLetter
