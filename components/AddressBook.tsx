import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import AddressModal from './AddressModal';
import { toast } from 'react-hot-toast';
import { useShoppingCart } from '../contexts/ShoppingCartContext';

export const AddressesQuery = gql`
	query {
		addresses {
			id
			first_name
			last_name
			location {
				county
				town
				shipping
			}
			mobile_phone_number
			specific_address
		}
	}
`;

const DeleteAddressMutation = gql`
	mutation deleteAddress($id: String!) {
		deleteAddress(id: $id) {
			id
		}
	}
`;
const AddressBook = () => {
	const { loading, error, data } = useQuery(AddressesQuery);
	const [deleteAddress, { loading: loadingD, error: errorD }] = useMutation(
		DeleteAddressMutation
	);
	const [selectedAddress, setSelectedAddress] = useState<string>();
	const { updateShipping } = useShoppingCart();
	// const [updateAddress] = useMutation(UPDATE_ADDRESS_MUTATION);
	// const [deleteAddress] = useMutation(DELETE_ADDRESS_MUTATION);
	// const [setDefaultAddress] = useMutation(SET_DEFAULT_ADDRESS_MUTATION);

	if (loading) return <p>Loading... </p>;
	if (error) return <p>{`Error! ${error.message}`}</p>;

	const handleUpdateAddress = (id) => {
		console.log('update', id);
	};

	const handleDeleteAddress = (id) => {
		try {
			const variables = { id };
			toast.promise(
				deleteAddress({
					variables,
					refetchQueries: [{ query: AddressesQuery }, 'addresses'],
				}),
				{
					loading: 'Removing from favorites..',
					success: 'Favorite successfully deleted!🎉',
					error: `Something went wrong 😥 Please try again -  ${errorD}`,
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSelectAddress = (e) => {
		setSelectedAddress(e.target.value);
		const addr = data.addresses.find(({ id }) => id === e.target.value);
		updateShipping(addr?.location?.shipping);
	};

	return (
		<div className="container mx-auto px-4">
			<div className="flex justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					Address Book
				</h1>
				<AddressModal />
			</div>
			<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{data.addresses.length > 0 ? (
					data.addresses.map(
						({
							id,
							first_name,
							last_name,
							location,
							mobile_phone_number,
							specific_address,
						}) => (
							<li
								key={id}
								className="overflow-hidden bg-white shadow rounded-lg p-6"
							>
								<h2 className="text-lg font-bold text-gray-800 mb-4">
									{`${first_name} ${last_name}`}
								</h2>
								<p className="text-gray-700 mb-4">
									{specific_address}
								</p>
								<p className="text-gray-700 mb-4">
									{mobile_phone_number}
								</p>
								<p className="text-gray-700 mb-4">
									{`${location.town} / ${location.county}`}
								</p>
								<div className="flex justify-between">
									<button
										onClick={() => handleDeleteAddress(id)}
										className="text-sm font-semibold text-red-600 hover:text-red-700"
									>
										Delete
									</button>
									<button
										onClick={() => handleUpdateAddress(id)}
										className="text-sm font-semibold text-blue-600 hover:text-blue-700"
									>
										Edit
									</button>
									<input
										type="radio"
										name="radioGroup"
										className="form-radio"
										value={id}
										checked={selectedAddress === id}
										onChange={handleSelectAddress}
									/>
								</div>
							</li>
						)
					)
				) : (
					<p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
						Your address book is empty.
					</p>
				)}
			</ul>
		</div>
	);
};

export default AddressBook;
