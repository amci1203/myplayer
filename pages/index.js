import Head from 'next/head'
import { useState, useEffect, useCallback, Fragment } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import FilesList from '@components/files-list'
import Toolbar from '@components/toolbar'
import { FaWindowClose } from 'react-icons/fa'

const Home = () => {
  const dispatch = useDispatch()
  const [scanDirs, setScanDirs] = useState(false)
  const [media, setMedia] = useState(null)
  const [canReadFS, setFSAvailability] = useState(true)
  const handle = useSelector(state => state.files.handle)
  const mode = useSelector(state => state.player.mode)
  const file = useSelector(state => state.player.track, shallowEqual)

  const setMediaElement = useCallback(node => {
    if (node === media) return
    setMedia(node)
  }, [])

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

  let component = null

  if (mode == 'MUSIC') {
    component = <audio ref={setMediaElement} src={file} />
  } else if (mode) {
    const el = mode == 'VIDEO'
      ? <video ref={setMediaElement} src={file} />
      : <img src={file} />

    const close = () => {
      if (media?.pause) media.pause()
      dispatch.player.stopTrack()
    }
  
    component = (
      <section className='player__overlay'>
        <span
          className='player__overlay__close'
          onClick={close}
        >
          <FaWindowClose size='24' />
        </span>
        {el}
      </section>
    )
  }

  if (handle === null) {
    return (
      <section className='flex flex-col justify-center items-center h-screen'>
        <Head>
          <title>MyPlayer</title>
          <meta name='theme-color' content='#1F2937' />
        </Head>
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

  const showControls = !!media || mode == 'PHOTO'

  return (
    <Fragment>
      {component}
      <FilesList />
      <footer className='player__toolbar' data-show={showControls || undefined}>
        <Toolbar media={media} file={file} mode={mode} />
      </footer>
    </Fragment>
  )
}

export default Home
