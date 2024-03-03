import React from 'react'
import InfoIcon from '@mui/icons-material/Info';

export function NoItemsAvailable(props) {

    const { itemName } = props;

    return (
        <div className="no-items-available-container">
            <InfoIcon style={{ fontSize: 150, color: 'gray' }} />
            <div className='no-items-description'>No {itemName} available</div>
        </div>
    )
}