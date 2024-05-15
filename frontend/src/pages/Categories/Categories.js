import React from 'react';
import { useEffect } from 'react';
import { useCategoriesContext } from "../../hooks/useCategoriesContext";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CategoryActionEllipsis } from '../../components/CategoryActionEllipsis'
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'

const Categories = () => {
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
    const { categories, dispatch: categoriesDispatch } = useCategoriesContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const location = useLocation()

    const goToFailuresOfCategory = async (category) => {

        if (!user) {
            return
        }

        navigate('failures', { state: { category } })
    }


    const goToRepairProceduresOfCategory = async (category) => {

        if (!user) {
            return
        }

        navigate('procedures', { state: { category: category, procedureType: "repair" } })
    }

    const goToPreventiveMaintenanceProceduresOfCategory = async (category) => {

        if (!user) {
            return
        }

        navigate('procedures', { state: { category: category, procedureType: "preventiveMaintenance" } })
    }

    const onDelete = async (id) => {

        if (!user) {
            return
        }

        const response = await fetch('/api/categories/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            categoriesDispatch({ type: 'DELETE_CATEGORY', payload: json })
        }

    }

    const onViewUpdate = async (category) => {
        navigate('viewOrUpdate', { state: { category } })
    }

    const columnDefs = [
        {
            headerName: 'Category Name',
            field: 'name',
        },
        {
            headerName: 'Actions',
            cellRenderer: CategoryActionEllipsis,
            cellRendererParams: (params) => ({
                onDelete: () => onDelete(params.data._id),
                onViewUpdate: () => onViewUpdate(params.data),
                goToRepairProceduresOfCategory: () => goToRepairProceduresOfCategory(params.data),
                goToPreventiveMaintenanceProceduresOfCategory: () => goToPreventiveMaintenanceProceduresOfCategory(params.data),
                goToFailuresOfCategory: () => goToFailuresOfCategory(params.data)
            }),
        },
    ]

    const fetchCategories = async () => {
        const response = await fetch('/api/categories', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            categoriesDispatch({ type: 'SET_CATEGORIES', payload: json })
        }
    }


    useEffect(() => {
        if ((user && prevRoute !== '/categories/add' && prevRoute !== '/categories/viewOrUpdate' && prevRoute !== '/categories/procedures' && prevRoute !== '/categories/failures') || (user && !categories)) {
            fetchCategories()
            console.log(prevRoute, categories)
        }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [categoriesDispatch, user])

    const defaultColDef = {
        flex: 1 // or 'autoWidth'
    };

    return (
        <div className="categories">
            <div className="categories-header">
                <h1 className="categories-title">Categories</h1>
                <div className="div-empty-space"></div>
                <Link to="/categories/add" className="new-item-nav-link"><button className="new-item-nav-btn btn-effect">+ New Category</button></Link>
            </div>
            <div className="ag-theme-alpine users">
                <AgGridReact
                    rowData={categories}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                />
            </div>
        </div>

    )
}

export default Categories

