import React, { useMemo, useState, useRef } from 'react';
import { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import 'ag-grid-enterprise';
import { useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { NoItemsAvailable } from '../../components/NoItemsAvailable'

export const DiagnosisResultsModal = ({ similarFailures, goBack }) => {
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
    const { user } = useAuthContext()
    const location = useLocation()

    useEffect(() => {
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [user])

    return (
        <div className='similar-failures-modal'>
            <div className='similar-failures-modal-container'>
                <div className="similar-failures-modal-top">
                    <button className='back-button' onClick={goBack}><ArrowBackIcon /></button>
                    <h1 className='similar-failure-modal-title'>Similar Failures</h1>
                    <div className='invisible-back-button'></div>
                </div>
                <div className='similar-failures-list'>
                    {(similarFailures && similarFailures.length > 0) ?
                        similarFailures.map((similarFailure) => (
                            <div className='similar-failure-container' >
                                <div className='similar-failure-title'>
                                    {similarFailure.title}
                                </div>
                                <div className='similar-failure-field-container'>
                                    <div className='similar-failure-field-title'>Failure Observation</div>
                                    <div className='similar-failure-field-description'>{similarFailure.observation}</div>
                                </div>
                                <div className='similar-failure-field-container'>
                                    <div className='similar-failure-field-title'>Failure Cause</div>
                                    <div className='similar-failure-field-description'>{similarFailure.cause}</div>
                                </div>
                                {similarFailure.procedure || (similarFailure.procedureTitle && similarFailure.procedureDescription) ?
                                    <div className='similar-failure-field-container'>
                                        <div className='similar-failure-field-title'> Procedure </div>
                                        <div className='similar-failure-field-description'>{similarFailure.procedure ? similarFailure.procedure.description : similarFailure.procedureDescription}</div>
                                        <div />
                                    </div> : ""}
                                <div />
                            </div>)) : <NoItemsAvailable itemName={"No Similar Failures"} />}
                </div>
            </div>
        </div>
    )
}