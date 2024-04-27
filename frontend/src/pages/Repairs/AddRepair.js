import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Dropdown from 'react-dropdown';
import Select from 'react-dropdown-select';
import 'react-dropdown/style.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useRepairsContext } from "../../hooks/useRepairsContext";

import { SelectAssetModal } from '../../components/SelectAssetModal'


const AddRepair = () => {
    const [title, setTitle] = useState('')


    const [parentAsset, setParentAsset] = useState('')
    const [parentAssetName, setParentAssetName] = useState([])
    const [showSelectAssetModal, setShowSelectAssetModal] = useState(false)

    const [assets, setAssets] = useState('')
    const [selectedAsset, setSelectedAsset] = useState([])

    const [servicers, setServicers] = useState('')
    const [selectedServicer, setSelectedServicer] = useState([])
    const [teams, setTeams] = useState('')
    const [selectedTeam, setSelectedTeam] = useState([])

    const [selectedOption, setSelectedOption] = useState(null);

    const [startDate, setStartDate] = useState(null)
    const [dueDate, setDueDate] = useState('')
    const [priority, setPriority] = useState('')

    const [status, setStatus] = useState('Incomplete')
    const [cost, setCost] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { dispatch: repairsDispatch } = useRepairsContext()
    const { dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()

    const [isFailureCheckboxChecked, setIsCheckboxChecked] = useState('');
    const [failureTitle, setFailureTitle] = useState('')
    const [failureObservation, setFailureObservation] = useState('')
    const [failureCause, setFailureCause] = useState()

    const [procedureTitle, setProcedureTitle] = useState('')
    const [procedureDescription, setProcedureDescription] = useState('')

    
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
        fetchAndSetServicers()
        fetchAndSetTeams()
        fetchAndSetAssets()
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })

    }, [repairsDispatch, user])

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
                setAssets(assets)
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
    const fetchAndSetTeams = async () => {
        const response = await fetch('/api/teams', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            const teams = []
            if (json) {
                for (const team of json) {
                    const value = team._id
                    const label = team.name
                    teams.push({ label, value })

                }
                console.log("teams", teams)
                setTeams(teams)
            }
        }
    }

    const options = [
        { label: 'Servicers', options: servicers },
        { label: 'Teams', options: teams }
    ];

    function formatGroupLabel(data) {
        return (
            <div style={{ fontWeight: 'bold' }}>
                {data.label}
            </div>
        );
    }




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

        //Check if there are empty fields
        if (emptyFields.length === 0) {

            let assetId = null
            let assetName = ''

            let parentAssetId = null;

            if (parentAsset) {
                parentAssetId = parentAsset._id
            }

            console.log("ParentAssetId", parentAsset)



            if (selectedAsset.length !== 0) {
                assetId = selectedAsset[0].value
                assetName = selectedAsset[0].label
            }

            let servicerId = null
            let servicerName = ''
            let teamId = null
            let teamName = ''

            if (selectedServicer.length !== 0) {
                servicerId = selectedServicer[0].value
                servicerName = selectedServicer[0].label
            }
            if (selectedTeam.length !== 0) {
                teamId = selectedTeam[0].value
                teamName = selectedTeam[0].label
            }
            //Send Request
            const newRepair = { title: title, asset: parentAssetId, startDate: startDate, dueDate: dueDate, priority: priority, servicers: servicerId, status: status, cost: cost, description: description }


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
                console.log("ASSET NAME", assetName)
                repairsDispatch({ type: 'ADD_REPAIR', payload: json, assetName: assetName, servicerName: servicerName })
                navigate(-1)
            }
        }
        else {
            error = 'Fill in all the fields'
        }
        setEmptyFields(emptyFields)
        setError(error)
    }

    const priorities = ["low", "medium", "high"];
    const statuses = ["Incomplete", "Overdue", "Complete"]

    const handleFailureCheckbox = (checked) => {
        setIsCheckboxChecked(checked);
    };

    const handleSaveProcedureCheckbox = () => {
        console.log("Save procedure checkbox changed")
    }

    const handleSelectProcedure = () => {
        // Logic to select a procedure
        console.log("Select a procedure checked")
    };

    const handleSelectFailure = () => {
        // Logic to select a procedure
        console.log("Select a failure pressed")
    };

    const handleSelectFailureDiagnostic = () => {
        // Logic to select a procedure
        console.log("Select failure diagnostic pressed")
    };


    return (
        <div className="add-update-repair-container">
            {showSelectAssetModal === false ?
                <div className="add-update-repair-form-container">
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
                                <label>Parent Asset:</label>
                                <div className="add-parent-asset-container">
                                    <input
                                        value={parentAssetName}
                                        placeholder='Select Parent Asset'
                                        className='add-parent-asset-input'
                                        disabled={true}
                                    />
                                    <button className='add-parent-asset-btn' onClick={selectParentAsset}>
                                        +
                                    </button>
                                </div>
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
                        </div>
                        <div className='middle'>
                            {/* DEFAULT TO CREATE DATE: repairsController.js (new Date())
                    <div className='label-input'>
                        <label>Start Date:</label>
                        <input
                            type="date"
                            onChange={(e) => setStartDate(e.target.value)}
                            value={startDate}
                            placeholder='Enter Start Date'
                            className={emptyFields.includes('startDate') ? 'input-error' : 'input'}
                        />
                    </div>
                        */}
                            <div className="label-input">

                                <label>Asset:</label>
                                <div className='dropdown'>
                                    <Select
                                        options={assets}
                                        value={selectedAsset}
                                        onChange={(asset) => setSelectedAsset(asset)}

                                    />
                                </div>
                            </div>
                            <div className='label-input'>
                                <label>Due Date:</label>
                                <input
                                    type="date"
                                    onChange={(e) => setDueDate(e.target.value)}
                                    value={dueDate}
                                    placeholder='Enter Due Date'
                                    className={emptyFields.includes('dueDate') ? 'input-error' : 'input'}
                                />
                            </div>
                            <div className="label-input">
                                <label>Servicers:</label>
                                <div className='dropdown'>
                                    {/* COMBINING SERVICERS AND TEAMS
                                    <Select
                                        options={options}
                                        value={selectedOption}
                                        onChange={option => setSelectedOption(option)}
                                        placeholder="Select Servicer or Team"
                                        formatGroupLabel={formatGroupLabel}
                                    />
                                    <Select
                                        options={teams}
                                        value={selectedTeam}
                                        onChange={option => setSelectedTeam(teams)}
                                        placeholder="Select Servicer or Team"
                                        formatGroupLabel={formatGroupLabel}
                                    />
                                    */}
                                    <Select
                                        options={servicers}
                                        onChange={(selectedServicer) => setSelectedServicer(selectedServicer)}
                                        value={selectedServicer}
                                        placeholder="Select Servicer or Team"
                                        formatGroupLabel={formatGroupLabel}
                                    />
                                </div>
                            </div>
                            <div className='label-input'>
                                <label>Status:</label>
                                <Dropdown
                                    options={statuses}
                                    onChange={(selectedStatus) => setStatus(selectedStatus.value)}
                                    value={status}
                                    placeholder={'Select status'}
                                    className={emptyFields.includes('status') ? 'dropdown-error' : ''} />
                            </div>
                        </div>
                        <div className='description'>
                            <label>Description:</label>
                            <textarea
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                placeholder='Enter Description'
                                className={emptyFields.includes('description') ? 'input-error' : 'input'}
                                style={{ width: '100%', height: '200px' }} />
                        </div>
                        <div className="failure-checkbox" style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                onChange={(e) => handleFailureCheckbox(e.target.checked)} />
                            <label style={{ marginLeft: '5px' }}>Did this asset fail?</label>
                        </div>

                        {isFailureCheckboxChecked && (
                            <div>
                                {/* The elements you want to show when the checkbox is checked */}
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <button
                                        className="procedure-button"
                                        type="button"
                                        onClick={handleSelectFailure}>
                                        + Select a Failure
                                    </button>
                                    <p>or</p>
                                    <button
                                        className="procedure-button"
                                        type="button"
                                        onClick={handleSelectFailureDiagnostic}>
                                        + Select a Failure using Diagnostics
                                    </button>
                                </div>

                                <div className="label-input">
                                    <label style={{ marginTop: '20px' }}>Failure Title:</label>
                                    <input
                                        onChange={(e) => setFailureTitle(e.target.value)}
                                        value={failureTitle}
                                        placeholder='Enter failure title'
                                    />
                                    <label style={{ marginTop: '10px' }}>Failure Observation:</label>
                                    <textarea
                                        onChange={(e) => setFailureObservation(e.target.value)}
                                        value={failureObservation}
                                        placeholder='Enter Failure Observations'
                                        style={{ width: '100%', height: '80px' }}
                                    />
                                    <label style={{ marginTop: '10px' }}>Failure Cause:</label>
                                    <textarea
                                        onChange={(e) => setFailureCause(e.target.value)}
                                        value={failureCause}
                                        placeholder='Enter Failure Cause'
                                        style={{ width: '100%', height: '80px' }}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                className="procedure-button"
                                type="button"
                                onClick={handleSelectProcedure}>
                                + Select a Procedure
                            </button>
                        </div>


                        <div className='procedure-details' style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                            <div className="label-input">
                                <label>Procedure Title:</label>
                                <input
                                    onChange={(e) => setProcedureTitle(e.target.value)}
                                    value={procedureTitle}
                                    placeholder='Enter procedure title'
                                />
                            </div>

                            <div className='description'>
                                <label>Procedure Description:</label>
                                <textarea
                                    onChange={(e) => setProcedureDescription(e.target.value)}
                                    value={procedureDescription}
                                    placeholder='Enter Procedure Description'
                                    className={emptyFields.includes('procedureDescription') ? 'input-error' : 'input'}
                                    style={{ width: '100%', height: '200px' }}
                                />
                            </div>
                        </div>

                        <div className="saveProcedureCheckbox" style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                onChange={(e) => handleSaveProcedureCheckbox(e.target.checked)}
                            />
                            <label style={{ marginLeft: '5px' }}>Save Procedure for Category?</label>
                        </div>

                        <div className='bottom'>
                            <button className='btn btn-effect' type='submit'>Add</button>
                            <div className="error-div">
                                {error && <div className='error'>{error}</div>}
                            </div>
                        </div>

                    </form>
                </div> : <SelectAssetModal title={"Select Parent Asset"} selectAsset={selectAsset} goBack={goBack} />}
        </div>
    )
}

export default AddRepair