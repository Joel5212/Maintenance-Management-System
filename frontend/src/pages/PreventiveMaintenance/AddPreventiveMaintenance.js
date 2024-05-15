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

    const [dueDate, setDueDate] = useState(() => {
        const today = new Date(); // Get the current date.
        const tomorrow = new Date(today); // Create a new date object for manipulation.
        tomorrow.setDate(tomorrow.getDate() + 1); // Add one day.
        return today.toLocaleDateString('en-CA'); // Format the date as 'yyyy-mm-dd'.
    });


    const [frequencyType, setFrequencyType] = useState('')
    const [selectedDay, setSelectedDay] = useState(0);
    const [frequency, setFrequency] = useState(0);

    const frequencyTypes = [
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Yearly', label: 'Yearly' }
    ];
    const dayOptions = [
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' },
        { value: 7, label: 'Sunday' },
    ];
    const weekOptions = [
        { value: 7, label: '1' },
        { value: 14, label: '2' },
        { value: 21, label: '3' },
        { value: 28, label: '4' },
    ]

    /* Finds selected day (x) weeks away from current day
        const getNextDueDates = () => {
            if (!selectedDay) return null; // Ensure there's a selected day, otherwise return null
    
            const today = new Date();
            const currentDayOfWeek = today.getDay(); // Sunday is 0, Saturday is 6
    
            // Adjust day number from 1-7 (Mon-Sun) to 0-6 (Sun-Sat), since JavaScript's getDay uses 0 for Sunday
            const targetDayOfWeek = (selectedDay % 7) || 7;
            let daysUntil = (targetDayOfWeek) - currentDayOfWeek; // Convert 1-7 to 0-6 for comparison
    
            // Calculate the next due date based on frequency
            const nextDueDate = new Date(today);
            nextDueDate.setDate(today.getDate() + daysUntil + (frequency - 7));
    
            // Return the next due date formatted to 'YYYY-MM-DD'
            return nextDueDate.toLocaleDateString('en-CA');
        };
    */

    const getNextDueDate = () => {
        if (!selectedDay) return null; // Ensure there's a selected day, otherwise return null

        const today = new Date();
        const currentDayOfWeek = today.getDay(); // Sunday is 0, Saturday is 6

        // Adjust day number from 1-7 (Mon-Sun) to 0-6 (Sun-Sat), since JavaScript's getDay uses 0 for Sunday
        const targetDayOfWeek = (selectedDay % 7);
        let daysUntil = (targetDayOfWeek) - currentDayOfWeek; // Convert 1-7 to 0-6 for comparison
        if (daysUntil < 0) {
            daysUntil += 7
        }
        // Calculate the next due date based on frequency
        const nextDueDate = new Date(today);
        let dayDifference = today.getDate() + daysUntil
        
        nextDueDate.setDate(dayDifference);

        // Return the next due date formatted to 'YYYY-MM-DD'
        return nextDueDate.toLocaleDateString('en-CA');
    };



    const handleRepeatabilityChange = selectedOption => {
        console.log("Repeatability selected:", selectedOption)
        setFrequencyType(selectedOption)

        if (selectedOption.value !== 'Weekly') {
            setSelectedDay(0); // Clear days if not weekly
        }


        if (selectedOption.value === 'Daily') {
            setFrequency(1)
            console.log(frequency)
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
        // Update the dueDate state
        if (selectedDay && frequency) {
            const nextDueDates = getNextDueDate();
            console.log('nextDueDates', nextDueDates)
            setDueDate(nextDueDates);
            console.log('dueDate', dueDate)
        }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })

    }, [selectedDay, frequency, preventiveMaintenancesDispatch, user])

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
        if (!frequencyType) {
            emptyFields.push('frequency type')
        }
        if (frequencyType.value === 'Weekly' && ((selectedDay.length === 0) || !frequency)) {
            emptyFields.push('frequency details')
        }


        console.log("SELECTED DAYS:", selectedDay)

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
            /* calculating dueDate doesn't work here?? done in useEffect()
            if (selectedDays.length > 0 && frequency) {
            const nextDueDates = getNextDueDates();
            console.log('nextDueDates', nextDueDates)
            setDueDate(nextDueDates);
            console.log('dueDate', dueDate)
            }
            */

            /*
            const freq = frequency.value
            console.log("freq", freq)
            console.log("freqType", freq.type)
            if (frequencyType === 'Daily') {
                setFrequency(1)
                console.log(frequency)
            }
            if (frequencyType === 'Weekly') {
                setFrequency(frequency.value)
            }*/

            //send request
            const newPreventiveMaintenance = { title: title, asset: assetId, servicers: servicerId, frequencyType: frequencyType.value, frequency: frequency, startDate: startDate, dueDate: dueDate, priority: priority, status: status, cost: cost, description: description }



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
                preventiveMaintenancesDispatch({ type: 'ADD_PREVENTIVE', payload: json })
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

    //STOPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
    const handleFrequencyChange = selectedOption => {
        setFrequency(selectedOption.value); // Save only the numerical value
    };


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
                                            onChange={handleFrequencyChange}
                                            value={weekOptions.find(option => option.value === frequency)} // Display the selected value
                                            placeholder="Select Week Interval"
                                        />


                                        <label>Frequency:</label>
                                        <Select
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            options={dayOptions}
                                            onChange={option => setSelectedDay(option.value)} // Save only the numerical value of the day
                                            value={dayOptions.find(option => option.value === selectedDay)} // Display the selected day
                                            placeholder="Select Days"
                                        />

                                        {/*
                                        <Select
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            options={dayOptions}
                                            onChange={values => setSelectedDays(values.map(v => v.value))}
                                            value={dayOptions.filter(option => selectedDays.includes(option.value))}
                                            isMulti
                                            placeholder="Select Days"
                            />*/}

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