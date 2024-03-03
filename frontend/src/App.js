import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Registration from './pages/Registration/Registration'
import { useAuthContext } from './hooks/useAuthContext';
import { useOrgRegisterContext } from "./hooks/useOrgRegisterContext";
import { useEffect, useState } from 'react';

function App() {

  const { user } = useAuthContext()
  const { isRegistered, dispatch } = useOrgRegisterContext()


  const checkIfOrganizationIsRegistered = async () => {
    const response = await fetch('/api/organization/', {
    })

    const json = await response.json()

    if (response.ok) {
      if (json === true) {
        dispatch({ type: 'REGISTERED' })
      }
      else {
        dispatch({ type: 'UNREGISTERED' })
      }
    }
  }

  useEffect(() => {
    checkIfOrganizationIsRegistered()
    console.log("hello")
    // prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
  }, [isRegistered])

  return (
    //if user is null show the login screen
    <div className="app">
      {isRegistered ?
        (user ? <Home /> : <Login />)
        : <Registration />}
      {console.log(isRegistered)}
    </div>
  );
}
export default App;

