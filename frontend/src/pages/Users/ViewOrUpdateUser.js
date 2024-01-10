import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useUsersContext } from "../../hooks/useUsersContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
const validator = require('validator')

const ViewOrUpdateUser = (props) => {
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [role, setRole] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { user: userContext } = useAuthContext()


    const { users, dispatch: usersDispatch } = useUsersContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();

    const navigate = useNavigate()
    const location = useLocation()

    const { user } = location.state

    useEffect(() => {
        setFirstName(user.name.split(" ")[0])
        setLastName(user.name.split(" ")[1])
        setRole(user.role)
        setPhoneNumber(user.phoneNumber)
        setEmail(user.email)
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [])

    //Check if form is changed
    const isFormUnchanged = () => {
        return (
            firstName === user.name.split(" ")[0] &&
            lastName === user.name.split(" ")[1] &&
            email === user.email &&
            role === user.role &&
            phoneNumber === user.phoneNumber
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!userContext) {
            return;
        }

        const emptyFields = [];
        let error = '';

        if (!isFormUnchanged()) {
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

            if (emptyFields.length === 0) {
                if (validator.isEmail(email)) {
                    const name = firstName.trim() + " " + lastName.trim();

                    const password = user.password;

                    const oldEmail = user.email

                    const newUser = { email, oldEmail, password, name, phoneNumber, role }

                    const _id = user._id

                    const response = await fetch('/api/users/' + _id, {
                        method: 'PATCH',
                        body: JSON.stringify(newUser),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userContext.token}`
                        }
                    })

                    const json = await response.json()

                    if (!response.ok) {
                        error = json.error
                    }

                    if (response.ok) {
                        usersDispatch({ type: 'UPDATE_USER', payload: json })
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

    const roles = ["User", "Servicer"];

    return (
        <div className="add-user-container">
            <Link to='/users'><button className='back-button'><ArrowBackIcon /></button></Link>
            <form className="add-user-form" onSubmit={handleSubmit}>
                <h1 className="add-user-title">Update User</h1>
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
                    <div >
                        <div
                            className={'invisible-input'}
                        />
                    </div>
                </div>
                <div className='bottom'>
                    <button className='btn btn-effect' type='submit'>Update</button>
                    {error && <div className='error'>{error}</div>}
                </div>
            </form>
        </div>
    )
}

export default ViewOrUpdateUser