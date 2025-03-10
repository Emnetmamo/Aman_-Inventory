// Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import '../CSS/Layout.css'; // Optional CSS for layout

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}

export default Layout;
