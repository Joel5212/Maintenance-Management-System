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

export const SelectProcedureModal = ({ selectProcedure, categoryId, goBack }) => {
    const [repairProcedures, setRepairProcedures] = useState()
    const [clickedRepairProcedure, setClickedRepairProcedure] = useState(null)
    const [repairProcedureClicked, setRepairProcedureClicked] = useState(false)
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
    const gridApiRef = useRef(null);
    const { user } = useAuthContext()
    const location = useLocation()
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchRepairProceduresOfCategory()
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [user])

    const fetchRepairProceduresOfCategory = async () => {
        const response = await fetch('/api/repair-procedures/' + categoryId, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        console.log(json)
        setRepairProcedures(json)
    }

    const clickRepairProcedure = (repairProcedure) => {
        setClickedRepairProcedure(repairProcedure)
        setRepairProcedureClicked(true)
    }

    const handleSubmit = () => {
        if (clickedRepairProcedure) {
            selectProcedure(clickedRepairProcedure)
        }
        else {
            setError("Select Repair Procedure")
        }
    }

    return (
        <div className='select-procedure-modal'>
            <div className='select-procedure-modal-container'>
                <div className="select-procedure-modal-top">
                    <button className='back-button' onClick={goBack}><ArrowBackIcon /></button>
                    <h1>Select Repair Procedure</h1>
                    <div className='invisible-back-button'></div>
                </div>
                <div className='procedures-list'>
                    {(repairProcedures && repairProcedures.length > 0) ?
                        repairProcedures.map((repairProcedure) => (
                            <div className={clickedRepairProcedure && clickedRepairProcedure._id === repairProcedure._id ? 'procedure-container clicked' : 'procedure-container border'} key={repairProcedure._id} onClick={() => clickRepairProcedure(repairProcedure)}>
                                <div className="procedure-top">
                                    <div className='procedure-title'>
                                        {repairProcedure.title}
                                    </div>
                                </div>
                                <div className='procedure-description'>
                                    {repairProcedure.description}
                                </div>
                            </div>
                        )) : <NoItemsAvailable itemName={"Procedures"} />}
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