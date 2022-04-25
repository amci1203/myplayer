import { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import FilesList from '@components/files-list'
import AudioPlayer from '@components/player'

const Home = () => {
  const dispatch = useDispatch()
  const [scanDirs, setScanDirs] = useState(false)
  const [canReadFS, setFSAvailability] = useState(true)
  const handle = useSelector(state => state.files.handle)

  useEffect(() => {
    if (!window.showDirectoryPicker) {
      setFSAvailability(false)
    }
  }, [])

  if (!canReadFS) {
    return (
      <section className='flex flex-col justify-center items-center h-screen'>
        <h2 className='text-4xl capitalize mb-2'>
          Sorry :(
        </h2>
        <p className='text-center text-lg'>
          This browser does not support the File System Access API
          <br />
          Please try Chrome, Safari, or Opera instead
        </p>
      </section>
    )
  }

  const selectDirectory = async () => {
    try {
      const handle = await showDirectoryPicker()
      dispatch.files.getTree({ handle, scanDirs })
    } catch (err) {
      console.error(err)
    }
  }

  if (handle === null) {
    return (
      <section className='flex flex-col justify-center items-center h-screen'>
        <h2 className='text-xl capitalize'>
          Please select a directory to search for your media in.
        </h2>
        <button className='btn mt-8 mb-5' onClick={selectDirectory}>
          Select Directory
        </button>
        {/* <label className='flex items-center space-x-3'>
          <input
            type='checkbox'
            onChange={ev => setScanDirs(ev.target.checked)}
            value={scanDirs}
          />
          <span>Automatically Scan Subdirectories</span>
        </label> */}
      </section>
    )
  }

  
  return (
    <Fragment>
      <FilesList />
      <AudioPlayer />
    </Fragment>
  )
}

export default Home
