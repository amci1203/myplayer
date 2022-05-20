const findByLetter = ({ key }) => {
  const active = document.activeElement
  if (/[^a-z0-9~$#@()!`~]/.test(key)) return
  if (active?.tagName == 'INPUT') return

  if (active.getAttribute('data-start') == key) {
    if (active.nextElementSibling?.getAttribute('data-start') == key) {
      active.nextElementSibling.focus()
      return
    }

    const all = [...document.querySelectorAll(`.player__list-item.file[data-start='${key}']`)]
    const curr = active.getAttribute('data-path')
    const next = all.findIndex(el => el.getAttribute('data-path') == curr) + 1

    if (next < all.length) {
      all[next].focus()
      return
    }
  }

  const el = document.querySelector(`.player__list-item.file[data-start='${key}']`)
  scrollTrackIntoView(el?.getAttribute('data-path'))
  el?.focus()
}

export default findByLetter
