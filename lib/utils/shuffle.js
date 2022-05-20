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

export default shuffle
