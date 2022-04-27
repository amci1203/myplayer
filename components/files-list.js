import { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'
import { icons } from '@lib/file-types'


const _File = activate => function File ({ file, type, path, playing }) {
  const active = path == playing

  return (
    <div
      className='player__list-item file'
      onClick={active ? undefined : activate(file, path, type)}
      onDoubleClick={activate(file, path, type)}
      data-active={active || undefined}
      data-path={path}
    >
      <div className='w-4 mr-3'>{icons[type]}</div>
      <span>{file.name}</span>
    </div>
  )
}

const _Directory = (File, dispatch) => function Directory (props) {
  const { dir, playing } = props
  const path = props.path + '.files'

  if (dir.files === null) {
    const getFiles = () => dispatch.files.getTree({
      root: path,
      handle: dir.handle
    })

    return (
      <div className='player__list-item directory'>
        <div className='label w-full' onClick={getFiles}>
          <div className='w-4 mr-3'><FaFolder /></div>
          <span>{dir.handle.name}</span>
        </div>
      </div>
    )
  }

  const close = () => dispatch.files.closeSubfolder(path)
  const content = dir.files.length
    ? dir.files?.reduce((list, item, index) => {
      const common = {
        playing,
        key: index,
        path: item.path,
        name: item.name
      }

      if (item.directory) {
        const dprops = {
          ...props,
          ...common,
          dir: item,
        }

        list.push(<Directory {...dprops}/>)
        return list
      }

      const fprops = { ...common, file: item.handle, type: item.type }
      list.push(<File {...fprops}/>)

      return list
    }, [])
    : <div className='text-gray-400 italic px-4'>(No items found)</div>

  return (
    <div className='player__list-item directory' data-active>
      <div className='label w-full' onClick={close}>
        <div className='w-4 mr-3'>
          <FaFolderOpen />
        </div>
        <span>{props.dir.handle.name}</span>
      </div>
      <div>{content}</div>
    </div>
  )
}

const bringIntoView = path => {
  const el = document.querySelector(`[data-path="${path}"]`)
  if (!el) return

  const { top, bottom } = el?.getBoundingClientRect()

  if (bottom > window.innerHeight) {
    const y = bottom + window.scrollY - 144
    window.scrollTo({ top: y, behavior: 'smooth' })
  } else if (top < 0) {
    const y = top + window.scrollY - 72
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const FilesList = () => {
  const dispatch = useDispatch()
  const files = useSelector(state => state.files.tree, shallowEqual)
  const matched = useSelector(state => state.files.matched, shallowEqual)
  const playing = useSelector(state => state.player.path)
  const searching = useSelector(state => !!state.files.search)

  useEffect(() => {
    bringIntoView(playing)
  }, [playing])

  if (!files?.length) return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h2 className='text-3xl mb-5'>#Woopsieee</h2>
      <p className='text-center'>
        No supported files were found in this directory.
        <br/>
        Please try another one
      </p>
    </div>
  )

  if (searching && !matched) return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h2 className='text-3xl mb-5'>#OOF</h2>
      <p className='text-center'>
        No files found with that search
        <br/>
        Please try another search
      </p>
    </div>
  )

  const select = (h, p, t) => () => {
    dispatch.files.reshuffleTracks(p)
    dispatch.player.select({
      handle: h,
      path: p,
      type: t,
    })
  }

  const FItem = _File(select)
  const DItem = _Directory(FItem, dispatch)

  const list = (matched ?? files).map((item, i) => {
    const common = {
      playing,
      key: item.path,
      path: item.path,
    }

    return item.directory
      ? <DItem {...common} dir={item} />
      : <FItem {...common} file={item.handle} type={item.type} />
  })

  return (
    <section className='py-20 pb-24 min-h-screen'>
      {list ?? <div className='mt-24'>Nothing</div>}
    </section>
  )
}

export default FilesList
