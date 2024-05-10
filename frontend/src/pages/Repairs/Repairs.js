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
        const currentDate = new Date().toISOString(); // Get current date in ISO format
        const updatedRepair = { status: "Complete", completedDate: currentDate };

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
            // window.location.reload();
            repairsDispatch({ type: 'DELETE_REPAIR', payload: json })

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
            completedRepairsDispatch({ type: 'DELETE_REPAIR', payload: json })
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
            headerName: "Asset Name",
            field: 'asset.name',
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
            headerName: 'Asset Failed?',
            valueGetter: function (params) {
                const isFailure = params.data.isFailure ? "Yes" : "No"
                return isFailure
            },
        },
        {
            headerName: 'Assigned To',
            valueGetter: function (params) {
                const assignedUser = params.data.assignedUser
                const assignedTeam = params.data.assignedTeam
                if (assignedUser) {
                    return assignedUser.name
                }

                if (assignedTeam) {
                    return assignedTeam.name
                }
                return null
            },
        },
        {
            field: 'status',
        },
        {
            headerName: 'Cost',
            valueGetter: function (params) {
                const cost = params.data.cost
                if (cost) {
                    return `$${cost}`
                }
            },
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
            headerName: "Asset Name",
            field: 'asset.name',
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
            headerName: 'Assigned To',
            valueGetter: function (params) {
                const assignedUser = params.data.assignedUser
                const assignedTeam = params.data.assignedTeam
                if (assignedUser) {
                    return assignedUser.name
                }

                if (assignedTeam) {
                    return assignedTeam.name
                }
                return null
            },
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
        console.log(json)

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
            fetchCompletedRepairs()
        }
    }




    return (
        <div className="repairs">
            <div className="repairs-header">

                {/* <div className='failures-header'>
            <Link to='/categories' className='failures-back-btn-link'><button className='failures-back-btn'><ArrowBackIcon /></button></Link>
            <h1 className='failures-title'>Failures of Category {category ? category.name : ''}</h1>
            <div className="div-empty-space"></div>
            <button className="failures-add-btn btn-effect" onClick={goToAddFailure}>+ Add Failure</button>
            </div> */}

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