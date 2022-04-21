import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import immerPlugin from '@rematch/immer'

import Header from '@components/header'
import PlayerReducer from '@lib/models/player'
import FilesReducer from '@lib/models/files'

import '@styles/sweetalert'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/theme-dark.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import '@styles/globals'
import '@styles/player'
import '@styles/searchbar'

const store = init({
  models: {
    PlayerReducer,
    FilesReducer
  },

  plugins: [
    immerPlugin(),
  ]
})

function MyApp ({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
    </Provider>
  )
}

export default MyApp
