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
            path:"/appointment",
            name:"Appointment",
            icon:<CalendarMonthIcon />
        },
        {
            path:"/analytics",
            name:"Inspection",
            icon:<FactCheckIcon />
        },
        {
            path:"/comment",
            name:"Auction",
            icon:<GavelIcon />
        },
    ]
    return (
        <div className="container">
           <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar">
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