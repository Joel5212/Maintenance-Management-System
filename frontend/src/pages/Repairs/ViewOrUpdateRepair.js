import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useRepairsContext } from "../../hooks/useRepairsContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'

const validator = require('validator')


const ViewOrUpdateRepair = (props) => {
    const [title, setTitle] = useState('')
    const [asset, setAsset] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [priority, setPriority] = useState('')
    const [servicers, setServicers] = useState('')
    const [status, setStatus] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { repair: repairContext } = useAuthContext()


    const { repairs, dispatch: repairsDispatch } = useRepairsContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();

    const navigate = useNavigate()
    const location = useLocation()

    const { repair } = location.state

    useEffect(() => {
        setTitle(repair.title)
        setAsset(repair.title)
        setDueDate(repair.dueDate)
        setPriority(repair.priority)
        setServicers(repair.servicers)
        setStatus(repair.status)
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [])

    //Check if form is changed
    const isFormUnchanged = () => {
        return (
            title === repair.title &&
            asset === repair.asset &&
            dueDate === repair.dueDate &&
            priority === repair.priority &&
            servicers === repair.servicers &&
            status === repair.status
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!repairContext) {
            return;
        }

        const emptyFields = [];
        let error = '';

        if (!isFormUnchanged()) {
            if (!title) {
                emptyFields.push('title')
            }

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

            if (emptyFields.length === 0) {

                const newRepair = { title, asset, dueDate, priority, servicers, status }

                const _id = repair._id

                const response = await fetch('/api/repairs/' + _id, {
                    method: 'PATCH',
                    body: JSON.stringify(newRepair),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${repairContext.token}`
                    }
                })

                const json = await response.json()

                if (!response.ok) {
                    error = json.error
                }

                if (response.ok) {
                    repairsDispatch({ type: 'UPDATE_REPAIR', payload: json })
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

    const priorities = ["Low", "Medium", "High"];
    const statuses = ["Incomplete", "In-Progress", "Complete"]


    return (
        <div className="add-update-repair-container">
            <Link to='/repairs' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
            <form className="add-update-repair-form" onSubmit={handleSubmit}>
                <h1 className="add-update-repair-title">Update Repair</h1>
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
                    <button className='btn btn-effect' type='submit'>Update</button>
                    <div className="error-div">
                        {error && <div className='error'>{error}</div>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ViewOrUpdateRepair