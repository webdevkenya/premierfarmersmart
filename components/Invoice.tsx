import React from 'react';

const Invoice = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium">Invoice #123</div>
                <div className="text-gray-600">01/01/2021</div>
            </div>
            <div className="mb-4">
                <div className="text-gray-600">From:</div>
                <div className="text-lg font-medium">Your Company</div>
                <div>123 Main St</div>
                <div>Anytown, USA</div>
            </div>
            <div className="mb-4">
                <div className="text-gray-600">To:</div>
                <div className="text-lg font-medium">Customer</div>
                <div>456 Elm St</div>
                <div>Othertown, USA</div>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="text-gray-600">Item</th>
                        <th className="text-gray-600">Quantity</th>
                        <th className="text-gray-600">Price</th>
                        <th className="text-gray-600">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Product A</td>
                        <td>2</td>
                        <td>$10.00</td>
                        <td>$20.00</td>
                    </tr>
                    <tr>
                        <td>Product B</td>
                        <td>1</td>
                        <td>$5.00</td>
                        <td>$5.00</td>
                    </tr>
                </tbody>
            </table>
            <div className="flex items-center justify-between mt-4">
                <div>
                    <div className="text-gray-600">Subtotal</div>
                    <div className="text-lg font-medium">$25.00</div>
                </div>
                <div>
                    <div className="text-gray-600">Tax</div>
                    <div className="text-lg font-medium">$2.50</div>
                </div>
                <div>
                    <div className="text-gray-600">Total</div>
                    <div className="text-lg font-medium">$27.50</div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
