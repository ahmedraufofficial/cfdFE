import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import GavelIcon from '@mui/icons-material/Gavel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthProvider";
import { Button } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ImageIcon from '@mui/icons-material/Image';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const auth = useAuth()
    const navigate = useNavigate();
    const handleLogout = () => {
        auth.logout()
    }
    const menuItem=[
        {
            path:"/dashboard",
            name:"Dashboard",
            icon:<DashboardIcon />
        },
        {
            path:"/evaluations",
            name:"Evaluations",
            icon:<DirectionsCarIcon />
        },
        {
            path:"/appointments",
            name:"Appointments",
            icon:<CalendarMonthIcon />
        },
        {
            path:"/inspections",
            name:"Inspection",
            icon:<FactCheckIcon />
        },
        {
            path:"/add/images",
            name:"Images",
            icon:<ImageIcon />
        },
        {
            path:"/auctions",
            name:"Auctions",
            icon:<GavelIcon />
        },
        {
            path:"/users",
            name:"Users",
            icon:<AccountBoxIcon />
        }
    ]
    return (
        <div className="container">
           <div style={{width: isOpen ? "200px" : "50px", borderBottomRightRadius: '50px'}} className="sidebar">
               <div className="top_section">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Options</h1>
                   <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                       <FormatListBulletedIcon onClick={toggle}/>
                   </div>
                   
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }
           </div>
           <main>{children}</main>
        </div>
    );
};

export default Sidebar;