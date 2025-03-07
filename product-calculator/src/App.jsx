// App.jsx
import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [fees, setFees] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', amount: '' });
  const [newFee, setNewFee] = useState({ name: '', cost: '' });
  const [percentageIncrease, setPercentageIncrease] = useState(0);
  const [manualPercentage, setManualPercentage] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedFees = localStorage.getItem('fees');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedFees) setFees(JSON.parse(savedFees));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('fees', JSON.stringify(fees));
  }, [products, fees]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.amount) return;

    const price = parseFloat(newProduct.price);
    const amount = parseInt(newProduct.amount);
    const total = price * amount;

    setProducts([...products, { ...newProduct, price, amount, total }]);
    setNewProduct({ name: '', price: '', amount: '' });
  };

  const handleAddFee = (e) => {
    e.preventDefault();
    if (!newFee.name || !newFee.cost) return;

    setFees([...fees, { ...newFee, cost: parseFloat(newFee.cost) }]);
    setNewFee({ name: '', cost: '' });
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const removeFee = (index) => {
    setFees(fees.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const totalProductCost = products.reduce((acc, product) => acc + product.total, 0);
    const totalFees = fees.reduce((acc, fee) => acc + fee.cost, 0);
    const grandTotal = totalProductCost + totalFees;
    
    const increase = ((grandTotal - totalProductCost) / totalProductCost) * 100;
    setPercentageIncrease(increase);
    setManualPercentage(increase.toFixed(2));
  };

  const handlePercentageChange = (e) => {
    const value = e.target.value;
    setManualPercentage(value);
    if (!isNaN(value) && value !== '') {
      setPercentageIncrease(parseFloat(value));
    }
  };

  const getNewPrices = () => {
    return products.map(product => {
      const newPrice = product.price + (product.price * percentageIncrease) / 100;
      const newTotal = newPrice * product.amount;
      return { ...product, newPrice, newTotal };
    });
  };

  const exportToCSV = () => {
    const newPrices = getNewPrices();
    const headers = ['Product', 'New Price', 'Amount', 'New Total'];
    const data = newPrices.map(product => [
      product.name,
      product.newPrice.toFixed(2),
      product.amount,
      product.newTotal.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'new_prices.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setProducts([]);
    setFees([]);
    setPercentageIncrease(0);
    setManualPercentage('');
  };

  const totalProductCost = products.reduce((acc, product) => acc + product.total, 0);
  const totalFees = fees.reduce((acc, fee) => acc + fee.cost, 0);
  const grandTotal = totalProductCost + totalFees;

  return (
    <div className="app">
      <div className="header">
        <h1>Product Calculator</h1>
        <button className="reset-button" onClick={reset}>Reset All</button>
      </div>

      <div className="content-wrapper">
        <div className="forms-container">
          <form onSubmit={handleAddProduct} className="input-form">
            <h2>Add Product</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                step="0.01"
                min="0"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount"
                min="0"
                value={newProduct.amount}
                onChange={(e) => setNewProduct({ ...newProduct, amount: e.target.value })}
              />
            </div>
            <button type="submit" className="submit-button">Add Product</button>
          </form>

          <form onSubmit={handleAddFee} className="input-form">
            <h2>Add Fee</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="Fee Name"
                value={newFee.name}
                onChange={(e) => setNewFee({ ...newFee, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Cost"
                step="0.01"
                min="0"
                value={newFee.cost}
                onChange={(e) => setNewFee({ ...newFee, cost: e.target.value })}
              />
            </div>
            <button type="submit" className="submit-button">Add Fee</button>
          </form>
        </div>

        <div className="lists-container">
          <div className="list-section">
            <h2>Products</h2>
            <div className="items-list">
              {products.map((product, index) => (
                <div key={index} className="list-item">
                  <span className="item-details">
                    <strong>{product.name}</strong>
                    <span className="price-details">
                      ${product.price.toFixed(2)} x {product.amount} = ${product.total.toFixed(2)}
                    </span>
                  </span>
                  <button onClick={() => removeProduct(index)} className="remove-button">Remove</button>
                </div>
              ))}
            </div>
            <div className="total">Total Product Cost: ${totalProductCost.toFixed(2)}</div>
          </div>

          <div className="list-section">
            <h2>Fees</h2>
            <div className="items-list">
              {fees.map((fee, index) => (
                <div key={index} className="list-item">
                  <span className="item-details">
                    <strong>{fee.name}</strong>
                    <span className="price-details">${fee.cost.toFixed(2)}</span>
                  </span>
                  <button onClick={() => removeFee(index)} className="remove-button">Remove</button>
                </div>
              ))}
            </div>
            <div className="total">Total Fees: ${totalFees.toFixed(2)}</div>
          </div>
        </div>

        <div className="calculations-section">
          <div className="grand-total">Grand Total: ${grandTotal.toFixed(2)}</div>
          
          <div className="percentage-controls">
            <button onClick={calculateTotals} className="calculate-button">
              Calculate Percentage
            </button>
            
            <div className="percentage-input-group">
              <input
                type="number"
                step="0.01"
                value={manualPercentage}
                onChange={handlePercentageChange}
                placeholder="Enter percentage"
                className="percentage-input"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
        </div>

        {products.length > 0 && percentageIncrease > 0 && (
          <div className="new-prices-section">
            <h2>New Prices</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>New Price</th>
                    <th>Amount</th>
                    <th>New Total</th>
                  </tr>
                </thead>
                <tbody>
                  {getNewPrices().map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>${product.newPrice.toFixed(2)}</td>
                      <td>{product.amount}</td>
                      <td>${product.newTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={exportToCSV} className="export-button">Export to CSV</button>
          </div>
        )}
      </div>
    </div>
  );
}