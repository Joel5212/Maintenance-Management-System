import React from 'react';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


function Sidebar() {

    const { user } = useAuthContext()
    const { logout } = useLogout()

    const logoutClick = async (e) => {
        e.preventDefault();
        console.log("logout")
        await logout();
    };

    return (
        <div className="sidebarItems">
            <div className='sidebar-user'>
                <h1 className="sidebar-user-icon"><FontAwesomeIcon icon={faUserCircle} /></h1>
                <h3 className="org-name">{user.organizationName}</h3>
                <div className='sidebar-user-name'>{user.name}</div>
                <div className='sidebar-user-role'>{user.role}</div>
            </div>
            <ul className="sidebarRoutes">
                <li><Link to="/dashboard" className="sidebarRoute">Dashboard</Link></li>
                <li><Link to="/assets" className="sidebarRoute">Assets</Link></li>
                <li><Link to="/repairs" className="sidebarRoute">Repairs</Link></li>
                <li><Link to="/preventiveMaintenance" className="sidebarRoute">Preventive Maintenances</Link></li>
                <li><Link to="/categories" className="sidebarRoute">Categories</Link></li>
                <li><Link to="/locations" className="sidebarRoute">Locations</Link></li>
                <li><Link to="/users" className="sidebarRoute">Users</Link></li>
                <li><Link to="/teams" className="sidebarRoute">Teams</Link></li>
            </ul>
            <div className="div-empty-space"></div>
            <button className="sidebarLogoutIconButton" onClick={logoutClick}><FontAwesomeIcon icon={faSignOutAlt} className="sidebarLogoutIcon" /></button>

        </div >
    )
}

export default Sidebar