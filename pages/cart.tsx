import Link from 'next/link';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { CldImage } from 'next-cloudinary';

const Cart = () => {
	const {
		items,
		removeItem,
		getTotal,
		increaseQuantity,
		decreaseQuantity,
		isEmpty,
	} = useShoppingCart();

	return (
		<div className="relative bg-white rounded-lg shadow-lg">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg leading-6 font-medium text-gray-900">
					Shopping Cart
				</h3>
				{isEmpty ? (
					<p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
						Your shopping cart is empty.
					</p>
				) : (
					<div className="mt-2">
						<table className="w-full">
							<thead>
								<tr>
									<th className="text-left">Product</th>
									<th className="text-center">Quantity</th>
									<th className="text-right">Price</th>
									<th className="text-right">
										Product Total
									</th>
								</tr>
							</thead>
							<tbody>
								{items.map(
									({
										id,
										name,
										image,
										price,
										price_type,
										quantity,
										productTotal,
									}) => (
										<tr key={id}>
											<td className="text-left">
												<div className="flex items-center">
													<div className="flex-shrink-0 h-10 w-10">
														<CldImage
															//	className="h-10 w-10 rounded-full"
															src={image}
															alt="item"
															width="40"
															height="40"
														/>
													</div>
													<div className="ml-3">
														<p className="text-sm leading-5 font-medium text-gray-900">
															{name}
														</p>
														<p className="text-sm leading-5 text-gray-500">
															{price_type}
														</p>
													</div>
												</div>
											</td>
											<td className="text-center">
												<div className="flex justify-around">
													<button
														onClick={() =>
															decreaseQuantity(id)
														}
														type="button"
														className="text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
													>
														-
													</button>
													{quantity}
													<button
														onClick={() =>
															increaseQuantity(id)
														}
														type="button"
														className="text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
													>
														+
													</button>
												</div>
											</td>
											<td className="text-right">
												{`KES ${price}`}
											</td>
											<td className="text-right">
												{`KES ${productTotal}`}
											</td>
											<td className="text-right">
												<button
													onClick={() =>
														removeItem(id)
													}
													type="button"
													className="text-sm leading-5 font-medium text-red-700 hover:text-red-800 focus:outline-none focus:underline"
												>
													Remove
												</button>
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
						<div className="bg-gray-100 p-4 mt-4">
							<p className="text-right font-bold">
								{`Shopping Total : KES ${getTotal()}`}
							</p>
							<p className="text-right text-gray-600">
								Shipping fees not included
							</p>
						</div>
						<div className="pt-4 flex justify-center">
							<Link
								href="/checkout"
								className="w-full text-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
							>
								Checkout
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Cart;
