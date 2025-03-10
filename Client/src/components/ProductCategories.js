import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Modal, InputGroup } from 'react-bootstrap';
import { FaTrash, FaSearch } from 'react-icons/fa';
import Layout from './Layout';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    rawMaterials: [{ rawMaterial: '', weightPercent: '', costPerKg: 0 }],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [rawMaterialsData, setRawMaterialsData] = useState([]);
  const [totalWeightPercent, setTotalWeightPercent] = useState(0);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        const response = await axios.get('https://amaninventoryserver.vercel.app/api/raw-materials');
        setRawMaterialsData(response.data);
      } catch (error) {
        console.error('Error fetching raw materials:', error);
      }
    };

    fetchRawMaterials();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://amaninventoryserver.vercel.app/api/product-categories');
        // Sort categories by latest first, assuming each category has a `createdAt` timestamp
        const sortedCategories = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []);
  

  const addCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Please enter a product category name.');
      return;
    }
  
    // Check for duplicate category name
    const isDuplicateName = categories.some(
      (category) => category.name.toLowerCase() === newCategory.name.toLowerCase().trim()
    );
    if (isDuplicateName) {
      toast.warning('A category with this name already exists. Please choose a different name.');
      return;
    }
  
    for (let i = 0; i < newCategory.rawMaterials.length; i++) {
      const material = newCategory.rawMaterials[i];
      if (!material.rawMaterial.trim()) {
        toast.error(`Please select a raw material for entry #${i + 1}.`);
        return;
      }
      if (!material.weightPercent || material.weightPercent <= 0) {
        toast.error(`Please enter a valid weight percent for entry #${i + 1}.`);
        return;
      }
    }
  
    const totalWeight = calculateTotalWeightPercent();
    if (totalWeight !== 100) {
      toast.warning('The total weight percent must be exactly 100% before saving the category.');
      return;
    }
  
    const categoryId = String(categories.length + 1).padStart(2, '0');
    const newCategoryWithDate = { ...newCategory, id: categoryId, createdAt: new Date().toISOString() };
  
    try {
      await axios.post('https://amaninventoryserver.vercel.app/api/product-categories', newCategoryWithDate);
      setCategories([newCategoryWithDate, ...categories]); // Insert at the top
      setNewCategory({ id: '', name: '', rawMaterials: [{ rawMaterial: '', weightPercent: '', costPerKg: 0 }] });
      setShowModal(false);
      setTotalWeightPercent(0);
      toast.success('Product category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add product category. Please try again.');
    }
  };
  

  

  
  const calculateCostPerKg = (index) => {
    const material = newCategory.rawMaterials[index];
    const selectedMaterial = rawMaterialsData.find(rm => rm.name === material.rawMaterial);
    if (selectedMaterial) {
      const costPerKg = ((material.weightPercent / 100) * selectedMaterial.price).toFixed(2);
      const updatedMaterials = [...newCategory.rawMaterials];
      updatedMaterials[index].costPerKg = parseFloat(costPerKg);
      setNewCategory({ ...newCategory, rawMaterials: updatedMaterials });
    }
  };
  

  const calculateTotalCost = (rawMaterials) => {
    const totalCost = rawMaterials.reduce((total, material) => {
      const selectedMaterial = rawMaterialsData.find(rm => rm.name === material.rawMaterial);
      if (selectedMaterial) {
        const cost = (material.weightPercent / 100) * selectedMaterial.price;
        return total + cost;
      }
      return total;
    }, 0);
    return parseFloat(totalCost.toFixed(2));
  };
  

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...newCategory.rawMaterials];
    const numericValue = parseFloat(value) || 0;
  
    if (field === 'rawMaterial') {
      const isDuplicate = updatedMaterials.some(
        (material, idx) => material.rawMaterial === value && idx !== index
      );
      if (isDuplicate) {
        toast.warning('This raw material has already been selected. Please choose another.', { autoClose: 3000 });
        return;
      }
    }
  
    if (field === 'weightPercent') {
      const currentTotal = totalWeightPercent - parseFloat(updatedMaterials[index].weightPercent || 0);
      const newTotal = currentTotal + numericValue;
  
      if (newTotal > 100) {
        toast.warning('The total weight percent cannot exceed 100%. Please adjust the values.', {autoClose:3000});
        return;
      }
  
      setTotalWeightPercent(newTotal);
    }
  
    updatedMaterials[index][field] = value;
  
    if (field === 'weightPercent' || field === 'rawMaterial') {
      const material = updatedMaterials[index];
      const selectedMaterial = rawMaterialsData.find(rm => rm.name === material.rawMaterial);
      if (selectedMaterial) {
        material.costPerKg = parseFloat(((material.weightPercent / 100) * selectedMaterial.price).toFixed(2));
      } else {
        material.costPerKg = 0;
      }
    }
  
    setNewCategory({ ...newCategory, rawMaterials: updatedMaterials });
  };
  
  const calculateTotalWeightPercent = () => {
    return newCategory.rawMaterials.reduce((total, material) => {
      return total + parseFloat(material.weightPercent || 0);
    }, 0);
  };
  
  
  const addNewMaterial = () => {
    const totalWeightPercent = calculateTotalWeightPercent();
  
    if (totalWeightPercent >= 100) {
      toast.warning('The total weight percentage has reached 100%. You cannot add more raw materials.', {autoClose:3000} );
      return;
    }
  
    setNewCategory({
      ...newCategory,
      rawMaterials: [...newCategory.rawMaterials, { rawMaterial: '', weightPercent: '', costPerKg: 0 }],
    });
  };
  

  const deleteMaterial = (index) => {
    const updatedMaterials = newCategory.rawMaterials.filter((_, i) => i !== index);
    setNewCategory({ ...newCategory, rawMaterials: updatedMaterials });
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeModal = () => {
    setShowModal(false);
    setNewCategory({ id: '', name: '', rawMaterials: [{ rawMaterial: '', weightPercent: '', costPerKg: 0 }] });
    setTotalWeightPercent(0); // Reset the total weight percent when modal is closed
  };

  return (
    <Layout>
    <div id="raw-materials">
        <div id="categories">
          <h3>Product Categories</h3>
          <div className="d-flex justify-content-between mb-3">
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
                <Button onClick={() => setShowModal(true)}>+ Add New Product Category</Button>
              </Col>
            </Row>
          </div>

          <Modal show={showModal} onHide={closeModal} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Add New Product Category</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Row>
        <Col md={6}>
          <Form.Group controlId="formCategoryName">
            <Form.Label>Product Category Name</Form.Label>
            <Form.Control
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Row>

      <h5>
        Raw Materials{' '}
        <span style={{ fontWeight: 'normal', color: totalWeightPercent >= 100 ? 'red' : 'green' }}>
          (Remaining Weight Percent: {100 - totalWeightPercent}%)
        </span>
      </h5>

      {newCategory.rawMaterials.map((material, index) => (
        <Row key={index} className="align-items-center">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Raw Material</Form.Label>
              <Form.Select
                value={material.rawMaterial}
                onChange={(e) => handleMaterialChange(index, 'rawMaterial', e.target.value)}
              >
                <option value="">Select Raw Material</option>
                {rawMaterialsData.map((rm, idx) => (
                  <option key={idx} value={rm.name}>
                    {rm.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Weight Percent</Form.Label>
              <Form.Control
                type="number"
                value={material.weightPercent}
                min="0"
                onChange={(e) => handleMaterialChange(index, 'weightPercent', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Cost per Kg</Form.Label>
              <Form.Control type="number" value={material.costPerKg.toFixed(2)} readOnly />
            </Form.Group>
          </Col>
          <Col md={2} className="text-end d-flex justify-content-around align-items-center mt-3">
            <Button variant="danger" size="sm" onClick={() => deleteMaterial(index)}>
              <FaTrash />
            </Button>
          </Col>
        </Row>
      ))}

      <Row className="mt-3">
        <Col className="text-end">
          <Button variant="secondary" onClick={addNewMaterial}>
            Add More Raw Material
          </Button>
        </Col>
      </Row>
    </Form>
  </Modal.Body>
  <Modal.Footer>
      <div className="total-cost">
      Total Cost per Kg: {calculateTotalCost(newCategory.rawMaterials).toFixed(2)} ETB
      </div>
    <Button variant="secondary" onClick={closeModal}>
      Cancel
    </Button>
    <Button variant="primary" onClick={addCategory}>
      Save Category
    </Button>
  </Modal.Footer>
</Modal>

          <Table bordered >
          <thead>
            <tr>
              <th>Category ID</th>
              <th>Name</th>
              <th>Raw Materials</th>
              <th>Weight Percent</th>
              <th>Cost per Kg of Product</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => {
              const totalCost = calculateTotalCost(category.rawMaterials); // Calculate total cost for each category
              const rowCount = category.rawMaterials.length; // Number of rows based on raw materials

              return (
                <>
                  {category.rawMaterials.map((material, index) => (
                    <tr key={index}>
                      {index === 0 && ( // Only render these cells in the first row for the category
                        <>
                          <td rowSpan={rowCount}>{category.id}</td>
                          <td rowSpan={rowCount}>{category.name}</td>
                        </>
                      )}
                      <td>{material.rawMaterial}</td>
                      <td>{material.weightPercent}</td>
                      <td>{material.costPerKg}</td>
                      {index === 0 && ( // Only render total cost in the first row
                        <td rowSpan={rowCount}>{totalCost.toFixed(2)}</td>
                      )}
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </Table>
        </div>
        <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
/>

    </div>
     </Layout>
  );
}

export default ProductCategories;
