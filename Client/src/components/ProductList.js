import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Modal, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa'; // Import search icon
import Layout from './Layout';
import axios from 'axios'; // Import axios for API calls
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; 

function ProductList() {
  // State to manage products and modal visibility
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    weight: '',
    packaging: '',
    label: '',
    film: '',
    carton: '',
    sellingPrice: '',
    rawMaterialCost: '',
    totalCost: '',
    profit: '',
    profitMargin: '',
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Fetch product categories from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/product-categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  // Fetch products from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Calculate raw material cost based on selected category and weight
  const calculateRawMaterialCost = (category, weight) => {
    const selectedCategory = categories.find(c => c._id === category);
    if (selectedCategory && weight > 0) {
      return weight * selectedCategory.totalCost;
    }
    return 0;
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setNewProduct(prev => ({
      ...prev,
      category: selectedCategory,
      rawMaterialCost: calculateRawMaterialCost(selectedCategory, prev.weight)
    }));
  };

  const handleWeightChange = (e) => {
    const weight = Math.max(0, e.target.value); // Ensure the value is not negative
    setNewProduct(prev => ({
      ...prev,
      weight,
      rawMaterialCost: calculateRawMaterialCost(prev.category, weight),
    }));
  };
  

  const addProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.weight) {
      toast.error('Please fill in all required fields!', { autoClose: 3000 });
      return;
    }
  
    const existingProducts = products.filter(p => p.category === newProduct.category);
  
    // Check for duplicate product name in the same category
    const duplicateProduct = existingProducts.find(p => p.name.toLowerCase() === newProduct.name.toLowerCase());
    if (duplicateProduct) {
      toast.error('A product with the same name already exists in this category.', { autoClose: 3000 });
      return;
    }
  
    const lastProduct = existingProducts.sort((a, b) => b.code.localeCompare(a.code))[0];
    const lastDigit = lastProduct && lastProduct.code ? parseInt(lastProduct.code.slice(-1)) : 0;
    const newCode = `${String(newProduct.category).padStart(2, '0')}${String(lastDigit + 1).padStart(3, '0')}`;
  
    const productData = {
      ...newProduct,
      code: newCode,
      totalCost: newProduct.totalCost,
    };
  
    axios.post('http://localhost:5000/api/products/add', productData)
      .then(response => {
        setProducts([response.data, ...products]); // Add new product at the top
        setShowModal(false);
        setNewProduct({
          name: '',
          category: '',
          weight: '',
          packaging: '',
          label: '',
          film: '',
          carton: '',
          sellingPrice: '',
          rawMaterialCost: '',
          totalCost: '',
          profitMargin: '',
        });
        toast.success('Product added successfully!', { autoClose: 3000 });
      })
      .catch(error => {
        console.error('Error adding product:', error);
        toast.error('Failed to add product. Please try again.', { autoClose: 3000 });
      });
  };
  
  
  const handleCostFieldChange = (field, value) => {
    setNewProduct(prev => {
      const updatedProduct = { ...prev, [field]: value };
      const totalCost =
        Number(updatedProduct.rawMaterialCost || 0) +
        Number(updatedProduct.packaging || 0) +
        Number(updatedProduct.label || 0) +
        Number(updatedProduct.film || 0) +
        Number(updatedProduct.carton || 0);
  
      return { ...updatedProduct, totalCost };
    });
  };
  
  const handleSellingPriceChange = (e) => {
    const sellingPrice = e.target.value;
    setNewProduct(prev => {
      const profit = sellingPrice - prev.totalCost;
      const profitMargin =
        sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
      return { ...prev, sellingPrice, profitMargin };
    });
  };
  

  // Filter products based on search term
  const filteredProducts = products
  .filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.includes(searchTerm)
  )
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleModalClose = () => {
    // Reset the product form state when the modal is closed
    setShowModal(false);
    setNewProduct({
      name: '',
      category: '',
      weight: '',
      packaging: '',
      label: '',
      film: '',
      carton: '',
      sellingPrice: '',
      rawMaterialCost: '',
      totalCost: '',
      profitMargin: '',
    });
  };
  
  // Open modal and reset form fields
  const handleModalOpen = () => {
    setShowModal(true);
    setNewProduct({
      name: '',
      category: '',
      weight: '',
      packaging: '',
      label: '',
      film: '',
      carton: '',
      sellingPrice: '',
      rawMaterialCost: '',
      totalCost: '',
      profitMargin: '',
    });
  };

  return (
    <Layout>
    <div id="raw-materials">
      <div id="products">
        <h3>Product List</h3>
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by Product Name or Code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6} className="text-end">
           <Button onClick={handleModalOpen}>+ Add Product</Button>
          </Col>
        </Row>
        <Table striped bordered hover className="mt-3">
  <thead>
    <tr>
      <th>Product ID</th>
      <th>Product Name</th>
      <th>Net Weight (kg)</th>
      <th>Raw Material Cost</th>
      <th>Packaging</th>
      <th>Label</th>
      <th>Film</th>
      <th>Carton</th>
      <th>Total Cost</th>
      <th>Selling Price</th>
      <th>Profit</th> {/* New Profit column */}
      <th>Profit Margin (%)</th>
    </tr>
  </thead>
  <tbody>
    {filteredProducts.length > 0 ? (
      filteredProducts.map((product, index) => {
        const categoryName = categories.find(c => c._id === product.category)?.name || 'Unknown';
        return (
          <tr key={index}>
            <td>{product.code}</td>
            <td>{product.name}</td>
            <td>{product.weight}</td>
            <td>{product.rawMaterialCost.toFixed(2)}</td>
            <td>{product.packaging}</td>
            <td>{product.label}</td>
            <td>{product.film}</td>
            <td>{product.carton}</td>
            <td>{product.totalCost.toFixed(2)}</td>
            <td>{product.sellingPrice}</td>
            <td>{(product.sellingPrice - product.totalCost).toFixed(2)}</td> {/* Profit */}
            <td>{product.profitMargin.toFixed(2)}%</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="12" className="text-center">No products found</td>
      </tr>
    )}
  </tbody>
</Table>
<ToastContainer />

        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Form Fields with spacing and uniform width */}
              <Form.Group as={Row} controlId="formProductName" className="mb-3">
                <Form.Label column sm="4">Product Name</Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formProductCategory" className="mb-3">
                <Form.Label column sm="4">Category</Form.Label>
                <Col sm="8">
                  <Form.Control
                    as="select"
                    onChange={handleCategoryChange}
                    style={{ width: '100%' }}
                  >
                    <option>Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formProductWeight" className="mb-3">
                <Form.Label column sm="4">Net Weight (kg)</Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="number"
                    value={newProduct.weight}
                    onChange={handleWeightChange}
                    style={{ width: '100%' }}
                    min="0"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formRawMaterialCost" className="mb-3">
                <Form.Label column sm="4">Raw Material Cost</Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="number"
                    value={newProduct.rawMaterialCost}
                    readOnly
                    style={{ width: '100%' }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formPackagingCost" className="mb-3">
              <Form.Label column sm="4">Packaging Cost</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="number"
                  value={newProduct.packaging}
                  onChange={(e) => handleCostFieldChange('packaging', e.target.value)}
                  style={{ width: '100%' }}
                  min="0"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formLabelCost" className="mb-3">
              <Form.Label column sm="4">Label Cost</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="number"
                  value={newProduct.label}
                  onChange={(e) => handleCostFieldChange('label', e.target.value)}
                  style={{ width: '100%' }}
                  min="0"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formFilmCost" className="mb-3">
              <Form.Label column sm="4">Film Cost</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="number"
                  value={newProduct.film}
                  onChange={(e) => handleCostFieldChange('film', e.target.value)}
                  style={{ width: '100%' }}
                  min="0"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formCartonCost" className="mb-3">
              <Form.Label column sm="4">Carton Cost</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="number"
                  value={newProduct.carton}
                  onChange={(e) => handleCostFieldChange('carton', e.target.value)}
                  style={{ width: '100%' }}
                  min="0"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formTotalCost" className="mb-3">
              <Form.Label column sm="4">Total Cost</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="number"
                  value={newProduct.totalCost}
                  readOnly
                  style={{ width: '100%' }}
                  min="0"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formSellingPrice" className="mb-3">
              <Form.Label column sm="4">Selling Price</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="number"
                  value={newProduct.sellingPrice}
                  onChange={handleSellingPriceChange}
                  style={{ width: '100%' }}
                  min="0"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formProfit" className="mb-3">
  <Form.Label column sm="4">Profit</Form.Label>
  <Col sm="8">
    <Form.Control
      type="number"
      value={(newProduct.sellingPrice - newProduct.totalCost).toFixed(2) || 0} // Calculate profit
      readOnly
      style={{ width: '100%' }}
    />
  </Col>
</Form.Group>


            <Form.Group as={Row} controlId="formProfitMargin" className="mb-3">
              <Form.Label column sm="4">Profit Margin (%)</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="number"
                  value={newProduct.profitMargin}
                  readOnly
                  style={{ width: '100%' }}
                  min="0"
                />
              </Col>
            </Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Close</Button>
          <Button variant="primary" onClick={addProduct}>Add Product</Button>
          </Modal.Footer>
        </Modal>
      </div>
      </div>
      </Layout>
  );
}

export default ProductList;
