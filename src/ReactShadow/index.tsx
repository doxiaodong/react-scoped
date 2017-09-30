import React, { PureComponent, Children } from 'react'
import { render, findDOMNode } from 'react-dom'

export default class ReactShadow extends PureComponent<{
}, {}> {
  state = {
    shadowRoot: null
  }

  // TODO: reduce the <div />
  componentDidMount() {
    const root = findDOMNode(this).attachShadow({ mode: 'open', delegatesFocus: false })
    const shadowRoot = root.appendChild(document.createElement('div'))
    render(Children.only(this.props.children), shadowRoot)
    this.setState({ shadowRoot })
  }

  componentDidUpdate() {
    render(Children.only(this.props.children), this.state.shadowRoot)
  }

  render() {
    return <div />
  }
}
