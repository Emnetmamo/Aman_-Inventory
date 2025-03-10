import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import '../../App.css';

function SoldProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSale, setNewSale] = useState({
    category: '',
    productId: '',
    quantitySold: 0,
    manufacturingPrice: 0,
    sellingPrice: 0,
    saleDate: '',
  });
  const [salesData, setSalesData] = useState([]);
  const [addAnotherProduct, setAddAnotherProduct] = useState(false);

  // Dummy data for products (replace with actual API data)
  const dummyProducts = [
    {
      _id: '1',
      name: 'Product X',
      category: 'Category A',
      currentQuantity: 100,
      manufacturingCost: 10, // unit cost price
      sellingPrice: 20, // unit selling price
    },
    {
      _id: '2',
      name: 'Product Y',
      category: 'Category B',
      currentQuantity: 75,
      manufacturingCost: 15,
      sellingPrice: 25,
    },
  ];

  useEffect(() => {
    // Fetch the products from the backend (using dummy data for now)
    setProducts(dummyProducts);
  }, []);

  const handleCalculatePrice = () => {
    const selectedProduct = products.find((product) => product._id === newSale.productId);
    if (selectedProduct) {
      const totalManufacturingPrice = selectedProduct.manufacturingCost * newSale.quantitySold;
      const totalSellingPrice = selectedProduct.sellingPrice * newSale.quantitySold;
      setNewSale({
        ...newSale,
        manufacturingPrice: totalManufacturingPrice,
        sellingPrice: totalSellingPrice,
      });
    }
  };

  const handleAddSale = () => {
    const selectedProduct = products.find((product) => product._id === newSale.productId);

    if (selectedProduct && selectedProduct.currentQuantity >= newSale.quantitySold) {
      // Subtract sold quantity from the product's current quantity
      selectedProduct.currentQuantity -= newSale.quantitySold;

      // Add sale data
      const sale = {
        product: selectedProduct.name,
        quantitySold: newSale.quantitySold,
        manufacturingPrice: newSale.manufacturingPrice,
        sellingPrice: newSale.sellingPrice,
        saleDate: newSale.saleDate,
      };

      setSalesData([...salesData, sale]);

      if (addAnotherProduct) {
        // Reset for adding another product
        setNewSale({
          category: '',
          productId: '',
          quantitySold: 0,
          manufacturingPrice: 0,
          sellingPrice: 0,
          saleDate: '',
        });
      } else {
        setShowModal(false);
      }
    } else {
      alert('Not enough stock to sell.');
    }
  };

  return (
    <Layout>
      <div className="sold-products-page">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate('/inventory')}>
            &#8592; Back to Inventory
          </button>
        </div>
        <h1>Sold Products</h1>
        <p>Track the products sold and their quantities.</p>

        {/* Button to trigger Add Sold Product Modal */}
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Sold Product
        </Button>

        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Manufacturing Price</th>
                <th>Selling Price</th>
                <th>Sale Date</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale, index) => (
                <tr key={index}>
                  <td>{sale.product}</td>
                  <td>{sale.quantitySold} units</td>
                  <td>${sale.manufacturingPrice}</td>
                  <td>${sale.sellingPrice}</td>
                  <td>{sale.saleDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal for adding sold products */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Sold Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" value={newSale.category} onChange={(e) => setNewSale({ ...newSale, category: e.target.value })}>
                  <option value="">Select a category</option>
                  {products.map((product) => (
                    <option key={product._id} value={product.category}>
                      {product.category}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="product">
                <Form.Label>Product</Form.Label>
                <Form.Control
                  as="select"
                  value={newSale.productId}
                  onChange={(e) => setNewSale({ ...newSale, productId: e.target.value })}
                >
                  <option value="">Select a product</option>
                  {products
                    .filter((product) => product.category === newSale.category)
                    .map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="quantitySold">
                <Form.Label>Quantity Sold</Form.Label>
                <Form.Control
                  type="number"
                  value={newSale.quantitySold}
                  onChange={(e) => setNewSale({ ...newSale, quantitySold: e.target.value })}
                  onBlur={handleCalculatePrice}
                  required
                />
              </Form.Group>

              <Form.Group controlId="manufacturingPrice">
                <Form.Label>Manufacturing Price</Form.Label>
                <Form.Control
                  type="text"
                  value={newSale.manufacturingPrice}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="sellingPrice">
                <Form.Label>Selling Price</Form.Label>
                <Form.Control
                  type="text"
                  value={newSale.sellingPrice}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="saleDate">
                <Form.Label>Sale Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newSale.saleDate}
                  onChange={(e) => setNewSale({ ...newSale, saleDate: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Add another product"
                  checked={addAnotherProduct}
                  onChange={() => setAddAnotherProduct(!addAnotherProduct)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddSale}>
              Save Sale
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
}

export default SoldProducts;
