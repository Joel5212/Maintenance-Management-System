import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export const CategoryActionEllipsis = (props) => {

    const [anchorEl, setAnchorEl] = useState(null);

    const { onDelete, onViewUpdate, goToRepairProceduresOfCategory, goToPreventiveMaintenanceProceduresOfCategory, goToFailuresOfCategory } = props;

    const handleActionClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleActionClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = async (action) => {
        handleActionClose();
        switch (action) {
            case 'delete':
                await onDelete();
                break;
            case 'viewUpdate':
                await onViewUpdate();
                break;
            case 'repairProcedures':
                await goToRepairProceduresOfCategory();
                break;
            case 'preventiveMaintenanceProcedures':
                await goToPreventiveMaintenanceProceduresOfCategory();
                break;
            case 'failures':
                await goToFailuresOfCategory();
                break;
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
                <MenuItem onClick={() => handleMenuItemClick('viewUpdate')}>View/Update</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('repairProcedures')}>Repair Procedures</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('preventiveMaintenanceProcedures')}>PM Procedures</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('failures')}>Failures</MenuItem>
                {/* Add more menu items for other actions */}
            </Menu>
        </div>
    );

}