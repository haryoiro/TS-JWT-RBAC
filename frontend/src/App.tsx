import { useState } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import './App.scss'
import { Login } from './components/Page/Login.page';
import { Profile } from './components/Page/Profile.page';
import { SignUp } from './components/Page/SignUp.page'
import { DashBoard } from './components/Page/DashBoard.page'
import { PrivateRoute } from './components/PrivateRoute';
import { Calen } from './components/Page/Calen.page';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/signup" exact component={SignUp} />
        <Route path="/login" exact component={Login} />
        <Route path="/dashboard" exact component={DashBoard} />
        <Route path="/cal" exact component={Calen} />
        <PrivateRoute path="/profile" exact component={Profile}/>
        <Redirect from="*" to="/profile" />
      </Switch>
    </div>
  )
}

export default App
