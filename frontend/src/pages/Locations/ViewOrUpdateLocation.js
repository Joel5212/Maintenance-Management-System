import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useLocationsContext } from "../../hooks/useLocationsContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { UsersContext } from '../../context/UsersContext';

const validator = require('validator')


const ViewOrUpdateLocation = (props) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { user } = useAuthContext()
    const { location: locationContext } = useAuthContext()


    const { locations, dispatch: locationsDispatch } = useLocationsContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();

    const navigate = useNavigate()
    const location_util = useLocation()

    const { location } = location_util.state

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
        setName(location.name)
        setDescription(location.description)
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location_util.pathname })
    }, [locationsDispatch, user])

    //Check if form is changed
    const isFormUnchanged = () => {
        return (
            name === location.name &&
            description === location.description
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            return;
        }

        const emptyFields = [];
        let error = '';

        if (!isFormUnchanged()) {
            if (!name) {
                emptyFields.push('name')
            }

            if (!description) {
                emptyFields.push('description')
            }

            if (emptyFields.length === 0) {

                const newLocation = { name, description }

                const _id = location._id
                console.log('check 1', newLocation)
                const response = await fetch('/api/locations/' + _id, {
                    method: 'PATCH',
                    body: JSON.stringify(newLocation),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                })

                const json = await response.json()
                console.log('check 2', json)
                if (!response.ok) {
                    error = json.error
                }

                if (response.ok) {
                    fetchLocations()
                    locationsDispatch({ type: 'UPDATE_LOCATION', payload: json })
                    navigate(-1)
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

    const goBack = () => {
        navigate(-1)
    }

    
    return (
        <div className="add-update-location-container">
            <Link to='/locations' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
            <form className="add-update-location-form" onSubmit={handleSubmit}>
                <h1 className="add-update-location-name">Update Location</h1>
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
                    <button className='btn btn-effect' type='submit'>Update</button>
                    <div className="error-div">
                        {error && <div className='error'>{error}</div>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ViewOrUpdateLocation