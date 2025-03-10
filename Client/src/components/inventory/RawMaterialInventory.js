import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa'; // Search Icon import
import { toast, ToastContainer } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import '../../App.css';

function RawMaterialInventory() {
  const navigate = useNavigate();
  const [rawMaterials, setRawMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState({
    name: '', 
    quantity: 0, 
    date: '', 
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch raw materials from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/raw-materials')
      .then(response => setRawMaterials(response.data.reverse()))
      .catch(error => console.error('Error fetching raw materials:', error));
  }, []);

  // Function to open the modal for updating raw material
  const handleAddMaterial = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedMaterial({ name: '', quantity: 0, date: '' });
  };

  // Function to handle form submission for updating material
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (selectedMaterial.name === '' || selectedMaterial.quantity <= 0 || selectedMaterial.date === '') return;
  
    const updatedMaterial = {
      ...selectedMaterial,
      purchases: [...selectedMaterial.purchases, { quantity: selectedMaterial.quantity, purchaseDate: selectedMaterial.date }], 
    };
  
    try {
      const materialToUpdate = rawMaterials.find(material => material.name === selectedMaterial.name);
      if (materialToUpdate) {
        // Send PUT request to update the raw material
        await axios.put(`http://localhost:5000/api/inventory/raw-materials/${materialToUpdate._id}`, updatedMaterial);
  
        // Fetch updated raw materials after successful update
        const response = await axios.get('http://localhost:5000/api/raw-materials');
        setRawMaterials(response.data);

        // Show success toast
        toast.success("Raw Material updated successfully!");
      }
    } catch (error) {
      console.error('Error while submitting material update:', error);
      // Show error toast
      toast.error("Failed to update Raw Material. Try again!");
    }
  
    handleModalClose();
  };

  // Calculate total quantity for each material
  const calculateTotalQuantity = (purchases) => {
    return purchases.reduce((total, purchase) => total + purchase.quantity, 0);
  };

  // Format date to display as 'Dec 2, 2024'
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  // Handle material selection to auto-fill details
  const handleMaterialSelection = (selectedName) => {
    const selectedMaterial = rawMaterials.find(material => material.name === selectedName);
    setSelectedMaterial({
      ...selectedMaterial,
      quantity: 0,
      date: '',
    });
  };

  // Filter raw materials based on search query
  const filteredMaterials = rawMaterials.filter(material => 
    material.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If no materials match the search, display a "no results" message
  const noResults = filteredMaterials.length === 0;

  // Sort raw materials by latest purchase date (latest first)
  const sortedMaterials = filteredMaterials.map((material) => ({
    ...material,
    purchases: material.purchases.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
  }));

  // Inline styles for the table and rows
  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse', // Ensures that table borders merge into one
  };

  const headerCellStyles = {
    padding: '10px',
    textAlign: 'left',
    border: '1px solid #ddd', // Border for headers
    backgroundColor: '#343a40', // Light background for header
  };

  const rowStyles = {
    borderBottom: '2px solid #ddd', // Light gray line between rows
  };

  const cellStyles = {
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ddd', // Border for each cell
  };

  return (
    <div className="raw-materials-page">
      <div className="d-flex justify-content-between mb-4">
        <InputGroup className="w-25">
          <InputGroup.Text>
            <FaSearch /> {/* Search Icon */}
          </InputGroup.Text>
          <FormControl
            placeholder="Search by material name"
            aria-label="Search by material name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <Button className="add-button" onClick={handleAddMaterial}>+ Update Raw Material</Button>
      </div>

      {/* Display no results message if no materials match the search */}
      {noResults && <div className="alert alert-warning">No raw materials found</div>}

      <div className="table-container">
        <table className="table table-hover" style={tableStyles}>
          <thead>
            <tr>
              <th style={headerCellStyles}>Code</th>
              <th style={headerCellStyles}>Name</th>
              <th style={headerCellStyles}>Unit Price ($)</th>
              <th style={headerCellStyles}>Quantity (kg)</th>
              <th style={headerCellStyles}>Purchase Date</th>
              <th style={headerCellStyles}>Total Quantity (kg)</th>
            </tr>
          </thead>
          <tbody>
            {sortedMaterials.map((material) => (
              <tr key={material._id} style={rowStyles}>
                <td style={cellStyles}>{material.code}</td>
                <td style={cellStyles}>{material.name}</td>
                <td style={cellStyles}>{material.price}</td>
                <td style={cellStyles}>
                  {material.purchases.map((purchase, index) => (
                    <div key={index}>{purchase.quantity} kg</div>
                  ))}
                </td>
                <td style={cellStyles}>
                  {material.purchases.map((purchase, index) => (
                    <div key={index}>{formatDate(purchase.purchaseDate)}</div>
                  ))}
                </td>
                <td style={cellStyles}>{calculateTotalQuantity(material.purchases)} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bootstrap Modal for updating raw material */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Raw Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="existingMaterial">
              <Form.Label>Select Material</Form.Label>
              <Form.Control
                as="select"
                value={selectedMaterial.name}
                onChange={(e) => handleMaterialSelection(e.target.value)}
              >
                <option value="">Select a material</option>
                {rawMaterials.map((material, index) => (
                  <option key={index} value={material.name}>{material.name}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="quantity">
              <Form.Label>Quantity (kg)</Form.Label>
              <Form.Control
                type="number"
                value={selectedMaterial.quantity}
                onChange={(e) => setSelectedMaterial({ ...selectedMaterial, quantity: +e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="date">
              <Form.Label>Purchase Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedMaterial.date}
                onChange={(e) => setSelectedMaterial({ ...selectedMaterial, date: e.target.value })}
                required
              />
            </Form.Group>

            <div className="modal-actions">
              <Button variant="primary" type="submit">Submit</Button>
              <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ToastContainer to show notifications */}
      <ToastContainer />
    </div>
  );
}

export default RawMaterialInventory;
