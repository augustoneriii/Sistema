import React, { useContext, useState } from 'react';
import { SidebarContext } from '../../context/SideBarContext';
import { Link } from 'react-router-dom';
import Logo from '../../assets/img/logoSysclin.png';
import styles from './style.module.css';
import sidebarItems from './data/SideBarData';
import { Button } from 'primereact/button';
import { Context } from '../../context/UserContext';

function SideBar({ idUserRole }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [subMenusVisible, setSubMenusVisible] = useState({});
    const context = useContext(SidebarContext);
    const { logout } = useContext(Context);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleSubMenu = (index) => {
        setSubMenusVisible(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const hasRole = (roles) => roles.includes(idUserRole);

    return (
        <div className={`d-flex flex-column flex-shrink-0 bg-light absolute ${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`} style={{ height: '100vh' }}>
            <Link to="/home" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <img src={Logo} height={70} alt="Logo" />
                {isExpanded ? <span className="fs-4">SysClin</span> : ''}
            </Link>
            <hr />
            <Link to="/" className="nav-link link-dark ml-3" onClick={logout}> <i className="pi pi-sign-out"></i> {isExpanded ? 'Logout' : ''}</Link>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                {sidebarItems.filter(item => hasRole(item.roles)).map((item, index) => (
                    <li key={item.text} className="nav-item">
                        {item.items ? (
                            <>
                                <span style={{ cursor: 'pointer' }} onClick={() => toggleSubMenu(index)} className="nav-link link-dark">
                                    <i className={item.icon}></i> {isExpanded ? item.text : ''}
                                </span>
                                <ul className={`submenu ${subMenusVisible[index] ? 'd-block' : 'd-none'}`}>
                                    {item.items.map(subItem => (
                                        <li key={subItem.text} className="nav-item">
                                            <span style={{ cursor: 'pointer' }} onClick={() => context[subItem.action](subItem.actionValue)} className="nav-link link-dark">
                                                <i className={subItem.icon}></i> {isExpanded ? subItem.text : ''}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <Link to={item.link} className="nav-link link-dark">
                                <i className={item.icon}></i> {isExpanded ? item.text : ''}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
            <hr />
            <div className='d-flex justify-content-center mb-5'>
                <Button onClick={toggleSidebar} icon="pi pi-bars" className='border-circle bg-dark border border-secondary' aria-label="Filter" />
            </div>
        </div>
    );
}

export default SideBar;