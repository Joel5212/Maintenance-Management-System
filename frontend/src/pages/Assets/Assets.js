//Joel 


import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";

const Assets = () => {

  const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
  const location = useLocation()

  useEffect(() => {
    prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
  }, [])

  return (
    <div className="assets">
      <h1>Assets</h1>
      <h2>helloooo</h2>
    </div>
  )
}

export default Assets