import React, { Component } from 'react';
import Home from './pages/Home.jsx'
import PickerApp from './pages/PickerApp.jsx'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import * as reducers from './reducers/index.js'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import {homeUrl} from '@/config/'
import './styles/Common.less'
import './styles/Home.less'
import './styles/status.css'

const store = createStore(
  combineReducers({
    ...reducers
  }),
  applyMiddleware(thunk)
)
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route exact path={`${homeUrl}`} component={Home} />
            <Route path={`${homeUrl}/app/:mark/:index`} component={PickerApp} />
          </div>
        </Router>
      </Provider>

    );
  }
}

export default App;