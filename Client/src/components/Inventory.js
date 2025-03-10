import React, { useState } from 'react';
import { Tab, Tabs, Container } from 'react-bootstrap';
import Layout from './Layout';
import { FaWarehouse, FaBoxes, FaClipboardCheck } from 'react-icons/fa';
import RawMaterials from '../components/inventory/RawMaterialInventory';
import SemiFinishedProducts from '../components/inventory/SemiFinishedProducts';
import FinishedProducts from '../components/inventory/FinishedProducts';
import '../CSS/Inventory.css';

function Inventory() {
  const [key, setKey] = useState('raw-materials');

  return (
    <Layout>
      <Container id="inventory-page" className="inventory-page">
        <h1>Inventory Tracking</h1>

        <Tabs
          id="inventory-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3 inventory-tabs"
        >
          <Tab
            eventKey="raw-materials"
            title={
              <span>
                <FaWarehouse className="tab-icon" /> Raw Materials
              </span>
            }
          >
            <RawMaterials />
          </Tab>

          <Tab
            eventKey="semi-finished-products"
            title={
              <span>
                <FaBoxes className="tab-icon" /> Semi Finished Products
              </span>
            }
          >
            <SemiFinishedProducts />
          </Tab>

          <Tab
            eventKey="finished-products"
            title={
              <span>
                <FaClipboardCheck className="tab-icon" /> Finished Products
              </span>
            }
          >
            <FinishedProducts />
          </Tab>
        </Tabs>
      </Container>
    </Layout>
  );
}

export default Inventory;
