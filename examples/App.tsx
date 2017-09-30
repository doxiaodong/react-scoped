import React, { Component } from 'react'

import SubComponent from './SubComponent'
import { ReactScoped, ViewEncapsulation } from '../src'
import styles from './app.less'

export default class App extends Component<{}, {}> {
  state = {
    showSub: true
  }

  componentDidMount() {
    // Test whether remove .global-test style after SubComponent is removed
    // Change SubComponent ViewEncapsulation.None
    // setTimeout(() => {
    //   this.setState({
    //     showSub: false
    //   })
    // }, 2000)
  }

  render() {
    return (
      <ReactScoped encapsulation={ViewEncapsulation.Emulated} styles={[styles]}>
        <div className="test">
          <p className="home global-test">Home</p>
          {this.state.showSub && <SubComponent />}
        </div>
      </ReactScoped>
    )
  }
}
