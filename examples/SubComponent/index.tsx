import React, { Component } from 'react'

import { ReactScoped, ViewEncapsulation } from '../../src'
import styles from './style.less'

export default class SubComponent extends Component<{}, {}> {

  state = {
    text: 'Sub',
    showMore: false
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        text: 'Timeout Sub',
        showMore: true
      })
    }, 2000)
  }

  render() {
    return (
      <ReactScoped encapsulation={ViewEncapsulation.Emulated} styles={[styles]}>
        <div>
          <p className="sub">{this.state.text}</p>
          {this.state.showMore && <p>more</p>}
        </div>
      </ReactScoped>
    )
  }
}
