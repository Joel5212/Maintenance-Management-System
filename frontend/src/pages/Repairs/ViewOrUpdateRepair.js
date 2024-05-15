import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import Select from 'react-dropdown-select';
import 'react-dropdown/style.css';
import { useRepairsContext } from "../../hooks/useRepairsContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { UsersContext } from '../../context/UsersContext';

import { SelectAssetModal } from '../../components/SelectAssetModal'

const validator = require('validator')


const ViewOrUpdateRepair = (props) => {
    const [title, setTitle] = useState('')

    const [assets, setAssets] = useState([])
    const [parentAsset, setParentAsset] = useState('')
    const [parentAssetName, setParentAssetName] = useState([])
    const [showSelectAssetModal, setShowSelectAssetModal] = useState(false)

    const [servicers, setServicers] = useState('')
    const [selectedServicer, setSelectedServicer] = useState([])
    const [teams, setTeams] = useState('')
    const [selectedTeam, setSelectedTeam] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);

    const [startDate, setStartDate] = useState(null)
    const [dueDate, setDueDate] = useState('')
    const [priority, setPriority] = useState('')

    const [status, setStatus] = useState('')
    const [cost, setCost] = useState('')
    const [description, setDescription] = useState('')

    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { user } = useAuthContext()
    const { repair: repairContext } = useAuthContext()


    const { repairs, dispatch: repairsDispatch } = useRepairsContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();

    const navigate = useNavigate()
    const location = useLocation()

    const { repair } = location.state

    const fetchRepairs = async () => {
        const response = await fetch('/api/repairs', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            repairsDispatch({ type: 'SET_REPAIRS', payload: json })
        }
    }

    useEffect(() => {
        console.log("THE REPAIR", repair)
        fetchAndSetAssets()
        fetchAndSetServicers()

        setSelectedServicer(repair.servicers)
        setTitle(repair.title)

        setParentAsset(repair.asset)

        setStartDate(repair.startDate)
        setDueDate(repair.dueDate)
        setPriority(repair.priority)
        setStatus(repair.status)
        setCost(repair.cost)
        setDescription(repair.description)
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [repairsDispatch, user])



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
    //Check if form is changed
    const isFormUnchanged = () => {
        return (
            title === repair.title &&
            assets === repair.assets &&
            startDate === repair.startDate &&
            dueDate === repair.dueDate &&
            priority === repair.priority &&
            servicers === repair.servicers &&
            status === repair.status &&
            cost === repair.status &&
            description === repair.description
        )
    }

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
            return;
        }

        const emptyFields = [];
        let error = '';

        if (!isFormUnchanged()) {
            if (!title) {
                emptyFields.push('title')
            }
            
            if (parentAssetName.length === 0) {
                emptyFields.push('asset')
            }
            if (!selectedServicer) {
                emptyFields.push('servicer');
            }

            if (emptyFields.length > 0) {
                setError(`Please fill in all required fields: ${emptyFields.join(', ')}`);
                setEmptyFields(emptyFields);
                return; // Stop the form submission
            }

            /*
            

            if (!startDate) {
                emptyFields.push('startDate')
            }

            if (!dueDate) {
                emptyFields.push('dueDate')
            }

            if (!priority) {
                emptyFields.push('priority')
            }

            
            if (!status) {
                emptyFields.push('status')
            }

            if (!cost) {
                emptyFields.push('cost')
            }

            if (!description) {
                emptyFields.push('description')
            }

            */
            if (emptyFields.length === 0) {

                let assetId = null

                if (parentAsset) {
                    assetId = parentAsset._id
                }
                console.log("assetId", assetId)


                let servicerId = null
                let servicerName = ''

                if (selectedServicer.length !== 0) {
                    servicerId = selectedServicer[0].value
                    servicerName = selectedServicer[0].label
                }




                const newRepair = { title: title, asset: assetId, startDate: startDate, dueDate: dueDate, priority: priority, servicers: servicerId, status: status, cost: cost, description: description }

                const _id = repair._id
                console.log('check 1', newRepair)
                const response = await fetch('/api/repairs/' + _id, {
                    method: 'PATCH',
                    body: JSON.stringify(newRepair),
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
                    fetchRepairs()
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

    const priorities = ["Low", "Medium", "High"];
    const statuses = ["Incomplete", "Overdue", "Complete"]


    return (
        <div className="add-update-repair-container">
            {showSelectAssetModal === false ?
                <div className="add-update-repair-form-container">
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
                                <div className="add-parent-asset-container">
                                    <input
                                        value={parentAssetName}
                                        placeholder={repair.asset.name}
                                        className='add-parent-asset-input'
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className="label-input">
                                <label>Cost ($):</label>
                                <input
                                    onChange={(e) => {
                                        const inputCost = e.target.value;
                                        // Check if the input is a number
                                        if (!isNaN(inputCost)) {
                                            // If it's a number, update the state
                                            setCost(inputCost);
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
                                    placeholder='Select a Priority'
                                    className={emptyFields.includes('priority') ? 'dropdown-error' : ''}
                                />
                            </div>
                        </div>
                        <div className='middle'>
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
                            
                            <div className="label-input">
                                <label>Servicers:</label>
                                <Select
                                    value={selectedServicer}
                                    options={servicers}
                                    placeholder={selectedServicer}
                                    onChange={(selectedServicer) => setSelectedServicer(selectedServicer)}
                                    formatGroupLabel={formatGroupLabel}
                                />
                            </div>
                            <div className='label-input'>
                                <label>Due Date:</label>
                                <input
                                    type='date'
                                    onChange={(e) => setDueDate(e.target.value)}
                                    value={dueDate}
                                    placeholder='Enter Due Date'
                                    className={emptyFields.includes('dueDate') ? 'input-error' : 'input'}
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
                                    disabled
                                />
                            </div>

                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', fontFamily: 'Arial' }}>
                            <label for="description" style={{ fontFamily: 'Times New Roman' }}>Description:</label>
                            <textarea
                                id="description"
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                placeholder='Enter Description'
                                className={emptyFields.includes('description') ? 'input-error' : ''}
                                style={{ width: '100%', height: '200px', fontFamily: 'Times New Roman' }}
                            />
                        </div>
                        <div className='bottom'>
                            <button className='btn btn-effect' type='submit'>Update</button>
                            <div className="error-div">
                                {error && <div className='error'>{error}</div>}
                            </div>
                        </div>
                    </form>
                </div> : <SelectAssetModal title={"Select Parent Asset"} selectAsset={selectAsset} goBack={goBack} />}
        </div>

    )

}

export default ViewOrUpdateRepair