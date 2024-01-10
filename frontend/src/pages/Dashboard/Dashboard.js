//Joel

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";

const Dashboard = () => {

  const location = useLocation()
  const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()

  useEffect(() => {
    prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
  }, [])

  return (
    <div className="">
      <h1>Dashboard</h1>
    </div>
  )
}

export default Dashboard