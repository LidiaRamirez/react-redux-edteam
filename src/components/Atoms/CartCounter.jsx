import React from 'react'
import { connect } from 'react-redux'

const CartCounter = ({ carLength }) => (
  <li>
    <button className="button tiny ghost">{`Carrito: ${carLength.length}`}</button>
  </li>
)

const mapStateToProps = state => ({
  carLength : state.cart
})

const maptDispatchToProps = () => {

}

export default connect(mapStateToProps, maptDispatchToProps)(CartCounter)