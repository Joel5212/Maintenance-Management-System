import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useLocationsContext } from "../../hooks/useLocationsContext";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { LocationActionEllipsis } from '../../components/LocationActionEllipsis'
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'

const Locations = () => {
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
    const { locations, dispatch: locationsDispatch } = useLocationsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const location_util = useLocation()
    const [showDeleteLocationModal, setShowDeleteLocationModal] = useState(false)
    const [locationToDelete, setLocationToDelete] = useState()

    const onCancel = function () {
        setShowDeleteLocationModal(false)
    }

    const deleteLocation = function (location) {
        if (!user) {
            return
        }

        setShowDeleteLocationModal(true)
        setLocationToDelete(location)
    }

    const onDelete = async (id) => {

        if (!user) {
            return
        }

        const response = await fetch('/api/locations/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            locationsDispatch({ type: 'DELETE_LOCATION', payload: json })
        }

        setShowDeleteLocationModal(false)
        setLocationToDelete()

    }


    const onViewUpdate = async (location) => {
        navigate('viewOrUpdate', { state: { location } })
    }


    const columnDefs = [
        {
            field: 'name',
        },
        {
            field: 'description',
        },
        {
            headerName: 'Actions',
            cellRenderer: LocationActionEllipsis,
            cellRendererParams: (params) => ({
                onDelete: () => onDelete(params.data._id),
                onViewUpdate: () => onViewUpdate(params.data)
            }),
        },
    ]

    const fetchLocations = async () => {
        const response = await fetch('/api/locations', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            locationsDispatch({ type: 'SET_LOCATIONS', payload: json })
        }
    }


    useEffect(() => {
        console.log("prevRoute", prevRoute)
        if (prevRoute !== '/locations/add' && prevRoute !== '/locations/viewOrUpdate') {
            fetchLocations()
            console.log(prevRoute, locations)
        }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location_util.pathname })
    }, [locationsDispatch, user])

    const defaultColDef = {
        flex: 1 // or 'autoWidth'
    };



    return (
        <div className="locations">
            <div className="locations-header">
                <h1 className="locations-title">Locations</h1>
                <div className="div-empty-space"></div>
                <Link to="/locations/add" className="new-item-nav-link"><button className="new-item-nav-btn btn-effect">+ New Location</button></Link>
            </div>
            <div className="ag-theme-alpine locations">
                <AgGridReact
                    rowData={locations}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                />
            </div>
        </div>

    )
}

export default Locations