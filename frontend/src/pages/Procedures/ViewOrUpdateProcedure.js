import { useState } from 'react'
import { useEffect } from "react"
import 'react-dropdown/style.css';
import { useCategoriesContext } from "../../hooks/useCategoriesContext";
import { useProceduresContext } from "../../hooks/useProceduresContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'

const ViewOrUpdateProcedure = () => {
    const [procedureTitle, setProcedureTitle] = useState('')
    const [procedureDescription, setProcedureDescription] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { categories, dispatch: categoriesDispatch } = useCategoriesContext()
    const { procedures, dispatch: proceduresDispatch } = useProceduresContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()
    const { category, procedure, procedureType } = location.state

    useEffect(() => {
        setProcedureTitle(procedure.title)
        setProcedureDescription(procedure.description)
        if ((user && prevRoute !== '/categories/procedures') || (user && (!categories || !procedures))) {
            fetchCategories()
            fetchProceduresOfCategory()
        }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [categoriesDispatch, user])

    const isFormUnchanged = () => {
        return (
            procedure.title === procedureTitle && procedure.description === procedureDescription
        )
    }

    const goBackToProcedures = async () => {
        navigate('/categories/procedures', { state: { categoryId: category._id, procedureType } })
    }

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

    const fetchProceduresOfCategory = async () => {
        const response = await fetch(procedureType === "repair" ? '/api/repairProcedures/' + category._id : '/api/preventiveMaintenanceProcedures/' + category._id, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            proceduresDispatch({ type: 'SET_PROCEDURES', payload: json })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            return
        }

        const emptyFields = [];
        let error = '';

        if (!procedureTitle) {
            emptyFields.push('procedureTitle')
        }

        if (!procedureDescription) {
            emptyFields.push('procedureDescription')
        }

        if (!isFormUnchanged()) {
            if (emptyFields.length === 0) {

                const response = await fetch(procedureType === "repair" ? '/api/repairProcedures/' + procedure._id :
                    '/api/preventiveMaintenanceProcedures/' + procedure._id, {
                    method: 'PATCH',
                    body: JSON.stringify(procedureType === "repair" ? { category: category._id, title: procedureTitle, description: procedureDescription } :
                        { category: category._id, title: procedureTitle, description: procedureDescription }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                })

                const json = await response.json()

                if (!response.ok) {
                    error = json.error
                }

                if (response.ok) {
                    proceduresDispatch({ type: 'UPDATE_PROCEDURE', payload: json })
                    navigate('/categories/procedures', { state: { category: category, procedureType } })
                }
            }
            else {
                error = 'Fill in all the fields'
            }
        }
        else {
            error = 'Form is unchanged'
        }

        setEmptyFields(emptyFields)
        setError(error)
    }

    return (
        <div className="add-update-procedure-container">
            <div className='add-update-procedure-top'>
                <button className="add-update-procedure-back-btn" onClick={goBackToProcedures}><ArrowBackIcon /></button>
                <div className="add-update-procedure-back-btn-invisible"></div>
            </div>
            <h1 className="add-update-procedure-title">{procedureType === "repair" ?
                "Update Repair Procedure for Category " + category.name :
                "Update Preventive Maintenance Procedure for Category " + category.name}</h1>
            <form className="add-update-procedure-form" onSubmit={handleSubmit}>
                <div className='category-inputs'>
                    <div className="label-input">
                        <label>Procedure Title:</label>
                        <input
                            onChange={(e) => setProcedureTitle(e.target.value)}
                            value={procedureTitle}
                            placeholder='Enter Procedure Name'
                            className={emptyFields.includes('procedureTitle') ? 'add-update-procedure-title-input-error' : 'add-update-procedure-title-input'}
                        />
                    </div>
                    <div className="label-input">
                        <label>Procedure Description:</label>
                        <textarea
                            onChange={(e) => setProcedureDescription(e.target.value)}
                            value={procedureDescription}
                            placeholder='Enter Procedure'
                            className={emptyFields.includes('procedureDescription') ? 'add-update-procedure-description-input-error' : 'add-update-procedure-description-input'}
                        />
                    </div>
                </div>
                <div className='bottom'>
                    <button className='btn btn-effect' type='submit'>Update</button>
                    <div className="error-div">
                        {error && <div className='error'>{error}</div>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ViewOrUpdateProcedure
