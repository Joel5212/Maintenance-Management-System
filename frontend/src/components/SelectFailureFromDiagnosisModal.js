import React, { useState } from 'react';
import { useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import 'ag-grid-enterprise';
import { useLocation } from 'react-router-dom';
import { NoItemsAvailable } from './NoItemsAvailable'

export const SelectFailureFromDiagnosisModal = ({ selectFailure, similarFailures, goBack }) => {
    const [clickedFailure, setClickedFailure] = useState(null)
    const [error, setError] = useState('')
    const location = useLocation()

    // useEffect(() => {
    //     prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    // }, [])

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
                    {(similarFailures && similarFailures.length > 0) ?
                        similarFailures.map((similarFailure) => (
                            <div className={clickedFailure && clickedFailure._id === similarFailure._id ? 'similar-failure-container clicked' : 'similar-failure-container border'} onClick={() => clickFailure(similarFailure)}>
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