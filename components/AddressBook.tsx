import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import ModalWrapper from './ModalWrapper';
import { toast } from 'react-hot-toast';
import { RadioGroup } from '@headlessui/react'
import { useShippingAddress } from '../contexts/AddressContext'
import AddressForm from './AddressForm'


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
	//const [selected, setSelected] = useState(data?.addresses[0])
	const { setShippingAddress, address } = useShippingAddress()
	//	const [selectedAddress, setSelectedAddress] = useState<string>();
	//	const { updateShipping } = useShoppingCart();
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

	// const handleSelectAddress = (e) => {
	// 	setSelectedAddress(e.target.value);
	// 	const addr = data.addresses.find(({ id }) => id === e.target.value);
	// 	updateShipping(addr?.location?.shipping);
	// };

	return (
		<div className="container mx-auto px-4">
			<div className="flex justify-between mb-4">
				<h1 className="text-2xl font-bold text-gray-800">
					Address Book
				</h1>
				<ModalWrapper title='Create Address'>
					<AddressForm />
				</ModalWrapper>
			</div>
			<p className='pb-4 text-gray-400'>Select your delivery address</p>
			<RadioGroup value={address} onChange={setShippingAddress}>
				<RadioGroup.Label className="sr-only">Address Book</RadioGroup.Label>
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
								<RadioGroup.Option
									key={id}
									value={id}
									className={({ active, checked }) =>
										`${active
											? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
											: ''
										}
				  ${checked ? 'bg-sky-900  text-white' : 'bg-white'
										}
					relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
									}
								>
									{({ active, checked }) => (
										<li
											key={id}
											className="p-6 w-full relative"
										>
											<RadioGroup.Label
												as="h2"
												className={`font-bold mb-4 text-lg  ${checked ? 'text-white' : 'text-gray-800'
													}`}
											>
												{`${first_name} ${last_name}`}
											</RadioGroup.Label>
											<RadioGroup.Description
												as="span"
												className={`mb-4 ${checked ? 'text-sky-100' : 'text-gray-700'
													}`}
											>
												<p>
													{specific_address}
												</p>
												<p>
													{mobile_phone_number}
												</p>
												<p>
													{`${location.town} / ${location.county}`}
												</p>
											</RadioGroup.Description>

											<div className="flex mt-4 justify-between">
												<button
													onClick={() => handleDeleteAddress(id)}
													className="font-semibold text-red-600 hover:text-red-700"
												>
													Delete
												</button>
												<button
													disabled
													onClick={() => handleUpdateAddress(id)}
													className="cursor-not-allowed font-semibold text-blue-600 hover:text-blue-700"
												>
													Edit
												</button>

											</div>
											{checked && (
												<div className="shrink-0 text-white absolute top-1 right-1">
													<CheckIcon className="h-6 w-6" />
												</div>
											)}
										</li>)}
								</RadioGroup.Option>
							)
						)
					) : (
						<p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
							Your address book is empty.
						</p>
					)}
				</ul>
			</RadioGroup>
		</div>
	);
};

export default AddressBook;


function CheckIcon(props) {
	return (
		<svg viewBox="0 0 24 24" fill="none" {...props}>
			<circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
			<path
				d="M7 13l3 3 7-7"
				stroke="#fff"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
