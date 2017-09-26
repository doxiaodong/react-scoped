import React, { Component } from 'react'

import { ReactScoped, ViewEncapsulation } from '../../src'
import styles from './style.less'

export default class SubComponent extends Component<{}, {}> {

  state = {
    text: 'Sub'
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        text: 'Timeout Sub'
      })
    }, 2000)
  }

  render() {
    return (
      <ReactScoped encapsulation={ViewEncapsulation.Emulated} styles={[styles]}>
        <p className="sub">{this.state.text}</p>
      </ReactScoped>
    )
  }
}
