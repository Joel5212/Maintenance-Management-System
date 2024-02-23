import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'react-dropdown/style.css';
import { useCategoriesContext } from "../../hooks/useCategoriesContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
const validator = require('validator')

const ViewOrUpdateUser = (props) => {
    const [categoryName, setCategoryName] = useState('')
    const [categoryDescription, setCategoryDescription] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { categories, dispatch: categoriesDispatch } = useCategoriesContext()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user: userContext } = useAuthContext()
    const { category } = location.state

    useEffect(() => {
        setCategoryName(category.name)
        setCategoryDescription(category.description)
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [])

    //Check if form is changed
    const isFormUnchanged = () => {
        return (
            categoryName === category.name &&
            categoryDescription === category.description
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
            if (!categoryName) {
                emptyFields.push('categoryName')
            }

            if (emptyFields.length === 0) {

                const updatedCategory = { categoryName, categoryDescription }

                const _id = category._id

                const response = await fetch('/api/categories/' + _id, {
                    method: 'PATCH',
                    body: JSON.stringify(updatedCategory),
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
                    categoriesDispatch({ type: 'UPDATE_CATEGORY', payload: json })
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

    const roles = ["User", "Servicer"];

    return (
        <div className="add-update-category-container">
            <Link to='/categories' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
            <form className="add-update-category-form" onSubmit={handleSubmit}>
                <h1 className="add-update-category-title">Update Category</h1>
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
                    <button className='btn btn-effect' type='submit'>Update</button>
                    <div className="error-div">
                        {error && <div className='error'>{error}</div>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ViewOrUpdateUser