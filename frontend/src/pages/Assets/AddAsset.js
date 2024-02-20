import { useState } from 'react'
import { useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import { useAuthContext } from '../../hooks/useAuthContext'
import { useAssetsContext } from "../../hooks/useAssetsContext";
import { SelectAssetModal } from '../../components/SelectAssetModal'
const validator = require('validator')


const AddAsset = () => {
    const { assets, dispatch: assetsDispatch } = useAssetsContext()
    const [name, setName] = useState('')
    // const [assetType, setAssetType] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [parentAsset, setParentAsset] = useState('')
    const [parentAssetName, setParentAssetName] = useState([])
    const [parentAssetsToDisplay, setParentAssetsToDisplay] = useState([])
    const [locations, setLocations] = useState('')
    const [assetLocation, setAssetLocation] = useState([])
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState('')
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuthContext()
    const [showSelectAssetModal, setShowSelectAssetModal] = useState(false)
    // const { assetType } = location.state



    // const getLocations = function () {
    //     const locations = []

    //     if (assets) {
    //         const value = 0
    //         const label = "root"
    //         locations.push({ label, value })
    //         for (const asset of assets) {
    //             if (asset.assetType === "location") {
    //                 const value = asset._id
    //                 const label = asset.name
    //                 locations.push({ label, value })
    //             }
    //         }
    //         console.log("locations", locations)
    //         return locations
    //     }
    // }


    // const setAssetLocationAndLoadParentAssets = function (selectedLocation) {

    //     setAssetLocation(location)

    //     setParentAsset()

    //     const locationId = selectedLocation[0].value

    //     const parentAssets = []

    //     if (assetType === "equipment") {
    //         if (locationId === 0) {
    //             const value = 0
    //             const label = "root"
    //             parentAssets.push({ label, value })
    //             for (const asset of assets) {
    //                 const value = asset._id
    //                 const label = asset.name
    //                 parentAssets.push({ label, value })
    //             }
    //         }
    //         else {
    //             for (const asset of assets) {
    //                 if (asset.assetPaths.includes(locationId)) {
    //                     const value = asset._id
    //                     const label = asset.name
    //                     parentAssets.push({ label, value })
    //                 }
    //             }
    //         }
    //     }
    //     else if (assetType === "location") {
    //         if (locationId === 0) {
    //             const value = 0
    //             const label = "root"
    //             parentAssets.push({ label, value })
    //             for (const asset of assets) {
    //                 if (asset.assetType === "location") {
    //                     const value = asset._id
    //                     const label = asset.name
    //                     parentAssets.push({ label, value })
    //                 }
    //             }
    //         }
    //         else {
    //             for (const asset of assets) {
    //                 if (asset.assetType === "location" && asset.assetPaths.includes(locationId)) {
    //                     const value = asset._id
    //                     const label = asset.name
    //                     parentAssets.push({ label, value })
    //                 }
    //             }
    //         }
    //     }
    //     setParentAssets(parentAssets)
    // }



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

    // const fetchAssets = async () => {
    //     const response = await fetch('/api/assets', {
    //         headers: {
    //             'Authorization': `Bearer ${user.token}`
    //         }
    //     })
    //     const json = await response.json()

    //     if (response.ok) {
    //         console.log('Fetched Assets', json)
    //         assetsDispatch({ type: 'SET_ASSETS', payload: json })
    //     }
    // }

    useEffect(() => {
        // if (prevRoute !== '/assets') {
        //     fetchAssets()
        //     console.log(prevRoute, assets)
        // }
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [assetsDispatch, user])

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

                console.log("ParentAssetId", parentAsset)

                const newAsset = { name: name, price: price, description: description, parentAsset: parentAssetId }

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
                    assetsDispatch({ type: 'ADD_ASSET', payload: json })
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
                        </div>
                        <div className='middle'>
                            {/* <div className="label-input">
                        <label>Location:</label>
                        <div className={emptyFields.includes('location') ? 'dropdown-error' : 'dropdown'}>
                            <Select
                                options={getLocations()}
                                values={assetLocation}
                                onChange={(values) => setAssetLocationAndLoadParentAssets(values)}

                            />
                        </div>
                    </div> */}
                            <div className='label-input'>
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