import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useRepairsContext } from "../../hooks/useRepairsContext";
import { useCompletedRepairsContext } from "../../hooks/useCompletedRepairsContext";
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
    const { completedRepairs, dispatch: completedRepairsDispatch } = useCompletedRepairsContext([])
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const location = useLocation()
    const [showDeleteRepairModal, setShowDeleteRepairModal] = useState(false)
    const [repairToDelete, setRepairToDelete] = useState()
    const [incompleteClicked, setIncompleteClicked] = useState(true)
    const [completedClicked, setCompletedClicked] = useState(false)
    

    const onMarkAsComplete = async (repair) => {
        const repairId = repair._id;
        const updatedRepair = { status: "Complete" };
    
        const response = await fetch(`/api/repairs/${repairId}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedRepair),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.Token}`
            }
        });
    
        if (response.ok) {
            const json = await response.json();
            // Reload the page after successful completion
            window.location.reload();
            return json;
        } else {
            const json = await response.json();
            throw new Error(json.error || 'Failed to complete repair');
        }
    };

    const onMarkAsComplete1 = async (id) => {
        console.log("completing repair: ", id)
        const updatedRepair = { status: "Complete" };
    
        const response = await fetch('/api/repairs/' + id, {
            method: 'PATCH',
            body: JSON.stringify(updatedRepair),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.Token}`
            }
        });
    
        if (response.ok) {
            const json = await response.json();
            // Reload the page after successful completion
            window.location.reload();
            return json;
        } else {
            const json = await response.json();
            throw new Error(json.error || 'Failed to complete repair');
        }
    };
    
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
            field: 'startDate',
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
            field: 'cost',
        },
        {
            headerName: 'Actions',
            cellRenderer: RepairActionEllipsis,
            cellRendererParams: (params) => ({
                onDelete: () => onDelete(params.data._id),
                onViewUpdate: () => onViewUpdate(params.data),
                onMarkAsComplete: () => onMarkAsComplete(params.data),
            }),
        },
    ]

    const columnDefsForCompletedRepairs = [
        {
            field: 'title',
        },
        {
            field: 'asset',
        },
        {
            field: 'startDate',
        },
        {
            field: 'dueDate',
        },
        {
            field: 'completedDate',
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
            field: 'cost',
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

    const fetchCompletedRepairs = async () => {
        const response = await fetch('/api/repairs/completed', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        console.log("Completed Repairs: ", json)

        if (response.ok) {
            completedRepairsDispatch({ type: 'SET_COMPLETED_REPAIRS', payload: json })
        }
    }

    const incompleteClick = () => {
        if (!incompleteClicked) {
            setIncompleteClicked(true)
            setCompletedClicked(false)
        }
    }

    const completeClick = async () => {
        if (!completedClicked) {
            setIncompleteClicked(false)
            setCompletedClicked(true)
            if (!completedRepairs) {
                fetchCompletedRepairs()
            }
        }
    }




    return (
        <div className="repairs">
            <div className="repairs-header">
                <h1 className="repairs-title">Repairs</h1>
                <div className="div-empty-space"></div>
                <Link to="/repairs/add" className="new-item-nav-link"><button className="new-item-nav-btn btn-effect">+ New Repair</button></Link>
            </div>
            <hr className='repairs-hr-divider'></hr>
            <div className="complete-incomplete-select-bar">
                <div className={incompleteClicked ? 'incomplete-clicked' : 'incomplete'} onClick={incompleteClick}>Incomplete/Overdue</div>
                <div className={completedClicked ? 'complete-clicked' : 'complete'} onClick={completeClick}>Complete</div>
            </div> 
            <div className="ag-theme-alpine repairs">
            <AgGridReact
                    rowData={incompleteClicked ? repairs : completedRepairs}
                    columnDefs={incompleteClicked ? columnDefs : columnDefsForCompletedRepairs}
                    defaultColDef={defaultColDef}
                />
            </div>
        </div>

    )
}

export default Repairs