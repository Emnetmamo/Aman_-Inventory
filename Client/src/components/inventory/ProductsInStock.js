import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import axios from 'axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import '../../App.css';

function ProductsInStock() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddManufactureModal, setShowAddManufactureModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [newBatch, setNewBatch] = useState({ productId: '', quantity: '', dateOfManufacturing: '' });

  // Dummy data for products (can be replaced by API data)
  const dummyData = [
    {
      _id: '1',
      name: 'Product X',
      category: 'Category A',
      currentQuantity: 100,
      batchProduced: [
        { quantity: 50, dateOfManufacturing: '2024-12-01' },
        { quantity: 30, dateOfManufacturing: '2024-12-10' },
      ],
    },
    {
      _id: '2',
      name: 'Product Y',
      category: 'Category B',
      currentQuantity: 75,
      batchProduced: [],
    },
  ];

  useEffect(() => {
    // Fetch the products in stock from the backend (use dummyData for now)
    setProducts(dummyData);
  }, []);

  const handleViewDetails = (product) => {
    // Set the product details to show in the modal
    setProductDetails(product);
    setShowModal(true);
  };

  const handleAddManufacturedProduct = (e) => {
    e.preventDefault();
    const updatedProducts = products.map((product) => {
      if (product._id === newBatch.productId) {
        product.batchProduced.push({
          quantity: newBatch.quantity,
          dateOfManufacturing: newBatch.dateOfManufacturing,
        });
        product.currentQuantity += parseInt(newBatch.quantity);
      }
      return product;
    });
    setProducts(updatedProducts);
    setShowAddManufactureModal(false); // Close the modal after saving
  };

  return (
    <Layout>
      <div className="products-in-stock-page">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate('/inventory')}>
            &#8592; Back to Inventory
          </button>
        </div>
        <h1>Products In Stock</h1>
        <p>View and manage the list of products currently in stock.</p>

        {/* Button to trigger Add Manufactured Product Modal */}
        <Button variant="primary" onClick={() => setShowAddManufactureModal(true)}>
          Add Manufactured Product
        </Button>

        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Category</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.category}</td>
                  <td>{product.name}</td>
                  <td>{product.currentQuantity} units</td>
                  <td>
                    <Button variant="info" onClick={() => handleViewDetails(product)}>
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal for displaying product details */}
        {productDetails && (
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Product Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <h5>Product: {productDetails.name}</h5>
                <p><strong>Category:</strong> {productDetails.category}</p>

                <h6>Batch Production</h6>
                {productDetails.batchProduced.length > 0 ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productDetails.batchProduced.map((batch, index) => (
                        <tr key={index}>
                          <td>{new Date(batch.dateOfManufacturing).toLocaleDateString()}</td>
                          <td>{batch.quantity} units</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No batches produced yet.</p>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* Modal for adding manufactured product */}
        <Modal show={showAddManufactureModal} onHide={() => setShowAddManufactureModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Manufactured Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddManufacturedProduct}>
              <Form.Group controlId="productId">
                <Form.Label>Select Product</Form.Label>
                <Form.Control
                  as="select"
                  value={newBatch.productId}
                  onChange={(e) => setNewBatch({ ...newBatch, productId: e.target.value })}
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} - {product.category}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="quantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={newBatch.quantity}
                  onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="dateOfManufacturing">
                <Form.Label>Date of Manufacturing</Form.Label>
                <Form.Control
                  type="date"
                  value={newBatch.dateOfManufacturing}
                  onChange={(e) => setNewBatch({ ...newBatch, dateOfManufacturing: e.target.value })}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Save Batch
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </Layout>
  );
}

export default ProductsInStock;
