import { useEffect } from "react"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import equipmentIcon from '../../images/equipmentIcon.png'
import locationIcon from '../../images/locationIcon.png'

const AddAsset = () => {


    const location = useLocation()
    const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext();
    const navigate = useNavigate()

    useEffect(() => {
        prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
    }, [])

    const addEquipment = function () {
        const assetType = "equipment"
        navigate('/assets/add', { state: { assetType } })
    }

    const addLocation = function () {
        const assetType = "location"
        navigate('/assets/add', { state: { assetType } })
    }

    return (
        <div className="asset-type-container">
            <Link to='/assets/' className='back-button-link'><button className='back-button'><ArrowBackIcon /></button></Link>
            <div className='images'>
                <button className="image" onClick={addEquipment}>
                    <img className="equipmentIcon" src={equipmentIcon}></img>
                    <div className="imageText">Equipment</div>
                </button>
                <button className="image" onClick={addLocation}>
                    <img className="locationIcon" src={locationIcon}></img>
                    <div className="imageText">Location</div>
                </button>
            </div>
        </div>
    )
}

export default AddAsset