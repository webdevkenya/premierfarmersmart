import { format } from "date-fns"
import { Item } from './OrderReceipt'

interface OrderProps {
    order: {
        id: string,
        createdAt: Date,
        items: [Item],

        specific_address: string
        location: {
            name: string,
            county: string
            town: string
            shipping: number
        }

        deliveryStart: Date,
        deliveryStop: Date,
        deliveryStatus: string,
        amountPayable: number,
        amountPaid: number
    }
}

const OrderDetails = ({ order }: OrderProps) => {
    const { id, location, items, specific_address, deliveryStart, deliveryStop, amountPayable, amountPaid } = order

    return (
        <div className="bg-white p-4">
            <div>
                <h2 className="font-medium text-lg">Order #{id}</h2>
                <div className="text-xs font-light text-gray-600">
                    <div className="my-4">
                        <h3 className="font-medium text-lg">Delivery Address</h3>
                        <div className="text-gray-700">{specific_address}</div>
                        <div className="text-gray-700">{location?.name}, {location?.town}, {location?.county}</div>
                        <div className="text-gray-700">Dispatch Date: {format(+deliveryStart, 'MMM d, y | kk:m')}</div>
                        <div className="text-gray-700">Delivery Date: {format(+deliveryStop, 'MMM d, y | kk:m')}</div>
                    </div>
                </div>
            </div>
            <div className="my-4">
                <h3 className="font-medium text-lg">Items</h3>
                <ul className="text-xs font-light">
                    {items.map(item => (
                        <li className="py-2 border-b border-gray-700 grid grid-cols-4 gap-4" key={item.id}>
                            <div>{item.name}</div>
                            <div>Quantity: {item.quantity}</div>
                            <div>{`Price: KES ${item.price} / ${item.priceType}`}</div>
                            <div>Product Total: KES {item.price * item.quantity}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="text-xs font-bold text-gray-600 w-1/6">

                <div className="grid grid-cols-2">
                    <span>PAID</span>
                    <span>KES {amountPaid}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span>TOTAL</span>
                    <span>KES {amountPayable}</span>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails

