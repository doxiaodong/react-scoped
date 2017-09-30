import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ShadowDOM from './ReactShadow'
import ViewEncapsulation from './ViewEncapsulation'
import styleCompiler, { CONTENT_ATTR } from './StyleCompiler'
import { getUuid } from './utils'

export interface IReactScopedProps {
  styles?: string[]
  encapsulation?: ViewEncapsulation
}

export default class ReactScoped extends PureComponent<IReactScopedProps, {}> {
  static propTypes = {
    style: PropTypes.arrayOf(PropTypes.string),
    encapsulation: PropTypes.oneOf([
      ViewEncapsulation.Emulated,
      ViewEncapsulation.Native,
      ViewEncapsulation.None
    ])
  }
  static defaultProps = {
    styles: [],
    encapsulation: ViewEncapsulation.Emulated
  }

  state = {
    currentUuid: getUuid()
  }

  compileStyles(props) {
    const styles = styleCompiler.compileStyles(
      props.styles, props.encapsulation === ViewEncapsulation.Emulated,
      this.state.currentUuid
    )

    return styles
  }

  /**
   * add data-_content-x attribute on current Component html element
   * the react children Components are not included
   */
  modifyChildren = (child) => {
    // TODO: find a stable way to check rather than `typeof child.type` and `typeof child.props.children`

    // null for null/false like {false && <div />}
    if (!child) {
      return null
    }
    // child.type string for html tag: div, span, p, ...
    if (typeof child.type === 'string') {
      // child.props.children string for html content text
      if (typeof child.props.children === 'string') {
        return React.cloneElement(child, { [CONTENT_ATTR + this.state.currentUuid]: '' })
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
    return child
  }

  render() {
    const {encapsulation, children} = this.props
    const compiledStyles = this.compileStyles(this.props)
    const styleElement = <style type="text/css" dangerouslySetInnerHTML={{ __html: compiledStyles }} />

    if (encapsulation === ViewEncapsulation.Native) {
      return (
        <ShadowDOM>
          <div>
            {styleElement}
            {this.props.children}
          </div>
        </ShadowDOM>
      )
    }
    if (encapsulation === ViewEncapsulation.None) {
      return (
        <div>
          {styleElement}
          {this.props.children}
        </div>
      )
    }
    return (
      <div>
        {styleElement}
        {React.Children.map(children, this.modifyChildren)}
      </div>
    )
  }
}
