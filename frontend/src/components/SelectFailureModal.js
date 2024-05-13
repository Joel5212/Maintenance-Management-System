import React, { useMemo, useState, useRef } from 'react';
import { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import 'ag-grid-enterprise';
import { useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../hooks/usePrevRouteContext";
import { useAuthContext } from '../hooks/useAuthContext'
import { NoItemsAvailable } from './NoItemsAvailable'

export const SelectFailureModal = ({ selectFailure, categoryId, goBack }) => {
    const [failures, setFailures] = useState([])
    const [clickedFailure, setClickedFailure] = useState(null)
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
    const gridApiRef = useRef(null);
    const { user } = useAuthContext()
    const location = useLocation()
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchFailures()
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [user])

    const fetchFailures = async () => {
        const response = await fetch('/api/failures/' + categoryId, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        console.log(json)
        setFailures(json)
    }

    const clickFailure = (failure) => {
        setClickedFailure(failure)
    }

    const handleSubmit = () => {
        if (clickedFailure) {
            selectFailure(clickedFailure)
        }
        else {
            setError("Select Repair Procedure")
        }
    }

    return (
        <div className='similar-failures-modal'>
            <div className='similar-failures-modal-container'>
                <div className="similar-failures-modal-top">
                    <button className='back-button' onClick={goBack}><ArrowBackIcon /></button>
                    <h1 className='similar-failure-modal-title'>Select Failure</h1>
                    <div className='invisible-back-button'></div>
                </div>
                <div className='similar-failures-list'>
                    {(failures && failures.length > 0) ?
                        failures.map((failure) => (
                            <div className={clickedFailure && clickedFailure._id === failure._id ? 'similar-failure-container clicked' : 'similar-failure-container border'} onClick={() => clickFailure(failure)}>
                                <div className='similar-failure-title'>
                                    {failure.title}
                                </div>
                                <div className='similar-failure-field-container'>
                                    <div className='similar-failure-field-title'>Failure Observation</div>
                                    <div className='similar-failure-field-description'>{failure.observation}</div>
                                </div>
                                <div className='similar-failure-field-container'>
                                    <div className='similar-failure-field-title'>Failure Cause</div>
                                    <div className='similar-failure-field-description'>{failure.cause}</div>
                                </div>
                                {failure.procedure || (failure.procedureTitle && failure.procedureDescription) ?
                                    <div className='similar-failure-field-container'>
                                        <div className='similar-failure-field-title'> Procedure </div>
                                        <div className='similar-failure-field-description'>{failure.procedure ? failure.procedure.description : failure.procedureDescription}</div>
                                        <div />
                                    </div> : ""}
                                <div />
                            </div>)) : <NoItemsAvailable itemName={"No Failures"} />}
                </div>
                <div className='bottom'>
                    <button className='btn btn-effect select-asset-save-btn' onClick={handleSubmit}>Save</button>
                    <div className="error-div">
                        {error && <div className='error'>{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}