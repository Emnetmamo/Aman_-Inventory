import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaBox, FaBoxOpen, FaFlask, FaChevronLeft, FaChevronRight, FaBoxes, FaUserPlus, FaChartLine } from 'react-icons/fa';
import '../CSS/Sidebar.css';
import profile from "../Images/the guy.avif"

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        {isOpen && (
          <>
            <img src={profile} alt="User" className="user-image" />
            <span className="user-name">Amanuel Mengistu</span>
          </>
        )}
        {isOpen && <span className="admin-title">Admin</span>}
      </div>

      <div className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <FaChevronLeft size={25} /> : <FaChevronRight size={25} />}
      </div>

      <ul className="sidebar-list">
        <li>
          <NavLink to="/raw-materials" activeClassName="active">
            <FaFlask size={isOpen ? 25 : 30} />
            {isOpen && <span>Raw Materials</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories" activeClassName="active">
            <FaBox size={isOpen ? 25 : 30} />
            {isOpen && <span>Product Categories</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" activeClassName="active">
            <FaBoxOpen size={isOpen ? 25 : 30} />
            {isOpen && <span>Products</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/inventory" activeClassName="active">
            <FaBoxes size={isOpen ? 25 : 30} />
            {isOpen && <span>Inventory</span>}
          </NavLink>
        </li>

        {/* Add Sales Link */}
        <li>
          <NavLink to="/sales" activeClassName="active">
            <FaChartLine size={isOpen ? 25 : 30} />
            {isOpen && <span>Sales</span>}
          </NavLink>
        </li>

        {/* User Registration Link */}
        <li>
          <NavLink to="/user-registration" activeClassName="active">
            <FaUserPlus size={isOpen ? 25 : 30} />
            {isOpen && <span>User Registration</span>}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
