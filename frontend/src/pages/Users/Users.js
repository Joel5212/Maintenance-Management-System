import React from 'react';
import { useEffect } from 'react';
import { useUsersContext } from "../../hooks/useUsersContext";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { UserActionEllipsis } from '../../components/UserActionEllipsis'
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'

const Users = () => {
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
    const { users, dispatch: usersDispatch } = useUsersContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const location = useLocation()

    const onDelete = async (id) => {

        if (!user) {
            return
        }

        const response = await fetch('/api/users/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            usersDispatch({ type: 'DELETE_USER', payload: json })
        }

    }

    const onViewUpdate = async (user) => {
        navigate('viewOrUpdate', { state: { user } })
    }

    const columnDefs = [
        {
            field: 'name',
        },
        {
            field: 'role',
        },
        {
            headerName: 'Actions',
            cellRenderer: UserActionEllipsis,
            cellRendererParams: (params) => ({
                onDelete: () => onDelete(params.data._id),
                onViewUpdate: () => onViewUpdate(params.data)
            }),
        },
    ]

    const fetchUsers = async () => {
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            usersDispatch({ type: 'SET_USERS', payload: json })
        }
    }


    useEffect(() => {
        if (user && (prevRoute !== '/users/add' && prevRoute !== '/users/viewOrUpdate' || !users)) {
            fetchUsers()
            console.log(prevRoute, users)
        }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [usersDispatch, user])

    const defaultColDef = {
        flex: 1 // or 'autoWidth'
    };

    return (
        <div className="users">
            <div className="users-header">
                <h1 className="users-title">Users</h1>
                <div className="div-empty-space"></div>
                <Link to="/users/add" className="new-item-nav-link"><button className="new-item-nav-btn btn-effect">+ New User</button></Link>
            </div>
            <div className="ag-theme-alpine users">
                <AgGridReact
                    rowData={users}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                />
            </div>
        </div>

    )
}

export default Users