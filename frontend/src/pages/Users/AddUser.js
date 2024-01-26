import { useState } from 'react'
import { useEffect } from "react"
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useUsersContext } from "../../hooks/useUsersContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
const validator = require('validator')

const AddUser = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [role, setRole] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { users, dispatch: usersDispatch } = useUsersContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()

    useEffect(() => {
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            return
        }

        const emptyFields = [];
        let error = '';

        if (!email) {
            emptyFields.push('email')
        }

        if (!firstName) {
            emptyFields.push('firstName')
        }

        if (!lastName) {
            emptyFields.push('lastName')
        }

        if (!phoneNumber) {
            emptyFields.push('phoneNumber')
        }

        if (!role) {
            emptyFields.push('role')
        }

        if (!password) {
            emptyFields.push('password')
        }
        //Check if there are empty fields
        if (emptyFields.length === 0) {
            //Check for proper email
            if (validator.isEmail(email)) {
                //Send Request
                const name = firstName.trim() + " " + lastName.trim();

                const newUser = { email, password, name, phoneNumber, role }

                const response = await fetch('/api/users/addUser', {
                    method: 'POST',
                    body: JSON.stringify(newUser),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                })

                const json = await response.json()

                //Check for errors from express server
                if (!response.ok) {
                    error = json.error
                }

                if (response.ok) {
                    usersDispatch({ type: 'ADD_USER', payload: json })
                    navigate(-1)
                }

            }
            else {
                error = 'Email is not valid'
            }
        }
        else {
            error = 'Fill in all the fields'
        }
        setEmptyFields(emptyFields)
        setError(error)
    }

    const roles = ["User", "Servicer"];

    return (
        <div className="add-update-user-container">
            <Link to='/users' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
            <form className="add-update-user-form" onSubmit={handleSubmit}>
                <h1 className="add-update-user-title">Add User</h1>
                <div className='top'>
                    <div className="label-input">
                        <label>First Name:</label>
                        <input
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            placeholder='Enter First Name'
                            className={emptyFields.includes('firstName') ? 'input-error' : 'input'}
                        />
                    </div>
                    <div className="label-input">
                        <label>Last Name:</label>
                        <input
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                            placeholder='Enter Last Name'
                            className={emptyFields.includes('lastName') ? 'input-error' : 'input'}

                        />
                    </div>
                    <div className="label-input">
                        <label>Role:</label>
                        <Dropdown
                            options={roles}
                            onChange={(selectedRole) => setRole(selectedRole.value)}
                            value={role}
                            placeholder='Select a Role'
                            className={emptyFields.includes('role') ? 'dropdown-error' : ''}
                        />
                    </div>
                </div>
                <div className='middle'>
                    <div className='label-input'>
                        <label>Phone Number:</label>
                        <input
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                            placeholder='Enter Phone Number'
                            className={emptyFields.includes('phoneNumber') ? 'input-error' : 'input'}
                        />
                    </div>
                    <div className="label-input">
                        <label>Email:</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder='Enter Email'
                            className={emptyFields.includes('email') ? 'input-error' : 'input'}

                        />
                    </div>
                    <div className='label-input'>
                        <label>Password:</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder='Enter Password'
                            className={emptyFields.includes('password') ? 'input-error' : 'input'}

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

export default AddUser