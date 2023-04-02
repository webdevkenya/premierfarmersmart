import React from 'react';
import { gql, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useModal } from '../contexts/ModalContext';
import { GetAllLocationsQuery } from '../pages/admin/manage-locations';
import { log } from 'next-axiom';


interface IFormInputs {
    name: string;
    county: string;
    town: string;
    shipping: number
}

const schema = yup
    .object({
        name: yup.string().required('please input the location name'),
        county: yup.string().required('please select a county'),
        town: yup.string().required('please select a town'),
        shipping: yup
            .number().typeError('Shipping cost must be a number').positive().integer()
            .required('please input the shipping cost'),
    })
    .required();

const CreateLocationMutation = gql`
	mutation (
		$name: String!
		$town: String!
		$county: String!
		$shipping: Int!
	) {
		createLocation(
			name:$name,
		town:$town,
		county:$county,
		shipping:$shipping
		) {
			id
            name
            town
            county
            shipping
		}
	}
`;

const LocationForm = () => {
    const { close } = useModal();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });

    const [createLocation, { loading, error }] = useMutation(
        CreateLocationMutation,
        {
            refetchQueries: [{ query: GetAllLocationsQuery }, 'GetAllLocations'],
            onCompleted: () => reset(),
        }
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <div className="min-h-[80vh] flex justify-center items-center"><p>{`Error! ${error.message}`}</p></div>;;


    const onSubmit = (data: IFormInputs) => {
        const { name, county, town, shipping } =
            data;

        const variables = {
            name,
            town,
            county,
            shipping,
        };
        try {
            toast.promise(
                createLocation({
                    variables
                }),
                {
                    loading: 'Creating new Address..',
                    success: 'Address successfully created!🎉',
                    error: `Something went wrong 😥 Please try again -  ${error}`,
                }
            );
        } catch (error) {
            log.error('location form', error)
        } finally {
            close();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Location Name
                </label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        {...register('name')}
                        type="text"
                        className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                    <p className="text-sm text-red-600">
                        {errors.name?.message}
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
                    <input
                        {...register('town')}
                        type="text"
                        className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                    <p className="text-sm text-red-600">
                        {errors.town?.message}
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
                    <input
                        {...register('county')}
                        type="text"
                        className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                    <p className="text-sm text-red-600">
                        {errors.county?.message}
                    </p>
                </div>
            </div>
            <div className="mb-4">
                <label
                    htmlFor="shipping"
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Shipping Cost
                </label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        {...register('shipping')}
                        type="number"
                        className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                    <p className="text-sm text-red-600">
                        {errors.shipping?.message}
                    </p>
                </div>
            </div>
            <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 "
                    >
                        Submit
                    </button>
                </span>
            </div>
        </form>
    );
};
export default LocationForm;
