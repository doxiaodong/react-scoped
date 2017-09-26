import 'react-hot-loader/patch'
import { AppContainer } from 'react-hot-loader'
import React from 'react'
import { render } from 'react-dom'
import App from './App'

const hotRender = (Component) =>
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  )

hotRender(App)
if (module['hot']) {
  module['hot'].accept('./App', () => {
    const { default: NewApp } = require('./App')
    hotRender(NewApp)
  })
}
