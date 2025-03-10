import React, { useState } from 'react';
import { Tab, Tabs, Container } from 'react-bootstrap';
import Layout from './Layout';
import { FaUserPlus, FaShoppingCart, FaHistory } from 'react-icons/fa';
import CustomerRegistration from '../components/sales/CustomerRegistration';  // You need to create this component
import PlaceOrder from '../components/sales/PlaceOrder';  // You need to create this component
import SalesHistory from '../components/sales/SalesHistory';  // You need to create this component
import '../CSS/Sales.css';

function SalesPage() {
  const [key, setKey] = useState('customer-registration');

  return (
    <Layout>
      <Container id="sales-page" className="sales-page">
      <h1>Sales Management</h1>
        <Tabs
          id="sales-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3 sales-tabs"
        >
          <Tab
            eventKey="customer-registration"
            title={
              <span>
                <FaUserPlus className="tab-icon" /> Register Customer
              </span>
            }
          >
            <CustomerRegistration />  {/* Implement this component */}
          </Tab>

          <Tab
            eventKey="place-order"
            title={
              <span>
                <FaShoppingCart className="tab-icon" /> Place Order
              </span>
            }
          >
            <PlaceOrder />  {/* Implement this component */}
          </Tab>

          <Tab
            eventKey="sales-history"
            title={
              <span>
                <FaHistory className="tab-icon" /> Sales History
              </span>
            }
          >
            <SalesHistory />  {/* Implement this component */}
          </Tab>
        </Tabs>
      </Container>
    </Layout>
  );
}

export default SalesPage;
