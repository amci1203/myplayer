const PlayerReducer = {
  name: 'player',

  state: {
    track: null,
    mode: null,
    next: null,
    path: null,
    shuffling: false,
  },

  reducers: {
    setTrack: (state, payload) => {
      state.track = payload.track,
      state.path = payload.path
      state.mode = payload.mode
    },
    
    stopTrack: state => {
      state.track = null
      state.path = null
    },

    toggleShuffle: state => {
      state.shuffling = !state.shuffling
    }
  },

  effects: dispatch => ({
    async select (payload) {
      if (payload === null) {
        return this.setTrack(null)
      }

      const { handle, path, mode } = payload
      const file = await handle.getFile()
      const track = URL.createObjectURL(file)
      this.setTrack({ track, path, mode })
    },

    requestNext (noop, state) {
      if (state.files.search && !state.files.matched) {
          return this.stopTrack()
        }

      if (state.player.shuffling) {
        dispatch.files.getRandomTrack({
          currentPath: state.player.path,
          direction: 'right'
        })
      } else {
        dispatch.files.getNext(state.player.path.split('.'))
      }
    },

    requestPrev (noop, state) {
      if (state.files.search && !state.files.matched) {
          return this.stopTrack()
        }

      if (state.player.shuffling) {
        dispatch.files.getRandomTrack({
          currentPath: state.player.path,
          direction: 'left'
        })
      } else {
        dispatch.files.getPrev(state.player.path.split('.'))
      }
    },
  })
}

export default PlayerReducer
