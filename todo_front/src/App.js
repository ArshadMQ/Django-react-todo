import Main_Component from "./components/Main_Component"
import SignUp from "./components/signup"
import SignIn from "./components/signIn"
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import React, {useContext, useState} from 'react';
import todoContext from "./context/todoContext"
import Alert from "./components/Alert";

function App() {
  const {getCookie, alert} = useContext(todoContext)
  const access_token = getCookie('access_token')

  return (
    <>
      <div className=""><Header /></div>
      <Alert alert={alert} />
      <Routes>
        <Route exact path="/" element={access_token? <Main_Component />:<SignIn/>} />
        <Route exact path="/about" element={<Main_Component />} />
        <Route exact path="/signin"  element={<SignIn/>} />
        <Route exact path="/signup" element={<SignUp/>} />
      </Routes>
    </>
  );
}

export default App;
