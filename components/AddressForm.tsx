import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useModal } from '../contexts/ModalContext';
import { AddressesQuery } from './AddressBook';

const CountiesQuery = gql`
	query {
		counties {
			county
			towns {
				town
				id
			}
		}
	}
`;

interface IFormInputs {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	county: string;
	town: string;
	specificAddress: string;
}

const phoneNumberRegex = /^(01|07)\d{8}$/;

const schema = yup
	.object({
		firstName: yup.string().required('please input your first name'),
		lastName: yup.string().required('please input your last name'),
		county: yup.string().required('please select a county'),
		town: yup.string().required('please select a town'),
		specificAddress: yup
			.string()
			.required('please input your specific address'),
		phoneNumber: yup
			.string()
			.required('please input your phone number')
			.matches(phoneNumberRegex, 'Please use a valid phone number'),
	})
	.required();

const CreateAddressMutation = gql`
	mutation (
		$firstName: String!
		$lastName: String!
		$phoneNumber: String!
		$location: String!
		$specificAddress: String!
	) {
		createAddress(
			firstName: $firstName
			lastName: $lastName
			phoneNumber: $phoneNumber
			location: $location
			specificAddress: $specificAddress
		) {
			first_name
			last_name
			mobile_phone_number
			specific_address
			location {
				county
				town
			}
		}
	}
`;

const AddressForm = () => {
	const { close } = useModal();
	const { data, loading, error } = useQuery(CountiesQuery);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm<IFormInputs>({
		resolver: yupResolver(schema),
	});

	const [createAddress, { loading: loadingM, error: errorM }] = useMutation(
		CreateAddressMutation,
		{
			onCompleted: () => reset(),
		}
	);
	const selectedCounty = watch('county');

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	if (loadingM) return <p>Loading...</p>;
	if (errorM) return <p>Error: {errorM.message}</p>;

	const onSubmit = (data: IFormInputs) => {
		const { firstName, lastName, phoneNumber, specificAddress, town } =
			data;

		const variables = {
			firstName,
			lastName,
			phoneNumber,
			location: town,
			specificAddress,
		};
		try {
			toast.promise(
				createAddress({
					variables,
					refetchQueries: [{ query: AddressesQuery }, 'addresses'],
				}),
				{
					loading: 'Creating new Address..',
					success: 'Address successfully created!🎉',
					error: `Something went wrong 😥 Please try again -  ${errorM}`,
				}
			);
		} catch (error) {
			console.error(error);
		} finally {
			close();
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="mb-4">
				<label
					htmlFor="firstName"
					className="block text-sm font-medium leading-5 text-gray-700"
				>
					First Name
				</label>
				<div className="relative rounded-md shadow-sm">
					<input
						{...register('firstName')}
						type="text"
						className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
					/>
					<p className="text-sm text-red-600">
						{errors.firstName?.message}
					</p>
				</div>
			</div>
			<div className="mb-4">
				<label
					htmlFor="lastName"
					className="block text-sm font-medium leading-5 text-gray-700"
				>
					Last Name
				</label>
				<div className="relative rounded-md shadow-sm">
					<input
						{...register('lastName')}
						type="text"
						className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
					/>
					<p className="text-sm text-red-600">
						{errors.lastName?.message}
					</p>
				</div>
			</div>
			<div className="mb-4">
				<label
					htmlFor="phoneNumber"
					className="block text-sm font-medium leading-5 text-gray-700"
				>
					Phone Number
				</label>
				<div className="relative rounded-md shadow-sm">
					<input
						{...register('phoneNumber')}
						type="tel"
						className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
					/>
					<p className="text-sm text-red-600">
						{errors.phoneNumber?.message}
					</p>
				</div>
			</div>
			<div className="mb-4">
				<label
					htmlFor="county"
					className="block text-sm font-medium leading-5 text-gray-700"
				>
					County
				</label>
				<div className="relative rounded-md shadow-sm">
					<select
						{...register('county')}
						className="form-select py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
					>
						<option value="">Select a county</option>
						{data.counties.map(({ county }) => (
							<option key={county} value={county}>
								{county}
							</option>
						))}
					</select>
					<p className="text-sm text-red-600">
						{errors.county?.message}
					</p>
				</div>
			</div>
			<div className="mb-4">
				<label
					htmlFor="town"
					className="block text-sm font-medium leading-5 text-gray-700"
				>
					Town
				</label>
				<div className="relative rounded-md shadow-sm">
					<select
						{...register('town')}
						className="form-select py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
					>
						<option value="">Select a town</option>
						{selectedCounty &&
							data.counties
								.find(({ county }) => county === selectedCounty)
								.towns.map(({ town, id }) => (
									<option key={town} value={id}>
										{town}
									</option>
								))}
					</select>
					<p className="text-sm text-red-600">
						{errors.town?.message}
					</p>
				</div>
			</div>
			<div className="mb-4 relative rounded-md shadow-sm">
				<label
					htmlFor="address"
					className="block text-sm font-medium leading-5 text-gray-700"
				>
					Specific Address
				</label>

				<textarea
					{...register('specificAddress')}
					className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
					rows={2}
				></textarea>
				<p className="text-sm text-red-600">
					{errors.specificAddress?.message}
				</p>
			</div>
			<div className="mt-6">
				<span className="block w-full rounded-md shadow-sm">
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900"
					>
						Submit
					</button>
				</span>
			</div>
		</form>
	);
};
export default AddressForm;
