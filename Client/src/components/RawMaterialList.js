import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Form, Row, Col, InputGroup, Popover, OverlayTrigger } from 'react-bootstrap';
import { FaSearch, FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Layout from '../components/Layout';
import Swal from "sweetalert2";

function RawMaterialList() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ name: '', price: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [editMaterial, setEditMaterial] = useState({ name: '', price: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activePopoverIndex, setActivePopoverIndex] = useState(null);
  const popoverRef = useRef();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('https://amaninventoryserver.vercel.app/api/raw-materials').then((res) => {
      setRawMaterials(res.data.reverse());
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setActivePopoverIndex(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const addRawMaterial = () => {
    const duplicateMaterial = rawMaterials.find(
      (material) => material.name.toLowerCase() === newMaterial.name.toLowerCase()
    );

    if (duplicateMaterial) {
      toast.error('Raw material already exists.', { autoClose: 3000 });
      return;
    }

    axios
      .post('https://amaninventoryserver.vercel.app/api/raw-materials', newMaterial)
      .then((res) => {
        setRawMaterials([res.data, ...rawMaterials]);
        setNewMaterial({ name: '', price: '' });
        toast.success('Material added successfully!', { autoClose: 3000 });
      })
      .catch((error) => {
        toast.error('Error adding material.', { autoClose: 3000 });
      });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditMaterial(rawMaterials[index]);
  };

  const handleSave = (index) => {
    const material = rawMaterials[index];
    axios
      .put(`https://amaninventoryserver.vercel.app/api/raw-materials/${material._id}`, editMaterial)
      .then((res) => {
        const updatedMaterials = [...rawMaterials];
        updatedMaterials[index] = res.data;
        setRawMaterials(updatedMaterials);
        setEditIndex(null);
        setEditMaterial({ name: '', price: '' });
        toast.success('Material updated successfully!', { autoClose: 3000 });
      })
      .catch(() => {
        toast.error('Error updating material.', { autoClose: 3000 });
      });
  };

  const handleDelete = (id, index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://amaninventoryserver.vercel.app/api/raw-materials/${id}`)
          .then(() => {
            setRawMaterials(rawMaterials.filter((_, i) => i !== index));
            Swal.fire("Deleted!", "Your material has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Error!", "There was an issue deleting the material.", "error");
          });
      }
    });
  };
  

  const filteredMaterials = rawMaterials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popover = (index, material) => (
    <Popover id={`popover-${index}`} ref={popoverRef}>
      <Popover.Body>
        <div className="d-flex justify-content-between">
          <Button variant="link" onClick={() => handleEdit(index)}>
            <FaEdit /> Edit
          </Button>
          <Button variant="link" onClick={() => handleDelete(material._id, index)} className="text-danger">
            <FaTrash /> Delete
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  );

  const handlePopoverToggle = (index) => {
    if (activePopoverIndex === index) {
      setActivePopoverIndex(null);
    } else {
      setActivePopoverIndex(index);
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div id="raw-materials">
        <h3>Raw Materials</h3>

        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search Raw Material"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Form className="mb-3">
          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="Raw Material"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                min="0"
                placeholder="Price (br/kg)"
                value={newMaterial.price}
                onChange={(e) => setNewMaterial({ ...newMaterial, price: e.target.value })}
              />
            </Col>
            <Col>
              <Button className="add-button" onClick={addRawMaterial}>
                Add
              </Button>
            </Col>
          </Row>
        </Form>

        <Table striped bordered hover className="table-hover mt-3">
          <thead>
            <tr>
              <th>Code</th>
              <th>Raw Material</th>
              <th>Material cost per Kg (br/kg)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map((material, index) => (
              <tr key={index}>
                <td>{material.code}</td>
                <td>
                  {editIndex === index ? (
                    <Form.Control
                      type="text"
                      value={editMaterial.name}
                      onChange={(e) => setEditMaterial({ ...editMaterial, name: e.target.value })}
                    />
                  ) : (
                    material.name
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <Form.Control
                      type="number"
                      value={editMaterial.price}
                      min="0"
                      onChange={(e) => setEditMaterial({ ...editMaterial, price: e.target.value })}
                    />
                  ) : (
                    material.price
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <>
                      <Button onClick={() => handleSave(index)}>Save</Button>
                      <Button variant="secondary" onClick={() => setEditIndex(null)} style={{ marginLeft: '10px' }}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        overlay={popover(index, material)}
                        show={activePopoverIndex === index}
                      >
                        <Button
                          variant="link"
                          className="text-success"
                          onClick={() => handlePopoverToggle(index)}
                        >
                          <FaChevronDown />
                        </Button>
                      </OverlayTrigger>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Layout>
  );
}

export default RawMaterialList;
