import { FaMusic } from 'react-icons/fa'
import { MdPhoto, MdVideoCameraBack } from 'react-icons/md'

export const icons = {
  MUSIC: <FaMusic />,
  PHOTO: <MdPhoto />,
  VIDEO: <MdVideoCameraBack />
}

const photo = [
  '.jpg',
  '.jpeg',
  '.gif',
  '.png',
  '.bmp',
  '.svg',
]

const video = [
  '.mp4',
  '.mkv',
]

const music = [
  '.wav',
  '.mp3',
  '.opus',
  '.ogg',
  '.m4a',
  '.mpeg',
]

const allowed = [...music, ...video, ...photo]

export const isSupportedFile = filename => {
  try {
    const ext = filename.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase()
    if (!ext) return false
    return allowed.includes(ext)
  } catch (err) {
    return false
  }
}

export const getFileType = filename => {
  try {
    const ext = filename.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase()
    if (!ext) return null

    if (music.includes(ext)) return 'MUSIC'
    if (video.includes(ext)) return 'VIDEO'
    if (photo.includes(ext)) return 'PHOTO'
    return null
  } catch (err) {
    return null
  }

}

export const getFileTypeIcon = filename => {
  const type = getFileType(filename)
  return icons[type]
}

export default isSupportedFile
