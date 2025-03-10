import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import Layout from '../Layout';
import '../../App.css';

function PlaceOrder() {
  const navigate = useNavigate();

  // State for categories, products, and order entries
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    category: '',
    product: '',
    quantity: 0,
    date: '',
  });
  const [orderEntries, setOrderEntries] = useState([]);
  const [missingItems, setMissingItems] = useState([]);

  // Dummy data for categories and products
  const dummyData = {
    "Shampoo": ["300ml", "500ml"],
    "Baby Oil": ["300ml", "1000ml"],
    "Vaseline": ["300ml", "400ml"],
  };

  useEffect(() => {
    // Load categories dynamically
    setCategories(Object.keys(dummyData));
  }, []);

  const handleCategoryChange = (category) => {
    setCurrentEntry({ ...currentEntry, category, product: '' });
    setProducts(dummyData[category] || []);
  };

  const handleAddEntry = (e) => {
    e.preventDefault();

    // Add the current entry to the list
    setOrderEntries([...orderEntries, currentEntry]);

    // Reset the current entry
    setCurrentEntry({
      category: '',
      product: '',
      quantity: 0,
      date: '',
    });
    setProducts([]);
  };

  const handleOrderSubmit = () => {
    // Dummy inventory logic
    const inventory = [
      { product: "Product A1", availableQuantity: 50 },
      { product: "Product B1", availableQuantity: 30 },
      { product: "Product C1", availableQuantity: 0 },
    ];

    const issues = orderEntries.map((entry) => {
      const foundItem = inventory.find((item) => item.product === entry.product);
      if (!foundItem) {
        // Product not found in inventory
        return { product: entry.product, missingQuantity: entry.quantity };
      } else if (foundItem.availableQuantity < entry.quantity) {
        // Insufficient inventory
        return {
          product: foundItem.product,
          missingQuantity: entry.quantity - foundItem.availableQuantity,
        };
      }
      return null;
    });

    const missingItems = issues.filter((item) => item !== null);
    if (missingItems.length > 0) {
      setMissingItems(missingItems);
    } else {
      alert('Order placed successfully!');
      setOrderEntries([]);
      setMissingItems([]);
    }
  };

  return (

    <Layout>
    <div id="raw-materials">
      <Container className="place-order-page mt-4">
        <Row className="mb-4">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate('/inventory')}>
            &#8592; Back to Inventory
          </button>
        </div>
        </Row>
        <Row>
          <Col>
            {/* <h1 className="text-center mb-4">Place an Order</h1> */}
          </Col>
        </Row>
        <Row>
          <Col md={6} className="shadow p-4 rounded bg-light">
            <h3 className="mb-3">Add Order</h3>
            <Form onSubmit={handleAddEntry}>
              <Form.Group className="mb-3">
                <Form.Label>Product Category:</Form.Label>
                <Form.Select
                  value={currentEntry.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product Type:</Form.Label>
                <Form.Select
                  value={currentEntry.product}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, product: e.target.value })}
                  required
                  disabled={!currentEntry.category}
                >
                  <option value="">Select a product</option>
                  {products.map((product, index) => (
                    <option key={index} value={product}>
                      {product}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quantity:</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter quantity"
                  value={currentEntry.quantity}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Order Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={currentEntry.date}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Add to Order
              </Button>
            </Form>
          </Col>

          
          <Col md={6}>
            <h3 className="mb-3">Order Summary</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orderEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.category}</td>
                    <td>{entry.product}</td>
                    <td>{entry.quantity}</td>
                    <td>{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="success" onClick={handleOrderSubmit} className="w-100">
              Submit Order
            </Button>
          </Col>
        </Row>
        {missingItems.length > 0 && (
          <Row className="mt-4">
            <Col>
              <Alert variant="danger">
                <Alert.Heading>Order Issues</Alert.Heading>
                <p>The following items are missing or insufficient:</p>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Missing Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {missingItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product}</td>
                        <td>{item.missingQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Alert>
            </Col>
          </Row>
        )}
      </Container>
      </div>
    </Layout>
  );
}

export default PlaceOrder;
