import { useState } from 'react'
import { useEffect } from "react"
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useCategoriesContext } from "../../hooks/useCategoriesContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
const validator = require('validator')

const AddUser = () => {
    const [categoryName, setCategoryName] = useState('')
    const [categoryDescription, setCategoryDescription] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { categories, dispatch: categoriesDispatch } = useCategoriesContext()
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

        if (!categoryName) {
            emptyFields.push('categoryName')
        }

        //Check if there are empty fields
        if (emptyFields.length === 0) {

            const newCategory = { name: categoryName, description: categoryDescription }

            const response = await fetch('/api/categories/', {
                method: 'POST',
                body: JSON.stringify(newCategory),
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
                categoriesDispatch({ type: 'ADD_CATEGORY', payload: json })
                navigate(-1)
            }
        }
        else {
            error = 'Fill in all the fields'
        }
        setEmptyFields(emptyFields)
        setError(error)
    }

    return (
        <div className="add-update-category-container">
            <Link to='/categories' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
            <form className="add-update-category-form" onSubmit={handleSubmit}>
                <h1 className="add-update-category-title">Add Category</h1>
                <div className='category-inputs'>
                    <div className="label-input">
                        <label>Category Name:</label>
                        <input
                            onChange={(e) => setCategoryName(e.target.value)}
                            value={categoryName}
                            placeholder='Enter Category'
                            className={emptyFields.includes('categoryName') ? 'input-error' : 'input'}
                        />
                    </div>
                    <div className="label-input">
                        <label>Category Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            value={categoryDescription}
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

export default AddUser
