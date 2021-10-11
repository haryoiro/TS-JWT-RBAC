import { useState } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import './App.css'
import { LoginForm } from './components/Page/Login.component';
import { Profile } from './components/Page/profile.page';
import { RegisterForm } from './components/Page/Register.component'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/profile" exact component={Profile}/>
        <Route path="/register" exact component={RegisterForm} />
        <Route path="/login" exact component={LoginForm} />
        <Redirect to="/" />
      </Switch>
    </div>
  )
}

export default App
