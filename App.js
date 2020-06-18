
import CoolRunner from './CoolRunner'
import React, { Component } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducers from './redux/reducers'


const store = createStore(reducers)

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <CoolRunner />
      </Provider>
    )
  }
}

export default App
