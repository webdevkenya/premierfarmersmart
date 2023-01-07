import Image from 'next/image';
import { gql, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { CldImage } from 'next-cloudinary';

const AddFavoriteMutation = gql`
	mutation ($id: String!) {
		addFavorite(id: $id) {
			name
			price
			price_type
			image
			category
			stock
		}
	}
`;

const ProductCard = ({ product }) => {
	const { image, name, price, id, price_type } = product;
	const { addItem, items } = useShoppingCart();

	const [addFavorite, { loading, error }] = useMutation(AddFavoriteMutation);

	const handleFavorite = () => {
		console.log(id);
		const variables = {
			id,
		};
		try {
			toast.promise(addFavorite({ variables }), {
				loading: 'Adding product to favorites ..',
				success: 'Product added to favorites successfully!🎉',
				error: `Something went wrong 😥 Please try again -  ${error}`,
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handleBuy = async () => {
		try {
			await addItem(product);
			toast.success('Product added to cart successfully!🎉');
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow p-6 mb-4 flex flex-col items-center">
			<CldImage
				//	className="w-48 h-48 rounded-full mb-4"
				alt="Product"
				width="300"
				height="300"
				src={image}
			/>
			<h3 className="text-lg font-bold text-gray-800 mb-4">{name}</h3>
			<p className="text-gray-600 mb-4">{`KES ${price} / ${price_type}`}</p>
			<div className="flex items-center justify-between w-full">
				<button
					onClick={handleBuy}
					className="text-xs font-semibold rounded-full px-4 py-2 leading-none bg-green-500 text-white hover:bg-green-600"
				>
					Buy
				</button>
				<button
					onClick={handleFavorite}
					className="text-xs font-semibold rounded-full px-4 py-2 leading-none bg-blue-500 text-white hover:bg-blue-600"
				>
					Add to Favorites
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
