import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, InputGroup, FormControl } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { FaSearch, FaEdit } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

function SemiFinishedProducts() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [stages, setStages] = useState([
    'Stock Solution', 'Product in Bulk Container', 'Bottled', 'Finished'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [semiFinishedProducts, setSemiFinishedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editStage, setEditStage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/inventory/semiFinishedProduct/categories')
      .then((response) => setCategories(response.data))
      .catch((err) => console.error(err));

    reloadData();
  }, []);

  const reloadData = () => {
    axios
      .get('http://localhost:5000/api/inventory/semiFinishedProduct')
      .then((response) => {
        const filteredData = response.data.filter(
          (item) => item.stage.name !== 'Finished'
        );
        const sortedData = filteredData.sort(
          (a, b) => new Date(b.stage.date) - new Date(a.stage.date)
        );
        setSemiFinishedProducts(sortedData);
      })
      .catch((err) => console.error('Error reloading semi-finished products', err));
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);

    axios
      .get(`http://localhost:5000/api/inventory/semiFinishedProduct/products/${categoryId}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      category: selectedCategory,
      product: selectedProduct,
      stage: {
        name: selectedStage,
        date: new Date().toISOString(),
      },
      quantity,
    };

    axios
      .post('http://localhost:5000/api/inventory/semiFinishedProduct', newProduct)
      .then(() => {
        toast.success('Semi-finished product added successfully!');
        resetModalFields(); // Reset modal fields after submission
        setShowModal(false);
        reloadData();
      })
      .catch(() => toast.error('Failed to add semi-finished product.'));
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditStage('');
    setEditModal(true);
  };

  const handleStageUpdate = (e) => {
    e.preventDefault();
  
    const stagesOrder = ['Stock Solution', 'Product in Bulk Container', 'Bottled', 'Finished'];
  
    // Prevent updating to the same stage
    if (editStage === editProduct.stage.name) {
      toast.warn('Product is already in the selected stage!');
      return;
    }
  
    // Prevent updating to a backward stage
    if (stagesOrder.indexOf(editStage) < stagesOrder.indexOf(editProduct.stage.name)) {
      toast.warn('You cannot move the product backward in the stages!');
      return;
    }
  
    // Prevent updating to the "Finished" stage if it's already finished
    if (editStage === "Finished" && editProduct.stage.name === "Finished") {
      toast.warn('Product is already finished!');
      return;
    }
  
    const updatedProductData = {
      stage: {
        name: editStage,
        date: new Date().toISOString(),
      },
    };
  
    axios
      .put(`http://localhost:5000/api/inventory/semiFinishedProduct/${editProduct._id}`, updatedProductData)
      .then((response) => {
        if (response.data.stage.name === 'Finished') {
          const { category, product, quantity } = response.data;
  
          axios
            .get(`http://localhost:5000/api/inventory/finishedProducts/${product._id}`)
            .then((finishedProductResponse) => {
              if (finishedProductResponse.data) {
                const updatedFinishedProduct = finishedProductResponse.data;
                updatedFinishedProduct.batches.push({
                  quantity,
                  date: new Date().toISOString(),
                });
                updatedFinishedProduct.totalQuantity += quantity;
  
                axios
                  .put(
                    `http://localhost:5000/api/inventory/finishedProducts/${updatedFinishedProduct._id}`,
                    updatedFinishedProduct
                  )
                  .then(() => {
                    toast.success('Finished product batch added successfully!');
                    reloadData();
                  })
                  .catch(() => toast.error('Failed to update finished product batch.'));
              } else {
                const newFinishedProduct = {
                  category,
                  product,
                  batches: [{ quantity, date: new Date().toISOString() }],
                  totalQuantity: quantity,
                };
  
                axios
                  .post('http://localhost:5000/api/inventory/finishedProducts', newFinishedProduct)
                  .then(() => {
                    toast.success('Finished product created successfully!');
                    reloadData();
                  })
                  .catch(() => toast.error('Failed to create finished product.'));
              }
            })
            .catch(() => toast.success('Checking finished product existence.'));
        }
  
        const updatedList = semiFinishedProducts.map((p) =>
          p._id === response.data._id ? response.data : p
        );
        setSemiFinishedProducts(updatedList);
        toast.success('Stage updated successfully!');
        setEditModal(false);
        reloadData();
      })
      .catch(() => toast.error('Failed to update the stage.'));
  };
  
  const filteredProducts = semiFinishedProducts.filter(
    (product) =>
      (product.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       product.product?.code?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory ? product.category._id === selectedCategory : true) &&
      (selectedProduct ? product.product._id === selectedProduct : true) &&
      (selectedStage ? product.stage.name === selectedStage : true)
  );

  const resetModalFields = () => {
    setSelectedCategory('');
    setSelectedProduct('');
    setSelectedStage('');
    setQuantity('');
  };

  return (
    <div className="semi-finished-products">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup className="search-bar w-50">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <FormControl
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <div className="filters d-flex">
          <Form.Control
            as="select"
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="mr-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </Form.Control>

          <Form.Control
            as="select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="mr-2"
            disabled={!selectedCategory}
          >
            <option value="">Select Product</option>
            {products.map((prod) => (
              <option key={prod._id} value={prod._id}>
                {prod.name}
              </option>
            ))}
          </Form.Control>

          <Form.Control
            as="select"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="mr-2"
          >
            <option value="">Select Stage</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </Form.Control>
        </div>

        <Button onClick={() => setShowModal(true)}>+ Add Product</Button>
      </div>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Current Stage</th>
            <th>Date of Entry</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((item, index) => (
            <tr key={index}>
              <td>{item.product.code || "N/A"}</td>
              <td>{item.product.name || "N/A"}</td>
              <td>{item.quantity}</td>
              <td>{item.stage.name}</td>
              <td>{new Date(item.stage.date).toLocaleDateString()}</td>
              <td className="text-center">
                <FaEdit style={{ cursor: "pointer" }} onClick={() => handleEdit(item)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => { resetModalFields(); setShowModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Add Semi-Finished Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {selectedCategory && (
              <Form.Group controlId="product">
                <Form.Label>Product</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            <Form.Group controlId="stage">
              <Form.Label>Stage</Form.Label>
              <Form.Control
                as="select"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                required
              >
                <option value="">Select a stage</option>
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Add Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Stage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleStageUpdate}>
            <Form.Group controlId="editStage">
              <Form.Label>Stage</Form.Label>
              <Form.Control
                as="select"
                value={editStage}
                onChange={(e) => setEditStage(e.target.value)}
                required
              >
                <option value="">Select a stage</option>
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Update Stage
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default SemiFinishedProducts;
