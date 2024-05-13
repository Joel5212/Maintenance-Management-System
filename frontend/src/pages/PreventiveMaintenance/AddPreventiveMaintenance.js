import { useState } from 'react'
import { useEffect } from "react"
import Dropdown from 'react-dropdown';
import Select from 'react-select'

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { SelectAssetModal } from '../../components/SelectAssetModal';
import { usePreventiveMaintenancesContext } from "../../hooks/usePreventiveMaintenancesContext";
import { useAuthContext } from '../../hooks/useAuthContext';


import 'react-dropdown/style.css';



import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";



const validator = require('validator')

const AddPreventiveMaintenance = () => {
    const [title, setTitle] = useState('')

    const [parentAsset, setParentAsset] = useState('')
    const [parentAssetName, setParentAssetName] = useState([])
    const [showSelectAssetModal, setShowSelectAssetModal] = useState(false)

    const [description, setDescription] = useState('')

    const [servicers, setServicers] = useState('')
    const [selectedServicer, setSelectedServicer] = useState([])

    const [priority, setPriority] = useState('')

    const [startDate, setStartDate] = useState(new Date().toLocaleDateString('en-CA'));

    const [dueDate, setDueDate] = useState('')

    const [frequency, setFrequency] = useState('')
    const [frequencyType, setFrequencyType] = useState('')
    const [selectedDays, setSelectedDays] = useState([]);
    const [weekInterval, setWeekInterval] = useState([]);

    const frequencyTypes = [
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Yearly', label: 'Yearly' }
    ];
    const dayOptions = [
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' },
        { value: 'Sunday', label: 'Sunday' },
    ];
    const weekOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
    ]


    const handleRepeatabilityChange = selectedOption => {
        console.log("Repeatability selected:", selectedOption); // Debug log
        setFrequencyType(selectedOption);
        if (selectedOption.value !== 'Weekly') {
            setSelectedDays([]); // Clear days if not weekly
        }
    };




    const [status, setStatus] = useState('Incomplete')
    const [cost, setCost] = useState('')

    const priorities = ["Low", "Medium", "High"];

    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { preventiveMaintenances, dispatch: preventiveMaintenancesDispatch } = usePreventiveMaintenancesContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()


    const fetchPreventiveMaintenances = async () => {
        const response = await fetch('/api/preventiveMaintenances', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            console.log('Fetched PreventiveMaintenances', json)
            preventiveMaintenancesDispatch({ type: 'SET_LOCATIONS', payload: json })
        }
    }

    const fetchAndSetAssets = async () => {
        const response = await fetch('/api/Assets', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            const assets = []
            if (json) {
                for (const asset of json) {
                    const value = asset._id
                    const label = asset.name
                    assets.push({ label, value })

                }
                console.log("assets", assets)
                setParentAsset(assets)
            }
        }
    }

    const selectParentAsset = function () {
        setShowSelectAssetModal(true)
    }

    const goBack = function () {
        setShowSelectAssetModal(false)
    }

    const selectAsset = function (asset) {
        setParentAsset(asset)
        setParentAssetName(asset.name)
        setShowSelectAssetModal(false)
    }

    const fetchAndSetServicers = async () => {
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            const servicers = []
            if (json) {
                for (const servicer of json) {
                    const value = servicer._id
                    const label = servicer.name
                    servicers.push({ label, value })

                }
                console.log("servicers", servicers)
                setServicers(servicers)
            }
        }
    }

    useEffect(() => {
        fetchAndSetAssets()
        fetchAndSetServicers()
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })

    }, [preventiveMaintenancesDispatch, user])

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
        if (parentAssetName.length === 0) {
            emptyFields.push('asset')
        }
        if (selectedServicer.length === 0) {
            emptyFields.push('servicer');
        }

        //Check if there are empty fields
        if (emptyFields.length === 0) {

            let assetId = null;
            if (parentAsset) {
                assetId = parentAsset._id
            }
            console.log("assetId", assetId)

            let servicerId = null
            let servicerName = ''
            if (selectedServicer.length !== 0) {
                servicerId = selectedServicer.value
                servicerName = selectedServicer.label
            }

            //Send Request
            const newPreventiveMaintenance = { title: title, asset: assetId, servicers: servicerId, frequencyType: frequencyType.value, frequency: frequency.value, startDate: startDate, dueDate: dueDate, priority: priority, status: status, cost: cost, description: description }

            console.log("checkpoint 1", newPreventiveMaintenance)
            const response = await fetch('/api/preventiveMaintenances', {
                method: 'POST',
                body: JSON.stringify(newPreventiveMaintenance),
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
                fetchPreventiveMaintenances()
                preventiveMaintenancesDispatch({ type: 'ADD_LOCATION', payload: json })
                navigate(-1)
            }
        }
        else {
            error = 'Fill in all the fields'
        }
        setEmptyFields(emptyFields)
        setError(error)
    }




    function formatGroupLabel(data) {
        return (
            <div style={{ fontWeight: 'bold' }}>
                {data.label}
            </div>
        );
    }

    return (
        <div className="add-update-preventiveMaintenance-container">
            {showSelectAssetModal === false ?
                <div className='add-update-preventiveMaintenance-form-container'>
                    <Link to='/preventiveMaintenance' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
                    <form className="add-update-preventiveMaintenance-form" onSubmit={handleSubmit}>
                        <h1 className="add-update-preventiveMaintenance-title">Add Preventive Maintenance</h1>
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
                                <div className="add-parent-asset-container">
                                    <input
                                        value={parentAssetName}
                                        placeholder='Select Asset'
                                        className={`add-parent-asset-input ${emptyFields.includes('parentAsset') ? 'input-error' : ''}`}
                                        disabled={true}
                                    />
                                    <button className='add-parent-asset-btn' onClick={selectParentAsset}>
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="label-input">
                                <label>Servicers:</label>
                                <div className='dropdown'>

                                    <Select
                                        options={servicers}
                                        onChange={(selectedServicer) => setSelectedServicer(selectedServicer)}
                                        value={selectedServicer}
                                        placeholder="Select Servicer or Team"
                                        formatGroupLabel={formatGroupLabel}
                                        className=''
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='middle'>
                            <div className="label-input">
                                <label>Frequency Type:</label>
                                <Select
                                    options={frequencyTypes}
                                    onChange={handleRepeatabilityChange}
                                    value={frequencyType}
                                    placeholder='Select Frequency Type'
                                    className={emptyFields.includes('frequencyType') ? 'dropdown-error' : ''}
                                />
                            </div>

                            <div className="label-input">
                                <label>Priority:</label>
                                <Dropdown
                                    options={priorities}
                                    onChange={(selectedPriority) => setPriority(selectedPriority.value)}
                                    value={priority}
                                    placeholder='Select Priority'
                                    className={emptyFields.includes('priority') ? 'dropdown-error' : ''}
                                />
                            </div>
                            <div className='label-input'>
                                <label>Cost ($):</label>
                                <input
                                    onChange={(e) => {
                                        const cost = e.target.value;
                                        // Check if the input is a number
                                        if (!isNaN(cost)) {
                                            // If number, update the state
                                            setCost(cost);
                                        }
                                    }}
                                    value={cost}
                                    placeholder='Enter Cost'
                                    className={emptyFields.includes('cost') ? 'input-error' : 'input'}
                                />
                            </div>
                        </div>
                        <div>
                            {frequencyType.value === 'Weekly' && (
                                <div className='lower-middle'>
                                    <h2>Weekly Repeatability</h2>
                                    <div>
                                        <label>Perform every (x) amount of weeks:</label>
                                        <Select
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            options={weekOptions}
                                            onChange={(weekInterval) => setWeekInterval(weekInterval)}
                                            value={weekInterval}
                                            placeholder="Select Week Interval"
                                        />

                                        <label>Frequency:</label>
                                        <Select
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            options={dayOptions}
                                            onChange={values => setSelectedDays(values.map(v => v.value))}
                                            value={dayOptions.filter(option => selectedDays.includes(option.value))}
                                            isMulti
                                            placeholder="Select Days"
                                        />
                                    </div>
                                </div>

                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', fontFamily: 'Arial' }}>
                            <label for="description" style={{ fontFamily: 'Times New Roman' }}>Description:</label>
                            <textarea
                                id="description"
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                placeholder='Enter Description'
                                className={emptyFields.includes('description') ? 'input-error' : ''}
                                style={{ width: '100%', height: '100px', fontFamily: 'Times New Roman' }}
                            />
                        </div>
                        <div className='bottom'>
                            <button className='btn btn-effect' type='submit'>Add</button>
                            <div className="error-div">
                                {error && <div className='error'>{error}</div>}
                            </div>
                        </div>
                    </form>
                </div> : <SelectAssetModal title={"Select Parent Asset"} selectAsset={selectAsset} goBack={goBack} />}
        </div >
    )
}

export default AddPreventiveMaintenance