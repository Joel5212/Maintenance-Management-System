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
import { SelectProcedureModal } from '../../components/SelectProcedureModal';
import { SelectFailureModal } from '../../components/SelectFailureModal';
import { FailureDiagnosisFormModal } from '../../components/FailureDiagnosisFormModal';
const { format, parse } = require('date-fns');


const AddRepair = () => {
    const [title, setTitle] = useState(null)
    const [usersAndTeams, setUsersAndTeams] = useState([])
    const [assignTo, setAssignTo] = useState([])
    const [teams, setTeams] = useState('')
    const [selectedTeam, setSelectedTeam] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);
    const [dueDate, setDueDate] = useState('')
    const [failureDate, setFailureDate] = useState('')
    const [priority, setPriority] = useState('')
    const [status, setStatus] = useState('Incomplete')
    const [cost, setCost] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const { repairs, dispatch: repairsDispatch } = useRepairsContext()
    const [isActiveRepairCheckboxChecked, setIsActiveRepairCheckboxChecked] = useState(true);

    //Asset
    const [assets, setAssets] = useState('')
    const [selectedAsset, setSelectedAsset] = useState('')
    const [selectedAssetName, setSelectedAssetName] = useState([])
    const [showSelectAssetModal, setShowSelectAssetModal] = useState(false)

    //Failure
    const [isFailureCheckboxChecked, setIsFailureCheckboxChecked] = useState(false);
    const [failureTitle, setFailureTitle] = useState(null)
    const [failureObservation, setFailureObservation] = useState(null)
    const [failureCause, setFailureCause] = useState(null)
    const [selectedFailure, setSelectedFailure] = useState(null)
    const [showSelectFailureModal, setShowSelectFailureModal] = useState(false)

    //Failure Diagnosis
    const [showFailureDiagnosisFormModal, setShowFailureDiagnosisFormModal] = useState(false)

    //Procedure
    const [procedureTitle, setProcedureTitle] = useState('')
    const [procedureDescription, setProcedureDescription] = useState('')
    const [selectedProcedure, setSelectedProcedure] = useState(null)
    const [showSelectProcedureModal, setShowSelectProcedureModal] = useState(false)

    useEffect(() => {
        if (user && (prevRoute !== '/repairs/add' && prevRoute !== '/repairs/viewOrUpdate' || !repairs)) {
            fetchRepairs()
        }
        fetchAndSetUsersAndTeams()
        fetchAndSetAssets()
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })

    }, [repairsDispatch, user])

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

    const fetchAndSetUsersAndTeams = async () => {
        const usersAndTeams = []

        const usersResponse = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const usersJson = await usersResponse.json()

        const teamsResponse = await fetch('/api/teams', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const teamsJson = await teamsResponse.json()

        if (usersResponse.ok && teamsResponse.ok) {
            if (usersJson) {
                for (const user of usersJson) {
                    const value = user._id
                    const label = user.name
                    const isUser = true
                    usersAndTeams.push({ label, value, isUser })
                }
            }

            if (teamsJson) {
                for (const team of teamsJson) {
                    const value = team._id
                    const label = team.name
                    const isUser = false
                    usersAndTeams.push({ label, value, isUser })
                }
            }
        }
        setUsersAndTeams(usersAndTeams)
    }

    //Asset Functions
    const enableSelectAssetModal = function () {
        setShowSelectAssetModal(true)
    }

    const goBackFromSelectAssetModal = function () {
        setShowSelectAssetModal(false)
    }

    const selectAsset = function (asset) {
        setSelectedAsset(asset)
        setSelectedAssetName(asset.name)
        setShowSelectAssetModal(false)
    }

    //Procedure functions
    const enableSelectProcedureModal = function () {
        if (selectedAsset && selectedAsset.category != null) {
            if (!selectedFailure) {
                setShowSelectProcedureModal(true)
            }
            else {
                setError("Failure with procedure already selected")
            }
        }
        else {
            setError("Asset has no category")
        }
    }

    const selectProcedure = function (procedure) {
        setSelectedProcedure(procedure)
        setProcedureTitle(procedure.title)
        setProcedureDescription(procedure.description)
        setShowSelectProcedureModal(false)
    }

    const removeSelectedProcedure = function (procedure) {
        setProcedureTitle('')
        setProcedureDescription('')
        setSelectedProcedure(null)
    }

    const goBackFromSelectProcedureModal = function () {
        setShowSelectProcedureModal(false)
    }

    //Failure Functions 
    const enableSelectFailureModal = function () {
        if (selectedAsset && selectedAsset.category != null) {
            setShowSelectFailureModal(true)
            setError(null)
        } else {
            setError("Asset has no category")
        }
    }

    const selectFailure = function (failure) {
        setSelectedFailure(failure)
        setFailureTitle(failure.title)
        setFailureObservation(failure.observation)
        setFailureCause(failure.cause)
        if (failure.procedure) {
            setProcedureTitle(failure.procedure.title)
            setProcedureDescription(failure.procedure.description)
        }
        else {
            setProcedureTitle(failure.procedureTitle)
            setProcedureDescription(failure.procedureDescription)
        }
        setShowSelectFailureModal(false)
        setShowFailureDiagnosisFormModal(false)
    }

    const removeSelectedFailure = function () {
        setFailureTitle('')
        setFailureObservation('')
        setFailureCause('')
        setSelectedFailure(null)
    }

    const goBackFromSelectFailureModal = function () {
        setShowSelectFailureModal(false)
    }

    //Failure Diagnosis Functions
    const enableSelectFailureDiagnosisFormModal = function () {
        if (selectedAsset && selectedAsset.category != null) {
            setShowFailureDiagnosisFormModal(true)
            setError(null)
        } else {
            setError("Asset has no category")
        }
    }

    const goBackFromSelectFailureDiagnosisFormModal = function () {
        setShowFailureDiagnosisFormModal(false)
    }

    // const options = [
    //     { label: 'Servicers', options: servicers },
    //     { label: 'Teams', options: teams }
    // ];

    // function formatGroupLabel(data) {
    //     return (
    //         <div style={{ fontWeight: 'bold' }}>
    //             {data.label}
    //         </div>
    //     );
    // }

    const handleSubmit = async (e) => {
        setError(null)
        setEmptyFields([])
        e.preventDefault()

        if (!user) {
            return
        }

        const emptyFields = [];
        let error = '';

        if (!title) {
            emptyFields.push('title')
        }
        if (!selectedAsset) {
            emptyFields.push('asset')
        }
        if (isActiveRepairCheckboxChecked && assignTo.length === 0) {
            emptyFields.push('assignTo');
        }

        if (procedureTitle || procedureDescription) {
            if (!procedureTitle) {
                emptyFields.push('procedureTitle')
            }

            if (!procedureDescription) {
                emptyFields.push('procedureDescription')
            }
        }

        if (failureDate || failureTitle || failureObservation || failureCause) {
            if (!failureDate) {
                emptyFields.push('failureDate')
            }

            if (!failureTitle) {
                emptyFields.push('failureTitle')
            }

            if (!failureObservation) {
                emptyFields.push('failureObservation')
            }

            if (!failureCause) {
                emptyFields.push('failureCause')
            }
        }

        if (emptyFields.length === 0) {

            let assetId = null;
            let assetName = null;

            if (selectedAsset) {
                assetId = selectedAsset._id
                assetName = selectedAsset.name
            }

            let teamId = null;
            let teamName = null;
            let userId = null;
            let userName = null;

            if (assignTo.length !== 0) {
                if (assignTo[0].isUser) {
                    userId = assignTo[0].value
                    userName = assignTo[0].label
                }
                else {
                    teamId = assignTo[0].value
                    teamName = assignTo[0].label
                }
            }

            let failureId = null

            let procedureId = null

            if (selectedFailure) {
                failureId = selectedFailure._id
            }

            if (selectedProcedure) {
                procedureId = selectedProcedure._id
            }

            let formattedStartDate = null

            let unformattedStartDate = null

            if (isActiveRepairCheckboxChecked) {
                unformattedStartDate = new Date()

                // formattedStartDate = unformattedStartDate.toLocaleDateString('en-CA', {
                //     year: 'numeric',
                //     day: '2-digit',
                //     month: '2-digit',
                // })
            }

            let formattedDueDate = null

            let unformattedDueDate = null

            if (dueDate) {

                unformattedDueDate = new Date(dueDate)

                // unformattedDueDate.setDate(unformattedDueDate.getDate() + 1)

                // formattedDueDate = unformattedDueDate.toLocaleDateString('en-CA', {
                //     year: 'numeric',
                //     day: '2-digit',
                //     month: '2-digit',
                // })

                // Check if dueDate is after startDate
                if (new Date(unformattedStartDate) > new Date(unformattedDueDate)) {
                    setError("Due date cannot be before start date")
                    emptyFields.push("dueDate")
                    return
                }
            }

            let formattedFailureDate = null

            let unformattedFailureDate = null

            if (failureDate) {

                unformattedFailureDate = new Date(failureDate)

                // unformattedFailureDate.setDate(unformattedFailureDate.getDate() + 1)

                // formattedFailureDate = unformattedFailureDate.toLocaleDateString('en-CA', {
                //     year: 'numeric',
                //     day: '2-digit',
                //     month: '2-digit',
                // })

                // if (new Date(unformattedFailureDate) > new Date(unformattedDueDate)) {
                //     setError("Due date cannot be before start date")
                //     emptyFields.push("dueDate")
                //     return
                // }
            }

            let categoryId = null

            if (selectedAsset.category) {
                categoryId = selectedAsset.category._id
            }

            const newRepair = { title: title, asset: assetId, startDate: unformattedStartDate, dueDate: unformattedDueDate, priority: priority, assignedUser: userId, assignedTeam: teamId, status: status, cost: cost, description: description, isFailure: isFailureCheckboxChecked, failure: failureId, failureDate: unformattedFailureDate, failureTitle: failureTitle, failureCause: failureCause, failureObservation: failureObservation, procedure: procedureId, procedureTitle: procedureTitle, procedureDescription: procedureDescription, category: categoryId }

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
                // fetchRepairs()un
                repairsDispatch({ type: 'ADD_REPAIR', payload: json, asset: selectedAsset, userIdAndName: { _id: userId, name: userName }, teamIdAndName: { _id: teamId, name: teamName } })
                navigate(-1)
            }
        }
        else {
            error = 'Fill in all the required fields'
        }
        setEmptyFields(emptyFields)
        setError(error)
    }

    const priorities = ["Low", "Medium", "High"];

    const handleFailureCheckbox = () => {
        console.log(isFailureCheckboxChecked)
        setIsFailureCheckboxChecked(!isFailureCheckboxChecked);
    }

    const handleActiveRepairCheckbox = () => {
        console.log(isFailureCheckboxChecked)
        setIsActiveRepairCheckboxChecked(!isActiveRepairCheckboxChecked);
    }

    return (
        !showSelectAssetModal ? (!showSelectProcedureModal ? (!showSelectFailureModal ? (!showFailureDiagnosisFormModal ?
            <div className="add-update-repair-form-container">
                <form className="add-update-repair-form" onSubmit={handleSubmit}>
                    <div className='add-update-repair-top'>
                        <Link to='/repairs' ><button className='add-update-repair-back-btn'><ArrowBackIcon /></button></Link>
                        <h1 className="add-update-repair-title">Add Repair</h1>
                        <div className="add-update-repair-back-btn-invisible"></div>
                    </div>
                    <div className="add-update-repair-checkbox">
                        <input
                            type="checkbox"
                            onChange={() => handleActiveRepairCheckbox()}
                            checked={isActiveRepairCheckboxChecked} />
                        <label style={{ marginLeft: '5px' }}>Active Repair?</label>
                    </div>
                    <div className='repair-inputs-row'>
                        <div className="label-input">
                            <label>Title:</label>
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                placeholder='Enter title'
                                className={emptyFields.includes('title') ? 'add-update-repair-form-input input-error' : 'add-update-repair-form-input'}
                            />
                        </div>

                        <div className="label-input">
                            <label>Asset:</label>
                            <div className="add-parent-asset-container">
                                <input
                                    value={selectedAssetName}
                                    placeholder='Select Asset'
                                    className={`add-update-asset-select-input ${emptyFields.includes('asset') ? 'input-error' : ''}`}
                                    disabled={true}
                                />
                                <button className='add-parent-asset-btn' onClick={enableSelectAssetModal}>
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="label-input">
                            <label>Assign To:</label>
                            <div className='dropdown'>
                                <Select
                                    options={usersAndTeams}
                                    onChange={(userOrTeamIdAndName) => setAssignTo(userOrTeamIdAndName)}
                                    values={assignTo}
                                    placeholder="Select Servicer or Team"
                                    className={emptyFields.includes('assignTo') ? 'add-update-repair-form-input input-error' : 'add-update-repair-form-input'}
                                />
                            </div>
                        </div>



                    </div>
                    <div className='repair-inputs-row'>
                        {/* Start Date not visible to user on repair creation
                            <div className='label-input'>
                                <label>Start Date:</label>
                                <input
                                    type='date'
                                    onChange={(e) => setStartDate(e.target.value)}
                                    value={startDate}
                                    placeholder='Enter Start Date'
                                    className={emptyFields.includes('startDate') ? 'input-error' : 'input'}
                                    disabled='true'
                                />
                            </div>
                            */}
                        <div className='label-input'>
                            <label>Due Date:</label>
                            <input
                                type="datetime-local"
                                onChange={(e) => setDueDate(e.target.value)}
                                value={dueDate}
                                placeholder='Enter Due Date'
                                className={emptyFields.includes('dueDate') ? 'add-update-repair-form-input input-error' : 'add-update-repair-form-input'}
                                disabled={!isActiveRepairCheckboxChecked ? true : false}
                            />
                        </div>
                        <div className='label-input'>
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
                                className={emptyFields.includes('cost') ? 'add-update-repair-form-input input-error' : 'add-update-repair-form-input'}
                            />
                        </div>
                        {/*
                            <div className='label-input'>
                                <label>Status:</label>
                                <Dropdown
                                    options={statuses}
                                    onChange={(selectedStatus) => setStatus(selectedStatus.value)}
                                    value={status}
                                    placeholder={'Select status'}
                                    className={`dropdown-disabled ${emptyFields.includes('status') ? 'dropdown-error' : ''}`}
                                    disabled={true} />
                            </div>
                                */}
                    </div >
                    <div className='add-update-repair-form-label-input'>
                        <label>Description:</label>
                        <textarea
                            id="description"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder='Enter Description'
                            className='add-update-repair-description'
                        />
                    </div>
                    <div className="add-update-repair-checkbox" style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            onChange={() => handleFailureCheckbox()}
                            checked={isFailureCheckboxChecked} />
                        <label style={{ marginLeft: '5px' }}>Repair is due to asset failure?</label>
                    </div>
                    {isFailureCheckboxChecked === true && (
                        <div className='failure-inputs-container'>
                            <div className='label-input'>
                                <label>Failure Date:</label>
                                <input
                                    type="datetime-local"
                                    onChange={(e) => setFailureDate(e.target.value)}
                                    value={failureDate}
                                    placeholder='Enter Failure Date'
                                    className={emptyFields.includes('failureDate') ? 'add-update-repair-form-failure-datepicker-input input-error' : 'add-update-repair-form-failure-datepicker-input'}
                                />
                            </div>
                            <div className="add-update-repair-form-label-input">
                                <label>Failure Title:</label>
                                <div className="failure-repair-row-input">
                                    <input
                                        onChange={(e) => setFailureTitle(e.target.value)}
                                        value={failureTitle}
                                        placeholder='Enter Failure Title'
                                        className={`add-update-repair-failure-title-input ${emptyFields.includes('failureTitle') ? 'add-update-failure-input-error' : ''}`}
                                        disabled={selectedFailure ? true : false}
                                    />
                                    <div className='select-failure-container'>
                                        {!selectedFailure ?
                                            <div className='select-failure-group'>
                                                <div className='select-failure-btn' onClick={enableSelectFailureModal}>+ Select Failure</div> <div className='or-div'>or</div>
                                                <div className='select-failure-btn' onClick={enableSelectFailureDiagnosisFormModal}>+ Select Failure Using Diagnostic tool</div>
                                            </div> : <div className='select-failure-btn' onClick={removeSelectedFailure}>- Remove Failure</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="add-update-repair-form-label-input">
                                <label>Failure Observation:</label>
                                <textarea
                                    onChange={(e) => setFailureObservation(e.target.value)}
                                    value={failureObservation}
                                    placeholder='Enter Failure Observation'
                                    className={`add-update-repair-description  ${emptyFields.includes('failureObservation') ? 'add-update-failure-input-error' : ''}`}
                                    disabled={selectedFailure ? true : false}
                                />
                            </div>
                            <div className="add-update-repair-form-label-input">
                                <label>Failure Cause:</label>
                                <textarea
                                    onChange={(e) => setFailureCause(e.target.value)}
                                    value={failureCause}
                                    placeholder='Enter Failure Cause'
                                    className={`add-update-repair-description  ${emptyFields.includes('failureCause') ? 'add-update-failure-input-error' : ''}`}
                                    disabled={selectedFailure ? true : false}
                                />
                            </div>
                        </div>
                    )}

                    {/* <div>
                            <button
                                className="procedure-button"
                                type="button"
                                onClick={handleSelectProcedure}>
                                + Select a Procedure
                            </button>
                        </div> */}


                    <div className='procedure-repair-inputs-container'>
                        <div className='add-update-repair-form-label-input'>
                            <label>Procedure Title:</label>
                            <div className="procedure-repair-row-input">
                                <input
                                    onChange={(e) => setProcedureTitle(e.target.value)}
                                    value={procedureTitle}
                                    placeholder='Enter Failure Title'
                                    className={`add-update-repair-procedure-title-input ${emptyFields.includes('procedureTitle') ? 'add-update-failure-input-error' : ''}`}
                                    disabled={selectedProcedure || selectedFailure ? true : false}
                                />

                                <div className='select-repair-procedure-container'>
                                    {!selectedProcedure ?
                                        <div className='select-procedure-in-repair-form-btn' onClick={enableSelectProcedureModal}>+ Select Procedure</div> :
                                        <div className='select-procedure-in-repair-form-btn' onClick={removeSelectedProcedure}>- Remove Procedure</div>}
                                </div>
                            </div>
                        </div>
                        <div className="add-update-repair-form-label-input">
                            <label>Procedure:</label>
                            <textarea
                                onChange={(e) => setProcedureDescription(e.target.value)}
                                value={procedureDescription}
                                placeholder='Enter Procedure'
                                className={`add-update-repair-description ${emptyFields.includes('procedureDescription') ? 'add-update-failure-input-error' : ''}`}
                                disabled={selectedProcedure || selectedFailure ? true : false}
                            />
                        </div>
                    </div>

                    <div className='bottom-pf-add-repair-form '>
                        <button className='btn btn-effect' type='submit'>Add</button>
                        {error ? <div className='repair-form-error'>{error}</div> : <div className='repair-form-empty-error'></div>}
                    </div>

                    {/* <div className="saveProcedureCheckbox" style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                onChange={(e) => handleSaveProcedureCheckbox(e.target.checked)}
                            />
                            <label style={{ marginLeft: '5px' }}>Save Procedure for Category?</label>
                        </div> */}


                </form>
            </div>
            : <FailureDiagnosisFormModal selectFailure={selectFailure} categoryId={selectedAsset.category._id} goBack={goBackFromSelectFailureDiagnosisFormModal} />) :
            <SelectFailureModal selectFailure={selectFailure} categoryId={selectedAsset.category._id} goBack={goBackFromSelectFailureModal} />) :
            <SelectProcedureModal selectProcedure={selectProcedure} categoryId={selectedAsset.category._id} goBack={goBackFromSelectProcedureModal} />) :
            <SelectAssetModal title={"Select Asset"} selectAsset={selectAsset} goBack={goBackFromSelectAssetModal} />
    )
}

export default AddRepair