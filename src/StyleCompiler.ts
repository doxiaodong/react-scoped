import { ShadowCss } from './css/ShadowCss'

// TODO: Know when attribute is add by HOST_ATTR and fix it
export const HOST_ATTR = 'data-_host-'
export const CONTENT_ATTR = 'data-_content-'

export class StyleCompiler {

  private shadowCss: ShadowCss = new ShadowCss()
  compileStyles(styles, shim: boolean, uuid: number) {
    if (!styles) {
      return ''
    }
    const stylesString = styles.join('')
    if (!shim) {
      return stylesString
    }
    return this.shadowCss.shimCssText(stylesString, CONTENT_ATTR + uuid, HOST_ATTR + uuid)
  }
}

export default new StyleCompiler()
