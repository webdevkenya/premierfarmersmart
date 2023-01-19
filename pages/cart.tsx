import Link from 'next/link';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { CldImage } from 'next-cloudinary';
import { gql, useQuery, useMutation } from '@apollo/client';
import { CartCountQuery } from '../components/Layout/Header';

const CartQuery = gql`
	query CartQuery {
		cart{
			id
			items {
				product{
				name
				image,
				price,
				price_type,
				}
				productTotal
				quantity
				id
			}
		}
	}
`;


export const GetCartTotalQuery = gql`
	query GetCartTotal  {
		cartTotal
	}
`;

const IncreaseQuantityMutation = gql`
	mutation IncreaseQuantity($id: String!) {
		increaseQuantity(id: $id) {
			id
			quantity
			productTotal
		}
	}
`;

const DecreaseQuantityMutation = gql`
	mutation DecreaseQuantity($id: String!) {
		decreaseQuantity(id: $id) {
			id
			quantity
			productTotal
		}
	}
`;

const RemoveFromCartMutation = gql`
	mutation RemoveFromCart($id: String!) {
		removeFromCart(id: $id) {
			id
		}
	}
`;

const Cart = () => {
	// console.log('cart', cart);

	// const {
	// 	items,
	// 	removeItem,
	// 	getTotal,
	// 	increaseQuantity,
	// 	decreaseQuantity,
	// 	isEmpty,
	// } = useShoppingCart();

	const { data, loading, error } = useQuery(CartQuery)
	const { data: cartTotalData, } = useQuery(GetCartTotalQuery)
	const [increaseQuantity] = useMutation(IncreaseQuantityMutation)
	const [decreaseQuantity] = useMutation(DecreaseQuantityMutation)
	const [removeFromCart] = useMutation(RemoveFromCartMutation)


	if (loading) return <p>loading...</p>
	if (error) return <p>{error?.message}</p>

	return (
		<div className="relative h-[50%] bg-white rounded-lg shadow-lg">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg leading-6 font-medium text-gray-900">
					Shopping Cart
				</h3>
				{data.cart?.items?.length === 0 ? (
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
								{data.cart?.items?.map(
									({
										id,
										product: { name,
											image,
											price,
											price_type,
										},
										quantity,
										productTotal
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
															decreaseQuantity({
																variables: { id }, refetchQueries: [{ query: GetCartTotalQuery }, 'GetCartTotal'],

															})
														}
														type="button"
														className="text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
													>
														-
													</button>
													{quantity}
													<button
														onClick={() =>
															increaseQuantity({
																variables: { id }, refetchQueries: [{ query: GetCartTotalQuery }, 'GetCartTotal'],

															}
															)
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
														removeFromCart({
															variables: { id },
															refetchQueries: [{ query: GetCartTotalQuery }, 'GetCartTotal', { query: CartCountQuery }, 'CartCount'],
															update(cache, { data }) {
																//@ts-ignore
																const { cart } = cache.readQuery({
																	query: CartQuery
																})
																cache.writeQuery({
																	query: CartQuery,
																	data: {
																		cart: { ...cart, items: cart.items.filter(item => item.id !== data.removeFromCart.id) }
																	}
																})
															}
														})
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
								{`Shopping Total : KES ${cartTotalData?.cartTotal}`}
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

// export const getServerSideProps = async ({ req, res }) => {
// 	// const session = req.cookies.sessionId
// 	//	has session f46a9db1-59e2-4b94-9d253519ea940ce1
// 	const cart = await prisma.cart.findUnique({
// 		where: {
// 			sessionId: 'f46a9db1-59e2-4b94-9d253519ea940ce1',
// 		}, select: {
// 			items: {
// 				select: {
// 					id: true,
// 					quantity: true,
// 					product: {
// 						select: {
// 							id: true,
// 							image: true,
// 							name: true,
// 							price: true
// 						}
// 					}
// 				}
// 			}
// 		}
// 	});

// 	console.log('cart', cart);


// 	return {
// 		props: { cart },
// 	};
// };

