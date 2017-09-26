import React, { Component } from 'react'

import SubComponent from './SubComponent'
import { ReactScoped, ViewEncapsulation } from '../src'
import styles from './app.less'

export default class App extends Component<{}, {}> {
  render() {
    return (
      <ReactScoped encapsulation={ViewEncapsulation.Emulated} styles={[styles]}>
        <div className="test">
          <p className="home">Home</p>
          <SubComponent />
        </div>
      </ReactScoped>
    )
  }
}
