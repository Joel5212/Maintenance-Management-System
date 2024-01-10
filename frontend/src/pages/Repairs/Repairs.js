//Martin


import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";


const Repairs = () => {
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
    const location = useLocation()

    useEffect(() => {
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [])

    return (
        <header>
            <div className="">
                <h1>Repairs</h1>
            </div>
        </header>
    )
}

export default Repairs