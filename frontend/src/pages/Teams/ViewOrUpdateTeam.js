import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useTeamsContext } from "../../hooks/useTeamsContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { UsersContext } from '../../context/UsersContext';
import Select from 'react-select'

const validator = require('validator')


const ViewOrUpdateTeam = () => {
    const [teamName, setTeamName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [description, setDescription] = useState('')
    const [users, setUsers] = useState([])
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { user } = useAuthContext()
    const { teams, dispatch: teamsDispatch } = useTeamsContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { team } = location.state

    useEffect(() => {
        console.log(team)
        fetchUsers()
        setTeamName(team.name)
        const users = []
        for (const user of team.users) {
            users.push({ value: user._id, label: user.name })
        }
        setSelectedUsers(users)
        setDescription(team.description)
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [teamsDispatch, user])

    const fetchUsers = async () => {
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            const users = []
            for (const user of json) {
                users.push({ value: user._id, label: user.name })
            }
            console.log("USERS", users)
            setUsers(users)
        }
    }

    const usersSelectHasNotChanged = () => {
        const hashmap = {}

        if (team.users.length === selectedUsers.length) {
            for (const user of team.users) {
                const userId = user._id
                hashmap[userId] = ""
            }

            for (const user of selectedUsers) {
                if (!(user.value in hashmap)) {
                    return false;
                }
            }
            return true
        }
        else {
            return false
        }

    }

    //Check if form is changed
    const isFormUnchanged = () => {

        //Checking to see if any new users were added
        // const usersNotChanged = team.users.length === selectedUsers.length && newTeamObj.defaultUsers.every(user => JSON.stringify(user) === JSON.stringify(selectedUsers))

        return (
            teamName === team.name &&
            usersSelectHasNotChanged() &&
            description === team.description
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
            if (!teamName) {
                emptyFields.push('teamName')
            }

            if (emptyFields.length === 0) {
                if (selectedUsers.length > 1) {

                    let userIds = []
                    let userIdsAndNames = []

                    for (const selectedUser of selectedUsers) {
                        userIds.push(selectedUser.value)
                        userIdsAndNames.push({ _id: selectedUser.value, name: selectedUser.label })
                    }

                    const updatedTeam = { name: teamName, users: userIds, description }

                    const teamId = team._id

                    console.log(updatedTeam)
                    console.log(team)

                    const response = await fetch('/api/teams/' + teamId, {
                        method: 'PATCH',
                        body: JSON.stringify(updatedTeam),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        }
                    })

                    const json = await response.json()

                    if (!response.ok) {
                        error = json.error
                    }

                    if (response.ok) {
                        teamsDispatch({ type: 'UPDATE_TEAM', payload: json, userIdsAndNames })
                        navigate(-1)
                    }

                }
                else {
                    error = 'Add more than one User'
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

    return (
        <div className="add-update-team-container">
            <Link to='/teams' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
            <form className="add-update-team-form" onSubmit={handleSubmit}>
                <h1 className="add-update-team-title">Update Team</h1>
                <div className='add-update-team-inputs-container'>
                    <div className="label-input">
                        <label>Team Name:</label>
                        <input
                            onChange={(e) => setTeamName(e.target.value)}
                            value={teamName}
                            placeholder='Enter Team Name'
                            className={emptyFields.includes('teamName') ? 'input-error' : 'input'}
                        />
                    </div>
                    <div className="label-input">
                        <label>Select Users:</label>
                        <Select
                            value={selectedUsers}
                            isMulti
                            options={users}
                            onChange={(users) => setSelectedUsers(users)}
                            className='users-select'
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
                    <button className='btn btn-effect' type='submit'>Update</button>
                    <div className="error-div">
                        {error && <div className='error'>{error}</div>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ViewOrUpdateTeam