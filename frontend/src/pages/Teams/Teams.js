import React from 'react';
import { useEffect } from 'react';
import { useTeamsContext } from "../../hooks/useTeamsContext";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { UserActionEllipsis } from '../../components/UserActionEllipsis'
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'


const Teams = () => {
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
    const { teams, dispatch: teamsDispatch } = useTeamsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        console.log(prevRoute)
        if (user && ((prevRoute !== '/teams/add' && prevRoute !== '/teams/viewOrUpdate') || !teams)) {
            fetchTeams()
        }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [teamsDispatch, user])

    const onDelete = async (id) => {

        if (!user) {
            return
        }

        const response = await fetch('/api/teams/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            teamsDispatch({ type: 'DELETE_TEAM', payload: json })
        }

    }

    const onViewUpdate = async (team) => {
        console.log("TEAM", team)
        navigate('viewOrUpdate', { state: { team } })
    }

    const fetchTeams = async () => {
        console.log(teams)
        const response = await fetch('/api/teams', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            console.log("SET TEAMS", json)
            teamsDispatch({ type: 'SET_TEAMS', payload: json })
        }
    }


    const columnDefs = [
        {
            headerName: 'Team Name',
            field: 'name',
        },
        {
            headerName: 'Users',
            field: 'users',
            valueGetter: function (params) {
                let userNames = []
                const users = params.data.users
                for (const user of users) {
                    userNames.push(user.name)
                }
                return userNames.join(', ')
            },
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
    const defaultColDef = {
        flex: 1 // or 'autoWidth'
    };

    return (
        <div className="teams">
            <div className="teams-header">
                <h1 className="teams-title">Teams</h1>
                <div className="div-empty-space"></div>
                <Link to="/teams/add" className="new-item-nav-link"><button className="new-item-nav-btn btn-effect">+ New Team</button></Link>
            </div>
            <div className="ag-theme-alpine teams">
                <AgGridReact
                    rowData={teams}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                />
            </div>
        </div>

    )
}

export default Teams