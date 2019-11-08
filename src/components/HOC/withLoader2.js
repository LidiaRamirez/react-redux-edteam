import React, {Component} from 'react'

const withLoader2 = (propValue) => (WrappedComponent) => {
  return class WithLoader extends Component {
    constructor(props) {
      super(props)
    }

    render() {
      return this.props[propValue].length === 0 
      ? <h1 className="t3">Cargando...</h1>
      : <WrappedComponent {...this.props} />
      
    }
  }
}

export default withLoader2