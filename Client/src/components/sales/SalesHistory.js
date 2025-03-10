import React, { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup, Dropdown, Pagination } from "react-bootstrap";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const SalesHistory = () => {
  const [sales, setSales] = useState([
    { id: 1, product: "Shampoo", quantity: 10, price: 5, date: "2024-02-01", status: "Sold" },
    { id: 2, product: "Vaseline", quantity: 5, price: 3, date: "2024-02-03", status: "Pending" },
    { id: 3, product: "Hair Food", quantity: 8, price: 7, date: "2024-02-05", status: "Sold" },
  ]);
  const [filteredSales, setFilteredSales] = useState(sales);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    let filtered = sales.filter((sale) =>
      sale.product.toLowerCase().includes(search.toLowerCase())
    );
    if (filterStatus !== "All") {
      filtered = filtered.filter((sale) => sale.status === filterStatus);
    }
    setFilteredSales(filtered);
  }, [search, filterStatus, sales]);

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredSales);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SalesHistory");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Sales_History.xlsx");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Sales History</h2>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by Product Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Dropdown onSelect={(e) => setFilterStatus(e)}>
          <Dropdown.Toggle variant="secondary">{filterStatus}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="Sold">Sold</Dropdown.Item>
            <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="success" onClick={exportToCSV}>Export</Button>
      </InputGroup>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale, index) => (
            <tr key={sale.id}>
              <td>{index + 1}</td>
              <td>{sale.product}</td>
              <td>{sale.quantity}</td>
              <td>${sale.price}</td>
              <td>${sale.quantity * sale.price}</td>
              <td>{sale.date}</td>
              <td style={{ color: sale.status === "Sold" ? "green" : "orange" }}>
                {sale.status}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.Prev disabled />
        <Pagination.Item active>1</Pagination.Item>
        <Pagination.Next disabled />
      </Pagination>
    </div>
  );
};

export default SalesHistory;