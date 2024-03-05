import { useState } from 'react'
import { useEffect } from "react"
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useRepairsContext } from "../../hooks/useRepairsContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
const validator = require('validator')

const AddRepair = () => {
    const [title, setTitle] = useState('')
    const [asset, setAsset] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [priority, setPriority] = useState('')
    const [servicers, setServicers] = useState('')
    const [status, setStatus] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { repairs, dispatch: repairsDispatch } = useRepairsContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()


    const fetchRepairs = async () => {
        const response = await fetch('/api/repairs', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            console.log('Fetched Repairs', json)
            repairsDispatch({ type: 'SET_REPAIRS', payload: json })
        }
    }

    useEffect(() => {
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })

    }, [repairsDispatch, user])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            return
        }

        const emptyFields = [];
        let error = '';

        if (!title) {
            emptyFields.push('title')
        }

        /*
        if (!asset) {
            emptyFields.push('asset')
        }

        if (!dueDate) {
            emptyFields.push('dueDate')
        }

        if (!priority) {
            emptyFields.push('priority')
        }

        if (!servicers) {
            emptyFields.push('servicers')
        }
        
        if (!status) {
            emptyFields.push('status')
        }
        */
        //Check if there are empty fields
        if (emptyFields.length === 0) {
            //Send Request
            const newRepair = { title: title, asset: asset, dueDate: dueDate, priority: priority, servicers: servicers, status: status }

            console.log("checkpoint 1", newRepair)
            const response = await fetch('/api/repairs', {
                method: 'POST',
                body: JSON.stringify(newRepair),
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
                fetchRepairs()
                repairsDispatch({ type: 'ADD_REPAIR', payload: json })
                navigate(-1)
            }
        }
        else {
            error = 'Fill in all the fields'
        }
        setEmptyFields(emptyFields)
        setError(error)
    }

    const priorities = ["Low", "Medium", "High"];
    const statuses = ["Incomplete", "In-Progress", "Complete"]

    return (
        <div className="add-update-repair-container">
            <Link to='/repairs' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
            <form className="add-update-repair-form" onSubmit={handleSubmit}>
                <h1 className="add-update-repair-title">Add Repair</h1>
                <div className='top'>
                    <div className="label-input">
                        <label>Title:</label>
                        <input
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            placeholder='Enter title'
                            className={emptyFields.includes('title') ? 'input-error' : 'input'}
                        />
                    </div>
                    <div className="label-input">
                        <label>Asset:</label>
                        <input
                            onChange={(e) => setAsset(e.target.value)}
                            value={asset}
                            placeholder='Enter asset'
                            className={emptyFields.includes('asset') ? 'input-error' : 'input'}

                        />
                    </div>
                    <div className="label-input">
                        <label>Priority:</label>
                        <Dropdown
                            options={priorities}
                            onChange={(selectedPriority) => setPriority(selectedPriority.value)}
                            value={priority}
                            placeholder='Select a Priority'
                            className={emptyFields.includes('priority') ? 'dropdown-error' : ''}
                        />
                    </div>
                </div>
                <div className='middle'>
                    <div className='label-input'>
                        <label>Due Date:</label>
                        <input
                            onChange={(e) => setDueDate(e.target.value)}
                            value={dueDate}
                            placeholder='Enter Due Date'
                            className={emptyFields.includes('dueDate') ? 'input-error' : 'input'}
                        />
                    </div>
                    <div className="label-input">
                        <label>Servicers:</label>
                        <input
                            onChange={(e) => setServicers(e.target.value)}
                            value={servicers}
                            placeholder='Enter Servicers'
                            className={emptyFields.includes('servicers') ? 'input-error' : 'input'}

                        />
                    </div>
                    <div className='label-input'>
                        <label>Status:</label>
                        <Dropdown
                            options={statuses}
                            onChange={(selectedStatus) => setStatus(selectedStatus.value)}
                            value={status}
                            placeholder='Select a Status'
                            className={emptyFields.includes('status') ? 'dropdown-error' : ''}
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

export default AddRepair