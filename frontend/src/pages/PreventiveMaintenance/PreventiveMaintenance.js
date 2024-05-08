import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { usePreventiveMaintenancesContext } from "../../hooks/usePreventiveMaintenancesContext";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { PreventiveMaintenanceActionEllipsis } from '../../components/PreventiveMaintenanceActionEllipsis'
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'

const PreventiveMaintenance = () => {
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
    const { preventiveMaintenances, dispatch: preventiveMaintenancesDispatch } = usePreventiveMaintenancesContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const location_util = useLocation()
    const [showDeletePreventiveMaintenanceModal, setShowDeletePreventiveMaintenanceModal] = useState(false)
    const [preventiveMaintenanceToDelete, setPreventiveMaintenanceToDelete] = useState()

    const onCancel = function () {
        setShowDeletePreventiveMaintenanceModal(false)
    }

    const deletePreventiveMaintenance = function (preventiveMaintenance) {
        if (!user) {
            return
        }

        setShowDeletePreventiveMaintenanceModal(true)
        setPreventiveMaintenanceToDelete(preventiveMaintenance)
    }

    const onDelete = async (id) => {

        if (!user) {
            return
        }

        const response = await fetch('/api/preventiveMaintenances/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            preventiveMaintenancesDispatch({ type: 'DELETE_LOCATION', payload: json })
        }

        setShowDeletePreventiveMaintenanceModal(false)
        setPreventiveMaintenanceToDelete()

    }


    const onViewUpdate = async (preventiveMaintenance) => {
        navigate('viewOrUpdate', { state: { preventiveMaintenance } })
    }


    const columnDefs = [
        {
            field: 'title',
        },
        {
            headerName: 'Actions',
            cellRenderer: PreventiveMaintenanceActionEllipsis,
            cellRendererParams: (params) => ({
                onDelete: () => onDelete(params.data._id),
                onViewUpdate: () => onViewUpdate(params.data)
            }),
        },
    ]

    const fetchPreventiveMaintenances = async () => {
        const response = await fetch('/api/preventiveMaintenances', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            preventiveMaintenancesDispatch({ type: 'SET_LOCATIONS', payload: json })
        }
    }


    useEffect(() => {
        console.log("prevRoute", prevRoute)
        if (prevRoute !== '/preventiveMaintenances/add' && prevRoute !== '/preventiveMaintenances/viewOrUpdate' || !preventiveMaintenances) {
            fetchPreventiveMaintenances()
            console.log(prevRoute, preventiveMaintenances)
        }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location_util.pathname })
    }, [preventiveMaintenancesDispatch, user])

    const defaultColDef = {
        flex: 1 // or 'autoWidth'
    };



    return (
        <div className="preventiveMaintenances">
            <div className="preventiveMaintenances-header">
                <h1 className="preventiveMaintenances-title">Preventive Maintenance</h1>
                <div className="div-empty-space"></div>
                <Link to="/preventiveMaintenance/add" className="new-item-nav-link"><button className="new-item-nav-btn btn-effect">+ New PreventiveMaintenance</button></Link>
            </div>
            <div className="ag-theme-alpine preventiveMaintenances">
                <AgGridReact
                    rowData={preventiveMaintenances}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                />
            </div>
        </div>

    )
}

export default PreventiveMaintenance