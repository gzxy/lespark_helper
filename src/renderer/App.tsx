import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import './App.global.scss'
import Home from './pages/Home'
import Capture from './pages/Capture'
import Login from './pages/Login'
import store from './store'
import ConfirmModal from './component/ConfirmModal'
import LiveSettingModal from "./component/LiveSettingModal";
import LiveStatisticsModal from './component/LiveStatisticsModal'
import { getUserLocale,toGetUserLocale } from '../main/bridge'

const App :React.FC = () => {
   useEffect(()=>{
     getUserLocale((locale)=>{
      console.log('getUserLocale====>', locale);
      localStorage.setItem('locale', locale)
     })
     toGetUserLocale()
   },[])
   
  return (
   <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/capture" children={<Capture />} />
          <Route path="/Login" children={<Login />} />
          <Route path="/" children={<Home />} />
        </Switch>
      </Router>
      <ConfirmModal />
      <LiveSettingModal />
      <LiveStatisticsModal />
   </Provider>
  )
}
export default App