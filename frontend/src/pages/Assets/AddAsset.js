import { useState } from 'react'
import { useEffect } from 'react'
import Select from 'react-dropdown-select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { useAssetsContext } from "../../hooks/useAssetsContext";
import { useCategoriesContext } from "../../hooks/useCategoriesContext";
import { useLocationsContext } from "../../hooks/useLocationsContext";
import { SelectAssetModal } from '../../components/SelectAssetModal'
const validator = require('validator')


const AddAsset = () => {
    const { assets, dispatch: assetsDispatch } = useAssetsContext()
    // const { categories: categoriesContext, dispatch: categoriesDispatch } = useCategoriesContext()
    // const { locations: locationsContext, dispatch: locationsDispatch } = useLocationsContext()
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [parentAsset, setParentAsset] = useState('')
    const [parentAssetName, setParentAssetName] = useState([])
    const [locations, setLocations] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedAssetLocation, setSelectedAssetLocation] = useState([])
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()
    const [showSelectAssetModal, setShowSelectAssetModal] = useState(false)

    useEffect(() => {
        fetchAndSetLocations()
        fecthAndSetCategories()
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [assetsDispatch, user])

    const fecthAndSetCategories = async () => {
        const response = await fetch('/api/categories', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        if (response.ok) {
            const categories = []
            if (json) {
                for (const category of json) {
                    const value = category._id
                    const label = category.name
                    categories.push({ label, value })

                }
                console.log("categories", categories)
                setCategories(categories)
            }
        }
    }

    const fetchAndSetLocations = async () => {
        const response = await fetch('/api/locations', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            const locations = []
            if (json) {
                for (const location of json) {
                    const value = location._id
                    const label = location.name
                    locations.push({ label, value })

                }
                console.log("locations", locations)
                setLocations(locations)
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            return
        }

        const emptyFields = [];
        let error = '';

        if (!name || name.length === 0) {
            emptyFields.push('name')
        }

        //Check if there are empty fields or if price is numeric
        if (emptyFields.length === 0) {
            //Check if price is numeric
            if (!price || (price && validator.isNumeric(price.toString()))) {

                let parentAssetId = null;

                if (parentAsset) {
                    parentAssetId = parentAsset._id
                }

                let categoryId = null
                let categoryName = ''

                if (selectedCategory.length !== 0) {
                    categoryId = selectedCategory[0].value
                    categoryName = selectedCategory[0].label
                }

                let locationId = null
                let locationName = ''

                if (selectedAssetLocation.length !== 0) {
                    locationId = selectedAssetLocation[0].value
                    locationName = selectedAssetLocation[0].label
                }

                console.log("ParentAssetId", parentAsset)

                const newAsset = { name: name, price: price, description: description, parentAsset: parentAssetId, categoryId: categoryId, locationId: locationId }

                const response = await fetch('/api/assets', {
                    method: 'POST',
                    body: JSON.stringify(newAsset),
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
                    console.log("CATEGORY NAME", categoryName)
                    console.log("LOCATION NAME", locationName)
                    assetsDispatch({ type: 'ADD_ASSET', payload: json, categoryName: categoryName, locationName: locationName })
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
        setEmptyFields(emptyFields)
        setError(error)
    }


    return (

        <div className="add-update-asset-container">
            {showSelectAssetModal === false ?
                <div className="add-update-asset-form-container">
                    <Link to='/assets' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
                    <form className="add-update-asset-form" onSubmit={handleSubmit}>
                        <h1 className="add-update-asset-title">Add Asset</h1>
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
                                    rows="20" // You can adjust the number of rows as needed
                                    cols="43"
                                />
                            </div>
                        </div>
                        <div className='middle'>
                            <div className="label-input">
                                <label>Parent Asset:</label>
                                <div className="add-parent-asset-container">
                                    <input
                                        value={parentAssetName}
                                        placeholder='Select Parent Asset'
                                        className='add-parent-asset-input'
                                        disabeled={true}
                                    />
                                    <button className='add-parent-asset-btn' onClick={selectParentAsset}>
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="label-input">
                                <label>Category:</label>
                                <div className={emptyFields.includes('category') ? 'dropdown-error' : 'dropdown'}>
                                    <Select
                                        options={categories}
                                        values={selectedCategory}
                                        onChange={(category) => setSelectedCategory(category)}

                                    />
                                </div>
                            </div>
                            <div className="label-input">
                                <label>Location:</label>
                                <div className='dropdown'>
                                    <Select
                                        options={locations}
                                        values={selectedAssetLocation}
                                        onChange={(assetLocation) => setSelectedAssetLocation(assetLocation)}

                                    />
                                </div>
                            </div>
                            {/* <div >
                        <div
                            className={'invisible-input'}
                        />
                    </div> */}
                        </div>
                        <div className='bottom'>
                            <button className='btn btn-effect' type='submit'>Add</button>
                            <div className="error-div">
                                {error && <div className='error'>{error}</div>}
                            </div>
                        </div>
                    </form >
                </div > : <SelectAssetModal title={"Select Parent Asset"} selectAsset={selectAsset} goBack={goBack} />}
        </div>
    )
}


export default AddAsset