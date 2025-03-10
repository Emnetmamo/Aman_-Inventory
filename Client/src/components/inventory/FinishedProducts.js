import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, InputGroup, FormControl } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaSearch } from "react-icons/fa";

function FinishedProducts() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [manufacturingDate, setManufacturingDate] = useState("");
  const [finishedProducts, setFinishedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch initial data when the component mounts
    axios
      .get("http://localhost:5000/api/inventory/finishedProduct/categories")
      .then((response) => setCategories(response.data))
      .catch((err) => console.error(err));

    reloadFinishedProducts();

    // Poll the server every 10 seconds to refresh data
    const interval = setInterval(() => {
      reloadFinishedProducts();
    }, 1000); // 10 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedProduct(""); // Reset selected product when category changes

    axios
      .get(`http://localhost:5000/api/inventory/finishedProduct/products/${categoryId}`)
      .then((response) => setProducts(response.data))
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get the current time
    const currentTime = new Date();

    // Extract the date from the calendar input (YYYY-MM-DD)
    const date = new Date(manufacturingDate);

    // Set the time of the date to the current time
    date.setHours(currentTime.getHours());
    date.setMinutes(currentTime.getMinutes());
    date.setSeconds(currentTime.getSeconds());
    date.setMilliseconds(currentTime.getMilliseconds());

    // Convert to ISO string with date and time
    const manufacturingDateWithTime = date.toISOString(); // This will now have both date and time

    const newProduct = {
      category: selectedCategory,
      product: selectedProduct,
      quantity: parseInt(quantity),
      manufacturingDate: manufacturingDateWithTime, // Send the full date-time
    };

    axios
      .post("http://localhost:5000/api/inventory/finishedProduct", newProduct)
      .then((response) => {
        toast.success("Finished product added successfully!");
        setShowModal(false);
        resetForm();

        // Update finishedProducts locally for instant UI update
        const updatedProduct = response.data; // Assuming the backend returns the created product
        const updatedList = [...finishedProducts];
        const existingIndex = updatedList.findIndex(
          (item) => item.product?._id === updatedProduct.product?._id
        );

        if (existingIndex > -1) {
          // Update the existing product's quantity
          updatedList[existingIndex].totalQuantity += updatedProduct.quantity;
        } else {
          // Add new product
          updatedList.push({
            product: updatedProduct.product,
            totalQuantity: updatedProduct.quantity,
          });
        }

        setFinishedProducts(updatedList);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add finished product.");
      });
  };

  const reloadFinishedProducts = () => {
    axios
      .get("http://localhost:5000/api/inventory/finishedProduct")
      .then((response) => {
        // Map over products and calculate totalQuantity
        const updatedProducts = response.data.map((product) => {
          product.totalQuantity = product.batch.reduce(
            (total, batch) => total + batch.quantity,
            0
          );

          // Ensure that the batch dates are parsed as Date objects and sort by the exact datetime
          product.batch.sort((a, b) => {
            const batchA = new Date(a.date).getTime();
            const batchB = new Date(b.date).getTime();
            return batchB - batchA; // Most recent batch first
          });

          return product;
        });

        // Sort the products based on the most recent batch date and time
        updatedProducts.sort((a, b) => {
          const latestBatchA = a.batch[0] ? new Date(a.batch[0].date).getTime() : 0;
          const latestBatchB = b.batch[0] ? new Date(b.batch[0].date).getTime() : 0;
          return latestBatchB - latestBatchA; // Most recent first
        });

        setFinishedProducts(updatedProducts);
      })
      .catch((err) => console.error(err));
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedProduct("");
    setQuantity("");
    setManufacturingDate("");
  };

  // Filter based on category and product selection
  const filteredProducts = finishedProducts.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category?._id === selectedCategory
      : true;
    const matchesProduct = selectedProduct
      ? product.product?._id === selectedProduct
      : true;
    const productName = product?.product?.name?.toLowerCase() || "";
    const productCode = product?.product?.code?.toLowerCase() || "";
    const matchesSearchQuery =
      productName.includes(searchQuery.toLowerCase()) ||
      productCode.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesProduct && matchesSearchQuery;
  });

  return (
    <div className="finished-products">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <FormControl
            placeholder="Search by Code or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <div className="d-flex">
          <Form.Select
            className="me-2"
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            className="me-2"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </Form.Select>
        </div>

        <Button onClick={() => setShowModal(true)}>+ Add Finished Product</Button>
      </div>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((item, index) => (
            <tr key={index}>
              <td>{item.product?.code || "N/A"}</td>
              <td>{item.product?.name || "N/A"}</td>
              <td>{item.totalQuantity || 0}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Finished Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select onChange={(e) => handleCategorySelect(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                disabled={!selectedCategory}
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Manufacturing Date</Form.Label>
              <Form.Control
                type="date"
                value={manufacturingDate}
                onChange={(e) => setManufacturingDate(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default FinishedProducts;
