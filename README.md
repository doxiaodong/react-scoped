## ReactScoped
Inspired by angular style scoped

## Usage

npm i react-scoped

```
import { ReactScoped, ViewEncapsulation } from 'react-scoped'

const styles = `
  .test {
    color: red;
  }
  .home {
    font-size: 20px;
  }
`

export default class App extends Component {
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
```

## Less

* Webpack: raw-loader!less-loader

* Component

```
import { ReactScoped, ViewEncapsulation } from 'react-scoped'
import styles from './style.less'

export default class App extends Component {
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
```

## ReactScoped

```
props: {
  styles?: string[]
  encapsulation?: ViewEncapsulation
}

defaultProps: {
  styles: [],
  encapsulation: ViewEncapsulation.Emulated
}
```

## ViewEncapsulation

* As angular ViewEncapsulation (https://angular.io/api/core/ViewEncapsulation)
