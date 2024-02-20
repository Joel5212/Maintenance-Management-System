import { useState } from 'react'
import { useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { useAssetsContext } from "../../hooks/useAssetsContext";
const validator = require('validator')

const ViewOrUpdateAsset = () => {
    const { assets: assetsContext, dispatch: assetsDispatch } = useAssetsContext()
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [parentAsset, setParentAsset] = useState([])
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()

    const { asset } = location.state


    const findAndSetParentAsset = async (parentAssetId) => {
        if (parentAsset === null) {
            for (const asset of assetsContext) {
                if (asset._id == parentAssetId) {
                    setParentAsset(asset.name)
                }
            }
        }
        else {
            setParentAsset("root")
        }

    }

    const isFormUnchanged = () => {
        return (
            name === asset.name &&
            price.toString() === asset.price.toString() &&
            description === asset.description
        )
    }

    useEffect(() => {
        setName(asset.name)
        findAndSetParentAsset(asset.parentAsset)
        setPrice(asset.price ? asset.price.toString() : '')
        setDescription(asset.description)
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [assetsDispatch, user])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            return
        }

        const emptyFields = [];
        let error = '';

        if (!isFormUnchanged()) {

            console.log(isFormUnchanged())

            if (!name || name.length === 0) {
                emptyFields.push('name')
            }

            //Check if there are empty fields
            if (emptyFields.length === 0) {
                //Check if there is a price and then check if it is numeric
                console.log("Price Length", price)
                if (!price || (price && validator.isNumeric(price.toString()))) {
                    const updatedAsset = { name: name, assetType: asset.assetType, price: price, description: description, parentAsset: user.parentAsset }

                    const id = asset._id

                    const response = await fetch('/api/assets/' + id, {
                        method: 'PATCH',
                        body: JSON.stringify(updatedAsset),
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
                        assetsDispatch({ type: 'UPDATE_ASSET', payload: json, assetPaths: asset.assetPaths })
                        navigate('/assets')
                    }
                }
                else {
                    error = 'Price has to be numeric'
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
        <div className="add-update-asset-container">
            <div className="add-update-asset-form-container">
                <Link to='/assets' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
                <form className="add-update-asset-form" onSubmit={handleSubmit}>
                    <h1 className="add-update-asset-title">Update Asset</h1>
                    <div className='top'>
                        <div className="label-input">
                            <label>Asset Name:</label>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                placeholder='Enter Name'
                                className={emptyFields.includes('name') ? 'input-error' : 'input'}
                            />
                        </div>
                        <div className='label-input'>
                            <label>Parent Asset:</label>
                            <input
                                value={parentAsset}
                                disabled={true}
                                className="input"
                            />
                        </div>
                    </div>
                    <div className='middle'>
                        <div className="label-input">
                            <label>Price:</label>
                            <input
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                placeholder='Enter Price'
                                className='input'
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
                                rows="20"
                                cols="43"
                                className='label-input-description'

                            />
                        </div>
                    </div>
                    <div className='bottom'>
                        <button className='btn btn-effect' type='submit'>Update</button>
                        <div className="error-div">
                            {error && <div className='error'>{error}</div>}
                        </div>
                    </div>
                </form >
            </div>
        </div >
    )
}

export default ViewOrUpdateAsset