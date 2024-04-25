import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const AssetsActionEllipsis = (props) => {

    const [anchorEl, setAnchorEl] = useState(null);

    const { onDelete, onDeleteAssetAndChildren, onViewUpdate } = props;

    const handleActionClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleActionClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = async (action) => {
        handleActionClose();
        switch (action) {
            case 'deleteAsset':
                await onDelete();
                break;
            case 'deleteAssetAndChildren':
                await onDeleteAssetAndChildren();
                break;
            case 'viewUpdate':
                onViewUpdate();
                break;
            // Add more cases for other actions
            default:
                break;
        }
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="cell-menu"
                aria-haspopup="true"
                //for which cell the menu should be displayed
                onClick={handleActionClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="cell-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleActionClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('delete')}>Delete</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('deleteAssetAndChildren')}>Delete Asset + Children</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('viewUpdate')}>View/Update</MenuItem>
                {/* Add more menu items for other actions */}
            </Menu>
        </div>
    );

}