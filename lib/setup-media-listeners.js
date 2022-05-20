const setupMediaHandlers = (media, dispatch) => () => {
  if (!media) return

  const handleKeyPresses = ev => {
    if (ev.key == ' ') {
      dispatch.player.togglePause()
      return
    }
  }

  window.addEventListener('keypress', handleKeyPresses)
  media.addEventListener('pause', dispatch.player.pauseTrack)
  media.addEventListener('play', dispatch.player.resumeTrack)
  media.addEventListener('ended', dispatch.player.requestNext)
  
  if ('mediaSession' in navigator) {
    const actions = {
      play : dispatch.player.togglePause,
      pause: dispatch.player.togglePause,
      stop: dispatch.player.stopTrack,
      previoustrack: dispatch.player.requestPrev,
      nexttrack: dispatch.player.requestNext,
    }
    
    for (let [action, fn] of Object.entries(actions)) {
      navigator.mediaSession.setActionHandler(action, fn)
    }
  }
  
  return () => {
    window.removeEventListener('keypress', handleKeyPresses)
    media.removeEventListener('pause', dispatch.player.pauseTrack)
    media.removeEventListener('play', dispatch.player.resumeTrack)
    media.removeEventListener('ended', dispatch.player.requestNext)
  }
}

export default setupMediaHandlers
