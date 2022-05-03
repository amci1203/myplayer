import objects from 'nested-property'

import { getFileType } from '@lib/file-types'
import { shuffleTracks } from '@utils/shuffle-tracks'

const initial = () => ({
  handle: null,
  tree: null,
  mode: 'tree',

  search: '',
  matched: null,

  shuffled: [],
  shuffleIndex: 0,

  show: {
    music: true,
    photo: true,
    video: true,
  },
})

const FilesReducer = {
  name: 'files',
  state: initial(),

  reducers: {
    setPath (state, { handle, tree, root }) {
      if (!root) {
        state.handle = handle ?? state.handle
        state.tree = tree
      } else {
        objects.set(state.tree, root, tree)
      }

      state.shuffled = shuffleTracks(state.matched ?? state.tree)
      state.shuffleIndex = ~~(state.shuffled.length / 2)
    },

    reshuffleTracks (state, path) {
      if (!state.handle) return
      state.shuffled = shuffleTracks(state.matched ?? state.tree)
      state.shuffleIndex = ~~(state.shuffled.length / 2)

      if (path) {
        const index = state.shuffled.findIndex(item => item.path == path)
        const temp = state.shuffled[index]
        state.shuffled[index] = state.shuffled[state.shuffleIndex]
        state.shuffled[state.shuffleIndex] = temp
      }
    },

    setShuffledIndex (state, payload) {
      if (payload === 0 || payload == state.shuffled.length - 1) {
        state.shuffled = shuffleTracks(state.matched ?? state.tree)
        state.shuffleIndex = ~~(state.shuffled.length / 2)
      } else {
        state.shuffleIndex = payload
      }
    },
    
    setMatched (state, payload) {
      if (!payload?.length) {
        state.matched = null
        state.shuffled = []
        state.shuffleIndex = 0
      } else {
        state.matched = payload
        state.shuffled = shuffleTracks(state.matched)
        state.shuffleIndex = ~~(state.shuffled.length / 2)
      }

    },

    setQuery: (state, payload) => {
      state.search = payload
    },

    setFilter: (state, payload) => {
      state.show[payload.key] = payload.value
    },

    toggleMode: state => {
      state.mode = state.mode = 'tree' ? 'thumbs' : 'tree'
    },

    closeSubfolder: (state, payload) => {
      objects.set(state.tree, payload, null)
      state.shuffled = shuffleTracks(state.matched ?? state.tree)
      state.shuffleIndex = ~~(state.shuffled.length / 2)
    },

    reset: () => initial(),
  },

  effects: dispatch => ({
    async getTree ({ root, handle, filtering }, state) {
      const iterator = await handle.entries()
      const tree = []

      const getPath = root
        ? () => root + '.' + tree.length
        : () => String(tree.length)

      while (true) {
        try {
          const next = await iterator.next()
          const [, handle] = next.value

          if (handle.kind == 'directory') {
            tree.push({
              directory: true,
              files: null,
              path: getPath(),
              handle,
            })
          } else {
            const { show } = state.files
            const type = getFileType(handle.name)

            if (
              !type
              || (type == 'MUSIC' && !show.music)
              || (type == 'PHOTO' && !show.photo)
              || (type == 'VIDEO' && !show.video)
            ) continue

            tree.push({
              type,
              file: true,
              path: getPath(),
              handle
            })
          }

          if (next.done) break
        } catch (err) {
          console.error(err)
          break
        }
      }

      if (!root && !filtering) {
        dispatch.player.stopTrack()
      }

      this.setPath({ handle, tree, root })
    },

    searchFiles (q, state) {
      this.setQuery(q)
      if (!state.files.tree) return

      if (!q) {
        this.setMatched(null)
        return
      }

      try {
        const rx = new RegExp(q, 'i')
        const findMatches = (arr, path = '') => arr.reduce((arr, item) => {
          if (item.files?.length) {
            const files = findMatches(item.files, arr.length + '.files.')

            if (!files?.length) return arr

            arr.push({
              ...item,
              files,
              path: path.replace(/files\.$/, '') + arr.length,
            })

            return arr
          }

          if (!rx.test(item.handle.name)) return arr
          arr.push({ ...item, path: path + arr.length })

          return arr
        }, [])
  
        const tree = findMatches(state.files.tree)
        console.log(tree)
        this.setMatched(tree)
      } catch (err) {
        this.setMatched(null)
      } // Ignore invalid regex; let them keep typing
    },

    toggleFilter (key, state) {
      const next = !state.files.show[key]
      this.setFilter({ key, value: next })

      if (state.files.search) {
        dispatch.files.searchFiles(state.files.search)
      }
    },

    getRandomTrack ({ currentPath, direction }, state) {
      let { shuffled, shuffleIndex } = state.files
      let next

      if (shuffled.length == 1) {
        return dispatch.player.select(shuffled[0])
      } else if (!shuffled.length) {
        return dispatch.player.stopTrack()
      }

      do {
        shuffleIndex += (direction == 'right' ? 1 : -1)
        next = shuffled[shuffleIndex]
      } while (next?.path == currentPath)

      this.setShuffledIndex(shuffleIndex)
      dispatch.player.select(next)
    },

    getNext (c, state) {
      const current = c.slice()

      let currIndex = +current.pop()
      let files = state.files.matched ?? state.files.tree
      let cwd = current.length
        ? objects.get(files, current.join('.'))
        : files
      
      // First we check if we've reached the end
      // of the files in the current directory
      // Or if folder the current file came from is now closed
      // If we have, go up one folder and try again
      if (!cwd.length || cwd.length - 1 == currIndex) {
        if (current.length) {
          // Subdirectories' files would have the extra
          // "files" part, so need to pop that off too
          current.pop()
          this.getNext(current)
        } else {
          // We've reached the end and are starting over
          this.getNext([-1])
        }

        return
      }

      // Now we just go down the list
      // We select the first file or the
      // first non empty directory's first file
      for (let i = currIndex + 1, len = cwd.length; i != currIndex; i++) {
        // Loop back around to the beginning
        // If looking forward didn't help
        if (i == len) {
          if (currIndex == -1) {
            // No playable/viewable files were found
            // to loop back to. Shouldn't happen normally
            // But can, like if you had a folder open and then you closed it
            // Honestly don't know what I'd even do at this point
            return dispatch.player.stopTrack()
          }

          i = 0
        }

        const nextPath = [...current, i]
        const next = objects.get(files, nextPath.join('.'))

        if (next?.directory) {
          if (!next.files?.length) continue
          return dispatch.player.select(next.files[0])
        }

        return dispatch.player.select(next)
      }
    },

    getPrev (c, state) {
      const current = c.slice()

      let currIndex = +current.pop()

      let files = state.files.matched ?? state.files.tree
      let cwd = current.length
        ? objects.get(files, current.join('.'))
        : files

      if (!cwd.length || !currIndex) {
        if (current.length) {
          current.pop()
          this.getPrev(current)
        } else {
          this.getPrev([files.length])
        }

        return
      }

      for (let i = currIndex - 1, last = cwd.length - 1; i != currIndex; i--) {
        if (!i) {
          if (currIndex == last + 1) {
            return dispatch.player.stopTrack()
          }

          i = last
        }

        const nextPath = [...current, i]
        const next = objects.get(files, nextPath.join('.'))

        if (next?.directory) {
          if (!next.files?.length) continue
          return dispatch.player.select(next.files[next.files.length - 1])
        }

        return dispatch.player.select(next)
      }
    }
  })
}

export default FilesReducer
