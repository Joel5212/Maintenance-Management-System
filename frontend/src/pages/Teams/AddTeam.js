import { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useTeamsContext } from "../../hooks/useTeamsContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext';
import Select from 'react-select'
const validator = require('validator')

const AddTeam = () => {
    const [teamName, setTeamName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [description, setDescription] = useState('')
    const [users, setUsers] = useState([])
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { teams, dispatch: teamsDispatch } = useTeamsContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()

    useEffect(() => {
        fetchUsers()
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [])

    const fetchUsers = async () => {
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        console.log("JSON", json)

        if (response.ok) {
            console.log("HELLOOO")
            const users = []
            for (const user of json) {
                users.push({ label: user.name, value: user._id })
            }
            console.log("Users", users)
            setUsers(users)
        }
    }

    const handleSubmit = async (e) => {

        console.log(selectedUsers.length)

        e.preventDefault()

        if (!user) {
            return
        }

        const emptyFields = [];
        let error = '';

        if (!teamName) {
            emptyFields.push('teamName')
        }

        if (selectedUsers.length > 1) {
            if (emptyFields.length === 0) {

                let userIds = []
                let userIdsAndNames = []

                for (const selectedUser of selectedUsers) {
                    userIds.push(selectedUser.value)
                    userIdsAndNames.push({ _id: selectedUser.value, name: selectedUser.label })
                }

                const newTeam = { name: teamName, users: userIds, description }

                const response = await fetch('/api/teams', {
                    method: 'POST',
                    body: JSON.stringify(newTeam),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                })

                const json = await response.json()

                console.log("JSON", json)


                if (!response.ok) {
                    error = json.error
                }

                if (response.ok) {
                    teamsDispatch({ type: 'ADD_TEAM', payload: json, userIdsAndNames })
                    navigate(-1)
                }
            }
            else {
                error = 'Fill in all required fields'
            }
        }
        else {
            emptyFields.push('users')
            error = 'Add more than one User'
        }
        console.log(emptyFields)
        setEmptyFields(emptyFields)
        setError(error)
    }

    return (
        <div className="add-update-team-container">
            <Link to='/teams' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
            <form className="add-update-team-form" onSubmit={handleSubmit}>
                <h1 className="add-update-team-title">Add Team</h1>
                <div className='add-update-team-inputs-container'>
                    <div className="label-input">
                        <label>Team Name:</label>
                        <input
                            onChange={(e) => setTeamName(e.target.value)}
                            value={teamName}
                            placeholder='Enter Team Name'
                            className={emptyFields.includes('teamName') ? 'input input-error' : 'input'}
                        />
                    </div>
                    <div className="label-input">
                        <label>Select Users:</label>
                        <Select
                            isMulti
                            options={users}
                            onChange={(users) => setSelectedUsers(users)}
                            className={emptyFields.includes('users') ? 'input-error' : 'users-select'}
                        />
                    </div>
                    <div className="label-input">
                        <label>Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder='Enter Description'
                            rows="20" // You can adjust the number of rows as needed
                            cols="43"
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

export default AddTeam