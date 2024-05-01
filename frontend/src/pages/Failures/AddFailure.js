import { useState } from 'react'
import { useEffect } from "react"
import 'react-dropdown/style.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCategoriesContext } from "../../hooks/useCategoriesContext";
import { useFailuresContext } from "../../hooks/useFailuresContext";
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { SelectProcedureModal } from '../../components/SelectProcedureModal'
const validator = require('validator')

const AddFailure = () => {
    const [failureTitle, setFailureTitle] = useState('')
    const [failureObservation, setFailureObservation] = useState('')
    const [failureCause, setFailureCause] = useState('')
    const [procedureTitle, setProcedureTitle] = useState('')
    const [procedureDescription, setProcedureDescription] = useState('')
    const [selectedProcedure, setSelectedProcedure] = useState(null)
    const [showSelectProcedureModal, setShowSelectProcedureModal] = useState(false)
    const [error, setError] = useState('')
    const [emptyFields, setEmptyFields] = useState('')
    const { failures, dispatch: failuresDispatch } = useFailuresContext();
    const { categories, dispatch: categoriesDispatch } = useCategoriesContext();
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();

    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()
    const { category } = location.state

    const goBackToProcedures = async () => {
        navigate('/categories/failures', { state: { category: category } })
    }

    const enableSelectProcedureModel = function () {
        setShowSelectProcedureModal(true)
    }

    const selectProcedure = function (procedure) {
        setSelectedProcedure(procedure)
        setProcedureTitle(procedure.title)
        setProcedureDescription(procedure.description)
        setShowSelectProcedureModal(false)
    }

    const removeSelectedProcedure = function (procedure) {
        setProcedureTitle('')
        setProcedureDescription('')
        setSelectedProcedure(null)
    }

    const goBack = function () {
        setShowSelectProcedureModal(false)
    }

    useEffect(() => {
        if ((user && prevRoute !== '/categories/procedures') || (user && (!categories || !failures))) {
            fetchCategories()
            fetchFailuresOfCategory()
        }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [failuresDispatch, user])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            return
        }

        const emptyFields = [];
        let error = '';

        if (!failureTitle) {
            emptyFields.push('failureTitle')
        }

        if (!failureObservation) {
            emptyFields.push('failureObservation')
        }

        if (!failureCause) {
            emptyFields.push('failureCause')
        }

        if (procedureTitle || procedureDescription) {
            if (!procedureTitle) {
                emptyFields.push('procedureTitle')
            }

            if (!procedureDescription) {
                emptyFields.push('procedureDescription')
            }
        }

        //Check if there are empty fields
        if (emptyFields.length === 0) {

            let failure = null

            if (selectedProcedure) {
                failure = { title: failureTitle, observation: failureObservation, cause: failureCause, procedure: selectedProcedure._id, procedureTitle: null, procedureDescription: null, category: category._id }
            }
            else {
                failure = { title: failureTitle, observation: failureObservation, cause: failureCause, procedure: null, procedureTitle: procedureTitle, procedureDescription: procedureDescription, category: category._id }
            }

            const response = await fetch('/api/failures/', {
                method: 'POST',
                body: JSON.stringify(failure),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const json = await response.json()

            //Check for errors from express server
            if (!response.ok) {
                error = json.error
            }

            if (response.ok) {
                console.log(json)
                failuresDispatch({ type: 'ADD_FAILURE', payload: json })
                navigate('/categories/failures', { state: { category: category } })
            }
        }
        else {
            error = 'Fill in all the fields'
        }
        setEmptyFields(emptyFields)
        setError(error)
    }

    const fetchFailuresOfCategory = async () => {
        const response = await fetch('/api/failures/' + category._id, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            failuresDispatch({ type: 'SET_FAILURES', payload: json })
        }
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

    return (
        showSelectProcedureModal === false ?
            <div className="add-update-failure-container">
                <div className='add-update-failure-top'>
                    <button className="add-update-failure-back-btn" onClick={goBackToProcedures}><ArrowBackIcon /></button>
                    <h1 className="add-update-failure-title">Add Failure for Category {category ? category.name : ''}</h1>
                    <div className="add-update-failure-back-btn-invisible"></div>
                </div>
                <form className="add-update-failure-form" onSubmit={handleSubmit}>
                    <div className='category-inputs'>
                        <div className="label-input">
                            <label>Failure Title:</label>
                            <input
                                onChange={(e) => setFailureTitle(e.target.value)}
                                value={failureTitle}
                                placeholder='Enter Failure Title'
                                className={`add-update-failure-title-input ${emptyFields.includes('failureTitle') ? 'add-update-failure-input-error' : ''}`}
                            />
                        </div>
                        <div className="label-input">
                            <label>Failure Observation:</label>
                            <textarea
                                onChange={(e) => setFailureObservation(e.target.value)}
                                value={failureObservation}
                                placeholder='Enter Failure Observation'
                                className={`add-update-failure-description-input ${emptyFields.includes('failureObservation') ? 'add-update-failure-input-error' : ''}`}
                            />
                        </div>
                        <div className="label-input">
                            <label>Failure Cause:</label>
                            <textarea
                                onChange={(e) => setFailureCause(e.target.value)}
                                value={failureCause}
                                placeholder='Enter Failure Cause'
                                className={`add-update-failure-description-input ${emptyFields.includes('failureCause') ? 'add-update-failure-input-error' : ''}`}
                            />
                        </div>
                        <div className='procedure-failure-row-inputs'>
                            <div className="procedure-failure-row-input">
                                <label>Procedure Title:</label>
                                <input
                                    onChange={(e) => setProcedureTitle(e.target.value)}
                                    value={procedureTitle}
                                    placeholder='Enter Failure Title'
                                    className={`add-update-failure-procedure-title-input ${emptyFields.includes('procedureTitle') ? 'add-update-failure-input-error' : ''}`}
                                    disabled={!selectedProcedure ? false : true}
                                />
                            </div>
                            {!selectedProcedure ? <div className='select-procedure-btn' onClick={enableSelectProcedureModel}>+ Save Procedure</div> :
                                <div className='select-procedure-btn' onClick={removeSelectedProcedure}>- Remove Procedure</div>}
                        </div>
                        <div className="label-input">
                            <label>Procedure:</label>
                            <textarea
                                onChange={(e) => setProcedureDescription(e.target.value)}
                                value={procedureDescription}
                                placeholder='Enter Procedure'
                                className={`add-update-failure-description-input  ${emptyFields.includes('procedureDescription') ? 'add-update-failure-input-error' : ''}`}
                                disabled={!selectedProcedure ? false : true}
                            />
                        </div>
                    </div>
                    <div className='bottom'>
                        <button className='btn btn-effect' type='submit'>Add</button>
                        <div className="error-div">
                            {error && <div className='failure-form-error'>{error}</div>}
                        </div>
                    </div>
                </form>
            </div> : <SelectProcedureModal selectProcedure={selectProcedure} categoryId={category._id} goBack={goBack} />
    )
}

export default AddFailure
