import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useRepairsContext } from "../../hooks/useRepairsContext";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { RepairActionEllipsis } from '../../components/RepairActionEllipsis'
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'

const Repairs = () => {
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
    const { repairs, dispatch: repairsDispatch } = useRepairsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const location = useLocation()
    const [showDeleteRepairModal, setShowDeleteRepairModal] = useState(false)
    const [repairToDelete, setRepairToDelete] = useState()

    const onCancel = function () {
        setShowDeleteRepairModal(false)
    }

    const deleteRepair = function (repair) {
        if (!user) {
            return
        }

        setShowDeleteRepairModal(true)
        setRepairToDelete(repair)
    }

    const onDelete = async (id) => {

        if (!user) {
            return
        }

        const response = await fetch('/api/repairs/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            repairsDispatch({ type: 'DELETE_REPAIR', payload: json })
        }

        setShowDeleteRepairModal(false)
        setRepairToDelete()

    }


    const onViewUpdate = async (repair) => {
        navigate('viewOrUpdate', { state: { repair } })
    }


    const columnDefs = [
        {
            field: 'title',
        },
        {
            field: 'asset',
        },
        {
            field: 'dueDate',
        },
        {
            field: 'priority',
        },
        {
            field: 'servicers',
        },
        {
            field: 'status',
        },
        {
            headerName: 'Actions',
            cellRenderer: RepairActionEllipsis,
            cellRendererParams: (params) => ({
                onDelete: () => onDelete(params.data._id),
                onViewUpdate: () => onViewUpdate(params.data)
            }),
        },
    ]

    const fetchRepairs = async () => {
        const response = await fetch('/api/repairs', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            repairsDispatch({ type: 'SET_REPAIRS', payload: json })
        }
    }


    useEffect(() => {
        console.log("prevRoute", prevRoute)
        if (prevRoute !== '/repairs/add' && prevRoute !== '/repairs/viewOrUpdate' || !repairs) {
            fetchRepairs()
            console.log(prevRoute, repairs)
        }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [repairsDispatch, user])

    const defaultColDef = {
        flex: 1 // or 'autoWidth'
    };



    return (
        <div className="repairs">
            <div className="repairs-header">
                <h1 className="repairs-title">Repairs</h1>
                <div className="div-empty-space"></div>
                <Link to="/repairs/add" className="new-item-nav-link"><button className="new-item-nav-btn btn-effect">+ New Repair</button></Link>
            </div>
            <div className="ag-theme-alpine repairs">
                <AgGridReact
                    rowData={repairs}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                />
            </div>
        </div>

    )
}

export default Repairs