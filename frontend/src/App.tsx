import { useState } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import './App.css'
import { Login } from './components/Page/Login.page';
import { Profile } from './components/Page/Profile.page';
import { Register } from './components/Page/Register.page'
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <PrivateRoute path="/profile" exact component={Profile}/>
        <Redirect from="*" to="/profile" />
      </Switch>
    </div>
  )
}

export default App
