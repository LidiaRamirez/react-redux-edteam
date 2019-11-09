import { createStore } from 'redux'

const initialStore = {
  cart: []
}

const rootReducer = (state = initialStore, action) => {
  return state
}

export default createStore(rootReducer)