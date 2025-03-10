import React, { useState } from 'react';
import { FaTrashAlt, FaBox, FaTag } from 'react-icons/fa';
import '../../CSS/OrderPage.css';

const OrderPage = () => {
  const [formData, setFormData] = useState({
    customer: '',
    tin: '',
    date: new Date().toISOString().split('T')[0],
    product: {
      category: '',
      product: '',
      quantity: ''
    },
    orderSummary: []
  });

  const [customers] = useState([
    { _id: '1', customerName: 'Customer A', tinNumber: '123456' },
    { _id: '2', customerName: 'Customer B', tinNumber: '789012' }
  ]);

  const [categories] = useState([
    { _id: '1', name: 'Category A' },
    { _id: '2', name: 'Category B' }
  ]);

  const [products, setProducts] = useState([]);

  const handleCategorySelect = (categoryId) => {
    setFormData({ ...formData, product: { ...formData.product, category: categoryId, product: '' } });
    
    const availableProducts = categoryId === '1'
      ? [{ _id: '1', name: 'Product A1' }, { _id: '2', name: 'Product A2' }]
      : [{ _id: '3', name: 'Product B1' }, { _id: '4', name: 'Product B2' }];

    setProducts(availableProducts);
  };

  const handleProductChange = (e, field) => {
    setFormData({
      ...formData,
      product: { ...formData.product, [field]: e.target.value }
    });
  };

  const addProduct = () => {
    if (formData.product.category && formData.product.product && formData.product.quantity) {
      const category = categories.find(cat => cat._id === formData.product.category);
      const product = products.find(prod => prod._id === formData.product.product);
  
      setFormData({
        ...formData,
        orderSummary: [
          ...formData.orderSummary,
          {
            category: category ? category.name : 'Unknown Category',
            product: product ? product.name : 'Unknown Product',
            quantity: formData.product.quantity,
            id: formData.orderSummary.length + 1
          }
        ],
        product: { category: '', product: '', quantity: '' }
      });
    } else {
      alert('Please fill in all the product details');
    }
  };

  const deleteProduct = (id) => {
    const filteredOrderSummary = formData.orderSummary.filter(item => item.id !== id);
    setFormData({ ...formData, orderSummary: filteredOrderSummary });
  };

  const handleCustomerSelect = (e) => {
    const selectedCustomer = customers.find(customer => customer._id === e.target.value);
    setFormData({
      ...formData,
      customer: selectedCustomer._id,
      tin: selectedCustomer.tinNumber
    });
  };

  return (
    <div className="order-container">
      <h2 className="order-title">Place Your Order</h2>
      <form className="order-form">
        <div className="order-left">
          <div className="form-group">
            <label className="form-label">Customer</label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleCustomerSelect}
              className="form-control"
              required
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  {customer.customerName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">TIN</label>
            <input type="text" value={formData.tin} readOnly className="form-control" />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={formData.product.category}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="form-control"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Product</label>
            <select
              value={formData.product.product}
              onChange={(e) => handleProductChange(e, 'product')}
              disabled={!formData.product.category}
              className="form-control"
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              value={formData.product.quantity}
              onChange={(e) => handleProductChange(e, 'quantity')}
              className="form-control"
              required
            />
          </div>

          <button type="button" onClick={addProduct} className="add-product-btn">
            Add Product
          </button>
        </div>

        <div className="order-right">
          <h3>Order Summary</h3>
          <div className="order-summary">
            {formData.orderSummary.map((item) => (
              <div key={item.id} className="order-summary-item">
                <div className="order-summary-item-detail">
                  <FaTag /> <span><strong>Category:</strong> {item.category}</span>
                </div>
                <div className="order-summary-item-detail">
                  <FaBox /> <span><strong>Product:</strong> {item.product}</span>
                </div>
                <div className="order-summary-item-detail">
                  <span><strong>Quantity:</strong> {item.quantity}</span>
                </div>
                <button type="button" onClick={() => deleteProduct(item.id)} className="delete-btn">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderPage;