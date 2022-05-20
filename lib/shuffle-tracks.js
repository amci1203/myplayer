import shuffle from '@utils/shuffle'

export const shuffleTracks = arr => {
  const getAllFiles = root => root.reduce((arr, item) => {
    return item.directory
      ? (item.files ? [...arr, ...getAllFiles(item.files)] : arr)
      : [...arr, item]
  }, [])

  const all = getAllFiles(arr)
  return shuffle(all)
}
