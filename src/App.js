import React from 'react';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import {Routes,Route, Navigate} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
    <Routes>
    <Route path='/' element={<ProtectedRoutes><HomePage/></ProtectedRoutes>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/login' element={<Login/>}/>



    </Routes> 
    
      
    </>
  );
}
//protected routes
export function ProtectedRoutes(props){
  if(localStorage.getItem("user")){//if there was a user then it will return props.childen and if there was not then it would navigate it to login page

    return props.children
  }else{
    return <Navigate to="/login"/>;
  }
}

export default App;
