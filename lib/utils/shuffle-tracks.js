export const shuffleTracks = arr => {
  const getAllFiles = root => root.reduce((arr, item) => {
    return item.directory
      ? (item.files ? [...arr, ...getAllFiles(item.files)] : arr)
      : [...arr, item]
  }, [])
  
  const shuffle = arr => {
    let j, x, i
  
    for (i = arr.length; --i;) {
        j = Math.floor(Math.random() * (i + 1))
        x = arr[i]
        arr[i] = arr[j]
        arr[j] = x
    }
    return arr
  }

  const all = getAllFiles(arr)
  return shuffle(all)
}