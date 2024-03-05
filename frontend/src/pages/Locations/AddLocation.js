import { useState } from 'react'
import { useEffect } from "react"
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useLocationsContext } from "../../hooks/useLocationsContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
const validator = require('validator')

const AddLocation = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { locations, dispatch: locationsDispatch } = useLocationsContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()


    const fetchLocations = async () => {
        const response = await fetch('/api/locations', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            console.log('Fetched Locations', json)
            locationsDispatch({ type: 'SET_LOCATIONS', payload: json })
        }
    }

    useEffect(() => {
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })

    }, [locationsDispatch, user])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            return
        }

        const emptyFields = [];
        let error = '';

        if (!name) {
            emptyFields.push('name')
        }

        //Check if there are empty fields
        if (emptyFields.length === 0) {
            //Send Request
            const newLocation = { name: name, description: description }

            console.log("checkpoint 1", newLocation)
            const response = await fetch('/api/locations', {
                method: 'POST',
                body: JSON.stringify(newLocation),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })
            console.log("checkpoint 2", response)
            const json = await response.json()

            console.log("checkpoint 3", json)
            //Check for errors from express server
            if (!response.ok) {
                error = json.error
            }

            if (response.ok) {
                fetchLocations()
                locationsDispatch({ type: 'ADD_LOCATION', payload: json })
                navigate(-1)
            }
        }
        else {
            error = 'Fill in all the fields'
        }
        setEmptyFields(emptyFields)
        setError(error)
    }

    return (
        <div className="add-update-location-container">
            <Link to='/locations' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
            <form className="add-update-location-form" onSubmit={handleSubmit}>
                <h1 className="add-update-location-title">Add Location</h1>
                <div className='top'>
                    <div className="label-input">
                        <label>Name:</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder='Enter name'
                            className={emptyFields.includes('name') ? 'input-error' : 'input'}
                        />
                    </div>
                    <div className="label-input">
                        <label>Description:</label>
                        <input
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder='Enter description'
                            className={emptyFields.includes('description') ? 'input-error' : 'input'}

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

export default AddLocation