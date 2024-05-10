import { useState } from 'react'
import { useEffect } from "react"
import 'react-dropdown/style.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../hooks/usePrevRouteContext";
import { useAuthContext } from '../hooks/useAuthContext'
import { SelectFailureFromDiagnosisModal } from './SelectFailureFromDiagnosisModal';

export const FailureDiagnosisFormModal = ({ selectFailure, categoryId, goBack }) => {
    const [failureObservation, setFailureObservation] = useState(null)
    const [error, setError] = useState('')
    const [emptyFields, setEmptyFields] = useState('')
    const [similarFailures, setSimilarFailures] = useState(null)
    const [showDiagnosisResultsModal, setShowDiagnosisResultsModal] = useState(false)
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()

    useEffect(() => {
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            return
        }

        const emptyFields = [];
        let error = '';

        if (!failureObservation) {
            emptyFields.push('failureObservation')
        }

        //Check if there are empty fields
        if (emptyFields.length === 0) {

            const response = await fetch('/api/failures/get-similar-failures/', {
                method: 'POST',
                body: JSON.stringify({ observationQuery: failureObservation, category: categoryId }),
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
                setSimilarFailures(json)
                setShowDiagnosisResultsModal(true)
            }
        }
        else {
            error = 'Fill in Observation'
        }
        setEmptyFields(emptyFields)
        setError(error)
    }

    const goBackFromDiagnosisResultsModal = function () {
        setShowDiagnosisResultsModal(false)
    }

    return (
        <div className='failure-diagnosis-form-modal-page'>
            {showDiagnosisResultsModal === false ?
                <div className="failure-diagnosis-form-modal-container">
                    <div className="failure-diagnosis-form-modal-top">
                        <button className='back-button' onClick={goBack}><ArrowBackIcon /></button>
                        <h1 className='similar-failure-modal-title'>Select Failure</h1>
                        <div className='invisible-back-button'></div>
                    </div>
                    <form className="failure-diagnosis-form" onSubmit={handleSubmit}>
                        <div className='failure-diagnosis-inputs'>
                            <div className="label-input">
                                <label>Failure Observation:</label>
                                <textarea
                                    onChange={(e) => setFailureObservation(e.target.value)}
                                    value={failureObservation}
                                    placeholder='Enter Failure Observation'
                                    className={`failure-diagnosis-observation-input ${emptyFields.includes('failureObservation') ? 'failure-diagnosis-observation-input-error' : ''}`}
                                />
                            </div>
                        </div>
                        <div className='bottom'>
                            <button className='btn btn-effect' type='submit'>Diagnose</button>
                            <div className="error-div">
                                {error && <div className='failure-form-error'>{error}</div>}
                            </div>
                        </div>
                    </form >
                </div > : <SelectFailureFromDiagnosisModal selectFailure={selectFailure} similarFailures={similarFailures} goBack={goBackFromDiagnosisResultsModal} />}
        </div>
    )
}
