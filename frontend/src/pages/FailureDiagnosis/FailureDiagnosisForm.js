import { useState } from 'react'
import { useEffect } from "react"
import 'react-dropdown/style.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import Select from 'react-dropdown-select';
import { DiagnosisResultsModal } from './DiagnosisResultsModal';

const FailureDiagnosisForm = () => {
    const [selectedCategory, setSelectedCategory] = useState([])
    const [categories, setCategories] = useState([])
    const [failureObservation, setFailureObservation] = useState('')
    const [error, setError] = useState('')
    const [emptyFields, setEmptyFields] = useState('')
    const [similarFailures, setSimilarFailures] = useState(null)
    const [showDiagnosisResultsModal, setShowDiagnosisResultsModal] = useState(false)
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()

    useEffect(() => {
        fetchAndSetCategories()
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

        let categoryId = null
        let categoryName = null

        if (selectedCategory.length !== 0) {
            categoryId = selectedCategory[0].value
            categoryName = selectedCategory[0].label
        }
        else {
            emptyFields.push('category')
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
            error = 'Fill in all the fields'
        }
        setEmptyFields(emptyFields)
        setError(error)
    }

    const fetchAndSetCategories = async () => {
        const response = await fetch('/api/categories', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        console.log(json)
        if (response.ok) {
            const categories = []
            if (json) {
                for (const category of json) {
                    const value = category._id
                    const label = category.name
                    categories.push({ label, value })

                }
                console.log("categories", categories)
                setCategories(categories)
            }
        }
    }

    const goBack = function () {
        setShowDiagnosisResultsModal(false)
    }

    return (
        showDiagnosisResultsModal === false ?
            <div className="failure-diagnosis-container">
                <div className='failure-diagnosis-title'>
                    <h1 className="add-update-failure-title">Diagnose Failure</h1>
                </div>
                <form className="failure-diagnosis-form" onSubmit={handleSubmit}>
                    <div className='failure-diagnosis-inputs'>
                        <div className="label-input">
                            <label>Category:</label>
                            <div className={emptyFields.includes('category') ? 'dropdown-error failure-diagnosis-category-dropdown' : 'dropdown failure-diagnosis-category-dropdown'}>
                                <Select
                                    options={categories}
                                    values={selectedCategory}
                                    onChange={(category) => setSelectedCategory(category)}
                                />
                            </div>
                        </div>
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
                        <button className='btn btn-effect' type='submit'>Diagnose Failure</button>
                        <div className="error-div">
                            {error && <div className='failure-form-error'>{error}</div>}
                        </div>
                    </div>
                </form >
            </div > : <DiagnosisResultsModal similarFailures={similarFailures} goBack={goBack} />
    )
}

export default FailureDiagnosisForm
