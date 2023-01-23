import { useEffect } from 'react'
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { gql, useQuery } from '@apollo/client';
import { useShippingAddress } from '../contexts/AddressContext'

export const GetCartTotalQuery = gql`
	query GetCartTotal  {
		cartTotal
	}
`;

export const GetShippingQuery = gql`
	query GetShipping($id:String!){
		getShipping(id: $id) 
	}
`;

const CartQuery = gql`
	query CartQuery {
		cart{
			id
			items {	
				id
				product{
				name
				image,
				price,
				price_type,
				}
				productTotal
				quantity
			}
		}
	}
`;


const OrderSummary = () => {

	//	const { items, getTotal, shipping, amountPayable } = useShoppingCart();
	const { address } = useShippingAddress()
	const { data: cartData } = useQuery(CartQuery)
	const { data: cartTotalData } = useQuery(GetCartTotalQuery)
	const { data: shippingData }
		= useQuery(GetShippingQuery, {
			variables: {
				id: address
			}
		})
	console.log('shippingData', shippingData);

	return (
		<div className="w-full mt-6 px-4">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">
				Order Summary
			</h1>
			<table className="w-full text-left table-collapse">
				<thead>
					<tr>
						<th className="text-sm font-semibold text-gray-700 p-2 bg-gray-100">
							Product
						</th>
						<th className="text-right text-sm font-semibold text-gray-700 p-2 bg-gray-100">
							Price
						</th>
						<th className="text-right text-sm font-semibold text-gray-700 p-2 bg-gray-100">
							Quantity
						</th>
						<th className="text-right text-sm font-semibold text-gray-700 p-2 bg-gray-100">
							Product Total
						</th>
					</tr>
				</thead>
				<tbody>
					{cartData?.cart.items.map(
						({ id, product: { name, price }, quantity, productTotal }) => (
							<tr key={id}>
								<td className="p-2 text-gray-700">{name}</td>
								<td className="text-right p-2 text-gray-700">
									{`kES ${price}`}
								</td>
								<td className="text-right p-2 text-gray-700">
									{quantity}
								</td>
								<td className="text-right p-2 text-gray-700">{`KES ${productTotal}`}</td>
							</tr>
						)
					)}

					<tr>
						<td className="p-2 font-semibold text-gray-700">
							Sub Total
						</td>
						<td className="p-2 font-semibold text-gray-700">
							{`KES ${cartTotalData?.cartTotal}`}
						</td>
					</tr>
					<tr>
						<td className="p-2 font-semibold text-gray-700">
							Shipping
						</td>
						<td className="p-2 font-semibold text-gray-700">
							{`KES ${shippingData?.getShipping ?? 0}`}
						</td>
					</tr>
					<tr>
						<td className="p-2 font-semibold text-gray-700">
							Total
						</td>
						<td className="p-2 font-semibold text-gray-700">
							{`KES ${(shippingData?.getShipping ?? 0) + (cartTotalData?.cartTotal ?? 0)}`}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};
export default OrderSummary;
