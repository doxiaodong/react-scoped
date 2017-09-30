import React, { Component } from 'react'

import { ReactScoped, ViewEncapsulation } from '../../src'
import styles from './style.less'

export default class SubComponent extends Component<{}, {}> {

  timeout = null

  state = {
    text: 'Sub',
    showMore: false
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({
        text: 'Timeout Sub',
        showMore: true
      })
    }, 5000)
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  render() {
    return (
      <ReactScoped encapsulation={ViewEncapsulation.Native} styles={[styles]}>
        <p className="sub global-test">{this.state.text}</p>
        {this.state.showMore && <p>more</p>}
      </ReactScoped>
    )
  }
}
