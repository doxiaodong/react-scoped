import React, { Component } from 'react'
import ShadowDOM from 'react-shadow'
import ViewEncapsulation from './ViewEncapsulation'
import styleCompiler, { CONTENT_ATTR } from './StyleCompiler'
import { getUuid } from './utils'

export interface IReactScopedProps {
  styles?: string[]
  encapsulation?: ViewEncapsulation
}

export default class ReactScoped extends Component<IReactScopedProps, {}> {

  static defaultProps = {
    styles: [],
    encapsulation: ViewEncapsulation.Emulated
  }

  state = {
    styles: '',
    currentUuid: getUuid()
  }

  componentDidMount() {
    const styles = styleCompiler.compileStyles(
      this.props.styles, this.props.encapsulation === ViewEncapsulation.Emulated,
      this.state.currentUuid
    )

    if (styles !== '') {
      this.setState({ styles })
    }

  }

  /**
   * add data-_content-x attribute on current Component html element
   * the react children Components are not included
   */
  modifyChildren = (child) => {
    // null for null/false like {false && <div />}
    if (!child) {
      return null
    }
    // child.type string for html tag: div, span, p, ...
    if (typeof child.type === 'string') {
      // child.props.children string for html content text
      if (typeof child.props.children === 'string') {
        return React.cloneElement(child, {[CONTENT_ATTR + this.state.currentUuid]: ''})
      }
      return React.cloneElement(
        child,
        {
          [CONTENT_ATTR + this.state.currentUuid]: '',
          children: React.Children.map(
            child.props.children,
            this.modifyChildren
          )
        }
      )
    }
    return React.cloneElement(child)
  }

  render() {
    const {encapsulation, children} = this.props
    const {styles} = this.state
    if (encapsulation === ViewEncapsulation.Native) {
      return (
        <ShadowDOM>
          <div>
            <style type="text/css" dangerouslySetInnerHTML={{ __html: styles }} />
            {this.props.children}
          </div>
        </ShadowDOM>
      )
    }
    return (
      <div>
        <style type="text/css" dangerouslySetInnerHTML={{ __html: styles }} />
        {React.Children.map(children, this.modifyChildren)}
      </div>
    )
  }
}
