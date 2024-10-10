import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './sale.css'; // Import your CSS for styling

const Daily = () => {
    const [dailySales, setDailySales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

   
        useEffect(() => {
            fetch("/api/getDsales", { method: "GET" })
                .then(res => res.json())
                .then(res => {
                    setDailySales(res);
                });
        }, []);
    

    

    return (
        <div>
            <h1>Daily Sales Data</h1>
            <table className="sale-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Total Sale</th>
                        <th>Profit</th>
                        <th>Expense</th>
                    </tr>
                </thead>
                <tbody>
                    {dailySales.map((sale) => (
                        <tr key={sale._id}>
                            <td>{new Date(sale.Date).toLocaleDateString()}</td>
                            <td>${sale.TotalSale}</td>
                            <td>${sale.TotalProfit}</td>
                            <td>${sale.Expense}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Daily;
