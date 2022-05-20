const scrollTrackIntoView = path => {
  const el = document.querySelector(`[data-path="${path}"]`)
  if (!el) return

  const { top, bottom } = el?.getBoundingClientRect()

  if (bottom > window.innerHeight) {
    window.scrollTo(0, bottom + window.scrollY - 144)
  } else if (top < 0) {
    window.scrollTo(0, top + window.scrollY - 72)
  }
}

export default scrollTrackIntoView
