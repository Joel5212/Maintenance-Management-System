import { useState } from 'react'
import { useEffect } from "react"
import 'react-dropdown/style.css';
import { useCategoriesContext } from "../../hooks/useCategoriesContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
const validator = require('validator')

const AddProcedure = () => {
    const [procedureTitle, setProcedureTitle] = useState('')
    const [procedureDescription, setProcedureDescription] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { categories, dispatch: categoriesDispatch } = useCategoriesContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()
    const { category, procedureType } = location.state

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

    useEffect(() => {
        if ((user && prevRoute !== '/categories/procedures') || (user && !categories)) {
            fetchCategories()
        }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [categoriesDispatch, user])

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

        //Check if there are empty fields
        if (emptyFields.length === 0) {

            const apiPath = procedureType === "repair" ? '/api/categories/addRepairProcedure/' + category._id :
                '/api/categories/addPreventiveMaintenanceProcedure/' + category._id

            const response = await fetch(apiPath, {
                method: 'PATCH',
                body: JSON.stringify(procedureType === "repair" ? { repairProcedureTitle: procedureTitle, repairProcedureDescription: procedureDescription } :
                    { preventiveMaintenanceProcedureTitle: procedureTitle, preventiveMaintenanceProcedureDescription: procedureDescription }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const json = await response.json()

            console.log(json)

            //Check for errors from express server
            if (!response.ok) {
                error = json.error
            }

            if (response.ok) {
                categoriesDispatch({ type: 'UPDATE_CATEGORY', payload: json })
                navigate('/categories/procedures', { state: { categoryId: json._id, procedureType } })
            }
        }
        else {
            error = 'Fill in all the fields'
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
            <h1 className="add-update-procedure-title">{procedureType === "repair" ? "Add Repair Procedure for Category " + category.categoryName : "Add Preventive Maintenance Procedure for Category " + category.categoryName}</h1>
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
                    <button className='btn btn-effect' type='submit'>Add</button>
                    <div className="error-div">
                        {error && <div className='error'>{error}</div>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddProcedure
