import { Fragment, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaFilter, FaFolderPlus, FaSearch, FaTimes} from 'react-icons/fa'
import { ControlledMenu, MenuItem, useMenuState } from '@szhsin/react-menu'
import { icons } from '@lib/file-types'

const Header = props => {
  const dispatch = useDispatch()
  const query = useSelector(state => state.files.search)
  const show = useSelector(state => state.files.show)
  const ready = useSelector(state => !!state.files.handle)

  const filterMenuTrigger = useRef()
  const [filterMenu, toggleMenu] = useMenuState({ transition: true })

  const selectDirectory = async () => {
    try {
      const handle = await showDirectoryPicker()
      dispatch.files.getTree({ handle })
    } catch (err) {
      console.error(err)
    }
  }

  const searchIcon = query
    ? <FaTimes onClick={() => dispatch.files.searchFiles('')} />
    : <FaSearch />

  return (
    <Fragment>
      <header className='player__header'>
        <h1 className='text-2xl'><strong>My</strong>&nbsp;Player</h1>
        <section className='flex items-center'>
          <button
            ref={filterMenuTrigger}
            className='player__header__icon'
            onClick={toggleMenu}
          >
            <FaFilter size={20} title='Change Filters' />
          </button>
          <button className='player__header__icon' onClick={selectDirectory} >
            <FaFolderPlus size={20} title='Select A New Directory' />
          </button>
          <label htmlFor='search'>
            <input
              name='search'
              value={query}
              onChange={ev => dispatch.files.searchFiles(ev.target.value)}
              onBlur={() => dispatch.files.reshuffleTracks()}
              disabled={!ready}
              placeholder='Search by Name...'
              autoComplete='off'
              autoCorrect='off'
              spellCheck='off'
            />
            {searchIcon}
          </label>
        </section>
      </header>
      <ControlledMenu
        {...filterMenu}
        theming='dark'
        anchorRef={filterMenuTrigger}
        onMouseLeave={() => toggleMenu(false)}
        onClose={() => toggleMenu(false)}
        onItemClick={(e) => (e.keepOpen = true)}
        arrow
      >
        <MenuItem
          type='checkbox'
          checked={show.music}
          onClick={() => dispatch.files.toggleFilter('music')}
        >
          <div className='ml-2 mr-1'>{icons.MUSIC}</div>
          <span>Music</span>
        </MenuItem>
        <MenuItem
          type='checkbox'
          checked={show.photo}
          onClick={() => dispatch.files.toggleFilter('photo')}
        >
          <div className='ml-2 mr-1'>{icons.PHOTO}</div>
          <span>Photos</span>
        </MenuItem>
        <MenuItem
          type='checkbox'
          checked={show.video}
          onClick={() => dispatch.files.toggleFilter('video')}
        >
          <div className='ml-2 mr-1'>{icons.VIDEO}</div>
          <span>Videos</span>
        </MenuItem>
      </ControlledMenu>
    </Fragment>
  )
}

export default Header
