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


    const onMarkAsComplete = async (preventive) => {
        console.log('IN MARKASCOMPLETE')
        const preventiveId = preventive._id;
        const currentDate = new Date().toLocaleDateString('en-CA');
        const updatedPreventive = { status: "Complete", completedDate: currentDate };

        // Updating the existing preventive maintenance to complete
        const response = await fetch(`/api/preventiveMaintenances/${preventiveId}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedPreventive),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.Token}`
            }
        });

        if (response.ok) {
            const json = await response.json();
            preventiveMaintenancesDispatch({ type: 'DELETE_PREVENTIVE', payload: json });

            // Calculate the next due date
            const frequencyType = preventive.frequencyType; // assuming frequency is stored directly on the preventive object
            const frequency = preventive.frequency
            console.log('MARKASCOMPLETE - FREQUENCYTYPE', frequencyType)

            //date formatting since mongoDB changes timezone
            let preventiveDueDate = new Date(preventive.dueDate);
            preventiveDueDate.setDate(preventiveDueDate.getDate() + 1);
            preventiveDueDate = preventiveDueDate.toLocaleDateString('en-CA');

            console.log('MARKASCOMPLETE - preventiveDueDate', preventiveDueDate)

            const nextDueDate = getNextDueDate(preventiveDueDate, frequencyType, frequency);
            
            console.log('MARKASCOMPLETE - nextDueDate', nextDueDate)

            // Create a new preventive maintenance entry
            const newPreventive = {
                ...preventive,
                dueDate: nextDueDate,
                status: 'Incomplete', // Reset status for the new maintenance
                completedDate: null // Clear completed date
            };

            const newResponse = await fetch('/api/preventiveMaintenances', {
                method: 'POST',
                body: JSON.stringify(newPreventive),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.Token}`
                }
            });

            if (!newResponse.ok) {
                const errorJson = await newResponse.json();
                throw new Error(errorJson.error || 'Failed to create new PREVENTIVE MAINTENANCE');
            }

            return newResponse.json();
        } else {
            const errorJson = await response.json();
            throw new Error(errorJson.error || 'Failed to complete PREVENTIVE MAINTENANCE');
        }
    };

    function getNextDueDate(currentDueDate, frequencyType, frequency) {
        console.log('GETNEXTDUEDATE - currentDueDate', currentDueDate)
        console.log('GETNEXTDUEDATE - frequency', frequencyType)
        let newDueDate = new Date(currentDueDate);
        newDueDate.setDate(newDueDate.getDate() + 1);
        console.log('GETNEXTDUEDATE - newDueDate', newDueDate)
        switch (frequencyType) {
            case 'Daily':
                newDueDate.setDate(newDueDate.getDate() + frequency);
                break;
            case 'Weekly':
                newDueDate.setDate(newDueDate.getDate() + frequency);
                break;
            case 'Monthly':
                newDueDate.setMonth(newDueDate.getMonth() + 1);
                break;
            case 'Yearly':
                newDueDate.setFullYear(newDueDate.getFullYear() + 1);
                break;
            default:
                throw new Error('Invalid frequency type');
        }
        return newDueDate.toLocaleDateString('en-CA');
    }


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
            preventiveMaintenancesDispatch({ type: 'DELETE_PREVENTIVE', payload: json })
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
            headerName: "Asset Name",
            field: 'asset',
        },
        {
            headerName: 'Assigned To',
            field: 'servicers'
        },
        {
            headerName: 'Frequency Type',
            field: 'frequencyType'
        },
        {
            headerName: 'Due Date',
            field: 'dueDate'
        },
        {
            headerName: 'Priority',
            field: 'priority'
        },
        {
            headerName: 'Status',
            field: 'status'
        },
        {
            headerName: 'Cost',
            field: 'cost'
        },


        {
            headerName: 'Actions',
            cellRenderer: PreventiveMaintenanceActionEllipsis,
            cellRendererParams: (params) => ({
                onDelete: () => onDelete(params.data._id),
                onViewUpdate: () => onViewUpdate(params.data),
                onMarkAsComplete: () => onMarkAsComplete(params.data),
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
            preventiveMaintenancesDispatch({ type: 'SET_PREVENTIVE', payload: json })
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