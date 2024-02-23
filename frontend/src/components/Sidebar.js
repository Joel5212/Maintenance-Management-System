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
            <div>
                <div>
                    <h1 className="sidebarUserIcon"><span><FontAwesomeIcon icon={faUserCircle} /></span></h1>
                    <h2 className="sidebarUserInfo"> <div>{user.name}</div>  <div>{"(" + user.role + ")"}</div></h2>

                </div>
            </div>
            <ul className="sidebarRoutes">
                <li><Link to="/dashboard" className="sidebarRoute">Dashboard</Link></li>
                <li><Link to="/assets" className="sidebarRoute">Assets</Link></li>
                <li><Link to="/categories" className="sidebarRoute">Categories</Link></li>
                <li><Link to="/repairs" className="sidebarRoute">Repairs</Link></li>
                <li><Link to="/preventiveMaintenance" className="sidebarRoute">Preventive Maintenance</Link></li>
                <li><Link to="/users" className="sidebarRoute">Users</Link></li>
            </ul>
            <div className="div-empty-space"></div>
            <button className="sidebarLogoutIconButton" onClick={logoutClick}><FontAwesomeIcon icon={faSignOutAlt} className="sidebarLogoutIcon" /></button>

        </div >
    )
}

export default Sidebar