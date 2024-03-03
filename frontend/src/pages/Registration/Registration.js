import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import 'react-dropdown/style.css';
import { useOrgRegisterContext } from "../../hooks/useOrgRegisterContext";
const validator = require('validator')

function Registration() {
    const { isRegistered, dispatch } = useOrgRegisterContext()
    const [orgName, setOrgName] = useState('')
    const [orgCity, setOrgCity] = useState('')
    const [orgState, setOrgState] = useState('')
    const [orgZipCode, setOrgZipCode] = useState('')
    const [orgCountry, setOrgCountry] = useState('')
    const [orgPhoneNumber, setOrgPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [emptyFields, setEmptyFields] = useState('')
    const [error, setError] = useState(null)
    // const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const emptyFields = [];
        let error = '';

        if (!orgName) {
            emptyFields.push('orgName')
        }

        if (!orgCity) {
            emptyFields.push('orgCity')
        }

        if (!orgState) {
            emptyFields.push('orgState')
        }

        if (!orgCountry) {
            emptyFields.push('orgCountry')
        }

        if (!orgPhoneNumber) {
            emptyFields.push('orgPhoneNumber')
        }

        if (!firstName) {
            emptyFields.push('firstName')
        }

        if (!lastName) {
            emptyFields.push('lastName')
        }

        if (!email) {
            emptyFields.push('email')
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

                const organization = { email, password, name, phoneNumber, orgName, orgCity, orgState, orgZipCode, orgCountry, orgPhoneNumber }

                const response = await fetch('/api/organization/', {
                    method: 'POST',
                    body: JSON.stringify(organization),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                const json = await response.json()

                //Check for errors from express server
                if (!response.ok) {
                    error = json.error
                }

                if (response.ok) {
                    dispatch({ type: 'REGISTERED', payload: true })
                    console.log("isRegistered", isRegistered)
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

    return (
        <div className="registration">
            <div className="registration-bg">
                <div className="registration-container">
                    <form className="registration-form" onSubmit={handleSubmit}>

                        <div className='registration-header'>
                            <h1 className='registration-title'>Organization</h1>
                            <hr className='registration-hr' />
                        </div>

                        <div className="top">
                            <div className="label-input">
                                <label className='organization-input-label'>Organization Name:</label>
                                <input
                                    onChange={(e) => setOrgName(e.target.value)}
                                    value={orgName}
                                    placeholder='Enter Organization Name'
                                    className={emptyFields.includes('orgName') ? 'input-error' : 'input'}
                                />
                            </div>
                            <div className="label-input">
                                <label className='organization-input-label'>City:</label>
                                <input
                                    onChange={(e) => setOrgCity(e.target.value)}
                                    value={orgCity}
                                    placeholder='Enter City'
                                    className={emptyFields.includes('orgCity') ? 'input-error' : 'input'}
                                />
                            </div>
                            <div className="label-input">
                                <label className='organization-input-label'>State:</label>
                                <input
                                    onChange={(e) => setOrgState(e.target.value)}
                                    value={orgState}
                                    placeholder='Enter State'
                                    className={emptyFields.includes('orgState') ? 'input-error' : 'input'}
                                />
                            </div>
                        </div>
                        <div className="middle">
                            <div className="label-input">
                                <label className='organization-input-label'>Zip Code:</label>
                                <input
                                    onChange={(e) => setOrgZipCode(e.target.value)}
                                    value={orgZipCode}
                                    placeholder='Enter Zip Code'
                                    className={emptyFields.includes('orgZipCode') ? 'input-error' : 'input'}
                                />
                            </div>
                            <div className="label-input">
                                <label className='organization-input-label'>Country:</label>
                                <input
                                    onChange={(e) => setOrgCountry(e.target.value)}
                                    value={orgCountry}
                                    placeholder='Enter Country'
                                    className={emptyFields.includes('orgCountry') ? 'input-error' : 'input'}
                                />
                            </div>
                            <div className="label-input">
                                <label className='organization-input-label'>Phone Number:</label>
                                <input
                                    onChange={(e) => setOrgPhoneNumber(e.target.value)}
                                    value={orgPhoneNumber}
                                    placeholder='Enter Phone Number'
                                    className={emptyFields.includes('orgPhoneNumber') ? 'input-error' : 'input'}
                                />
                            </div>
                        </div>

                        <div className='registration-header'>
                            <h1 className='registration-title'>Admin</h1>
                            <hr className='registration-hr' />
                        </div>

                        <div className="middle">
                            <div className="label-input">
                                <label className='organization-input-label'>First Name:</label>
                                <input
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={firstName}
                                    placeholder='Enter Name'
                                    className={emptyFields.includes('firstName') ? 'input-error' : 'input'}
                                />
                            </div>
                            <div className="label-input">
                                <label className='organization-input-label'>Last Name:</label>
                                <input
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={lastName}
                                    placeholder='Enter Name'
                                    className={emptyFields.includes('lastName') ? 'input-error' : 'input'}
                                />
                            </div>
                            <div className="label-input">
                                <label className='organization-input-label'>Email:</label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    placeholder='Enter Email'
                                    className={emptyFields.includes('email') ? 'input-error' : 'input'}
                                />
                            </div>
                        </div>
                        <div className="middle">
                            <div className="label-input">
                                <label className='organization-input-label'>Password:</label>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    placeholder='Enter Password'
                                    className={emptyFields.includes('password') ? 'input-error' : 'input'}
                                />
                            </div>
                            <div className="label-input">
                                <label className='organization-input-label'>Phone Number:</label>
                                <input
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    value={phoneNumber}
                                    placeholder='Enter Phone Number'
                                    className='input'
                                />
                            </div>
                            <div >
                                <div
                                    className={'invisible-input'}
                                />
                            </div>
                        </div>
                        <div className='bottom'>
                            <button className='btn btn-effect' type='submit'>Register</button>
                            <div className="error-div">
                                {error && <div className='error'>{error}</div>}
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Registration