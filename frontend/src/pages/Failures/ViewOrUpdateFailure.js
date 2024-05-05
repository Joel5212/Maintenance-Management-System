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

const ViewOrUpdateFailure = () => {
    const [failureTitle, setFailureTitle] = useState('')
    const [failureObservation, setFailureObservation] = useState('')
    const [failureCause, setFailureCause] = useState('')
    const [procedureTitle, setProcedureTitle] = useState('')
    const [procedureDescription, setProcedureDescription] = useState('')
    const [selectedProcedure, setSelectedProcedure] = useState('')
    const [showSelectProcedureModal, setShowSelectProcedureModal] = useState(false)
    const [error, setError] = useState('')
    const [emptyFields, setEmptyFields] = useState([])
    const { failures, dispatch: failuresDispatch } = useFailuresContext()
    const { categories, dispatch: categoriesDispatch } = useCategoriesContext();
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()
    const { category, failure } = location.state

    useEffect(() => {
        setFailureTitle(failure.title)
        setFailureObservation(failure.observation)
        setFailureCause(failure.cause)
        if (failure.procedure) {
            fetchRepairProcedure()
        }
        else {
            setProcedureTitle(failure.procedureTitle)
            setProcedureDescription(failure.procedureDescription)
        }
        if ((user && prevRoute !== '/categories/failures') || (user && (!categories || !failures))) {
            fetchCategories()
            fetchFailuresOfCategory()
        }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [categoriesDispatch, user])

    const isFormUnchanged = () => {
        let isFormUnchanged = null
        if (selectedProcedure) {
            isFormUnchanged = failure.title === failureTitle &&
                failure.observation === failureObservation &&
                failure.cause === failureCause &&
                failure.procedure === selectedProcedure._id
        }
        else {
            isFormUnchanged = failure.title === failureTitle &&
                failure.observation === failureObservation &&
                failure.cause === failureCause &&
                failure.procedureTitle === procedureTitle &&
                failure.procedureDescription === procedureDescription
        }

        return isFormUnchanged
    }

    const goBackToFailures = async () => {
        console.log(category._id)
        navigate('/categories/failures', { state: { category: category } })
    }

    const fetchRepairProcedure = async () => {
        const response = await fetch('/api/repair-procedures/get-repair-procedure/' + failure.procedure, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()
        console.log("Repair Procedure", json)

        if (response.ok) {
            setSelectedProcedure(json)
            setProcedureTitle(json.title)
            setProcedureDescription(json.description)
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

    const enableSelectProcedureModel = function () {
        setShowSelectProcedureModal(true)
    }

    const selectProcedure = function (procedure) {
        setSelectedProcedure(procedure)
        setProcedureTitle(procedure.title)
        setProcedureDescription(procedure.description)
        setShowSelectProcedureModal(false)
    }

    const removeSelectedProcedure = function () {
        setProcedureTitle('')
        setProcedureDescription('')
        setSelectedProcedure(null)
    }

    const goBack = function () {
        setShowSelectProcedureModal(false)
    }

    const handleSubmit = async (e) => {
        const emptyFields = [];
        let error = '';

        e.preventDefault()

        if (!user) {
            return
        }

        if (!isFormUnchanged()) {

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

            if (emptyFields.length === 0) {
                console.log(failure._id)
                const selectedProcedureId = selectedProcedure ? selectedProcedure._id : null
                const response = await fetch('/api/failures/' + failure._id, {
                    method: 'PATCH',
                    body: JSON.stringify({ title: failureTitle, observation: failureObservation, cause: failureCause, procedure: selectedProcedureId, procedureTitle: procedureTitle, procedureDescription: procedureDescription, category: category._id }),
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
                    failuresDispatch({ type: 'UPDATE_FAILURE', payload: json })
                    navigate('/categories/failures', { state: { category: category } })
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
        showSelectProcedureModal === false ?
            <div className="add-update-failure-container">
                <div className='add-update-failure-top'>
                    <button className="add-update-failure-back-btn" onClick={goBackToFailures}><ArrowBackIcon /></button>
                    <h1 className="add-update-failure-title">{"Update Failure for Category " + category.name}</h1>
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
                                    placeholder='Enter Procedure Title'
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
                        <button className='btn btn-effect' type='submit'>Update</button>
                        <div className="error-div">
                            {error && <div className='failure-form-error'>{error}</div>}
                        </div>
                    </div>
                </form>
            </div> : <SelectProcedureModal selectProcedure={selectProcedure} categoryId={category._id} goBack={goBack} />
    )
}

export default ViewOrUpdateFailure
