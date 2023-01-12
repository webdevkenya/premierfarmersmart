import { gql, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { CldImage } from 'next-cloudinary';
import { StarIcon } from '@heroicons/react/24/outline';

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
	const { addItem } = useShoppingCart();

	const [addFavorite, { error }] = useMutation(AddFavoriteMutation);

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
		<li className="bg-white border border-gray-100 rounded-lg shadow p-6 mb-4 flex flex-col items-center ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 hover:outline-none hover:ring-2">
			<CldImage
				//	className="w-48 h-48 rounded-full mb-4"
				alt="Product"
				width="300"
				height="300"
				src={image}
			/>
			<h3 className="text-lg font-bold text-gray-800 mb-4">{name}</h3>
			<p className="text-gray-600 mb-4">{`KES ${price} / ${price_type}`}</p>
			<div className="flex  items-center">
				<button
					onClick={handleFavorite}
					className="text-xs font-semibold rounded-md px-4 py-1 leading-none border border-2 border-gray-800 text-gray-800 hover:border-gray-900 text-gray-900"
				>
					<StarIcon className="block h-4 w-4" />
				</button>
				<button
					onClick={handleBuy}
					className="flex-1 ml-1 text-xs font-semibold rounded-md px-4 py-2 leading-none bg-gray-800 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-200"
				>
					Buy
				</button>
			</div>
		</li>
	);
};

export default ProductCard;
