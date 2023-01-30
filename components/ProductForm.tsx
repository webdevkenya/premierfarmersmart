import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { CldUploadButton, CldImage } from 'next-cloudinary';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useModal } from '../contexts/ModalContext';
import { GetAllProductsQuery } from '../pages/admin/manage-products';
import { log } from 'next-axiom';


interface IFormInputs {
    name: string;
    price: number
    priceType: string;
    category: string;
    stock: number;
}

const schema = yup
    .object({
        name: yup.string().required('please input the product name'),
        price: yup.number().typeError('Price must be a number').positive().integer().required('please select a product price'),
        priceType: yup.string().required('please select the product price type'),
        category: yup.string().required('please input the product category'),
        stock: yup
            .number().typeError('Stock must be a number')
            .positive().integer()
            .required('please input the number of products in stock'),
    })
    .required();


const CreateProductMutation = gql`
	mutation (
		$name: String!
		$price: Int!
		$price_type: String!
		$image: String!
		$category: String!
		$stock: Int!
	) {
		createProduct(
			name: $name
			price: $price
			price_type: $price_type
			image: $image
			category: $category
			stock: $stock
		) {
			name
			price
			price_type
			image
			category
			stock
		}
	}
`;

const priceTypes = [
    { value: 'kg', label: 'Per Kg' },
    { value: 'each', label: 'Per Item' },
    { value: 'box', label: 'Per Box' },
    { value: 'bag', label: 'Per Bag' },
]

const ProductForm = () => {

    const [imageURL, setImageURL] = useState<string>();
    const { close } = useModal();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });

    const [createProduct, { loading, error }] = useMutation(
        CreateProductMutation,
        {
            refetchQueries: [{ query: GetAllProductsQuery }, 'GetAllProducts'],
            onCompleted: () => reset(),
        }
    );

    const onSubmit = async (data) => {
        const { name, price, priceType, category, stock } = data;
        const variables = {
            name,
            price: parseInt(price),
            price_type: priceType,
            image: imageURL,
            category,
            stock: parseInt(stock),
        };
        try {
            toast.promise(createProduct({ variables }), {
                loading: 'Creating new product..',
                success: 'Product successfully created!🎉',
                error: `Something went wrong 😥 Please try again -  ${error}`,
            });
        } catch (error) {
            console.error(error);
        } finally {
            close();
        }
    };

    const onImageUpload = (error, result, _widget) => {
        if (error) {
            console.error(error);
            toast.error(`Something went wrong 😥 Please try again - ${error}`);
        }
        log.info('image upload result', result);

        setImageURL(result?.info?.public_id); // Updating local state with asset details
    };
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="mb-4">

                <label htmlFor="name"
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Product Name
                </label>
                <div className="relative rounded-md shadow-sm">

                    <input
                        type="text"
                        {...register('name')}
                        className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                    <p className="text-sm text-red-600">
                        {errors.name?.message}
                    </p>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="price"
                    className="block text-sm font-medium leading-5 text-gray-700">
                    Price of product
                </label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        type="number"
                        {...register('price')}
                        className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                    <p className="text-sm text-red-600">
                        {errors.price?.message}
                    </p>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="priceType"
                    className="block text-sm font-medium leading-5 text-gray-700">
                    Price Type
                </label>
                <div className="relative rounded-md shadow-sm">
                    <select
                        {...register('priceType')}
                        className="form-select py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    >
                        <option value="">Select the price type</option>
                        {
                            priceTypes.map(({ value, label }, idx) => (
                                <option key={idx} value={value}>
                                    {label}
                                </option>
                            ))}
                    </select>
                    <p className="text-sm text-red-600">
                        {errors.priceType?.message}
                    </p>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="category"
                    className="block text-sm font-medium leading-5 text-gray-700">
                    Category
                </label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        type="text"
                        {...register('category')}
                        className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                    <p className="text-sm text-red-600">
                        {errors.category?.message as string}
                    </p>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="stock"
                    className="block text-sm font-medium leading-5 text-gray-700">
                    Stock
                </label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        type="number"
                        {...register('stock')}
                        className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                    <p className="text-sm text-red-600">
                        {errors.stock?.message as string}
                    </p>
                </div>
            </div>
            {imageURL && (
                <div className='mb-4'>

                    <CldImage width="600" height="600" src={imageURL} />
                </div>
            )}
            <div className="mb-4">
                <CldUploadButton
                    className="capitalize w-full font-medium py-2 text-gray-800 px-4 rounded-md border-2 border-gray-800 hover:bg-gray-800 hover:text-white"
                    onUpload={onImageUpload}
                    uploadPreset={
                        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                >
                    Upload Image
                </CldUploadButton>
            </div>
            <div className="mb-4">
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full capitalize bg-gray-800 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-900"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="w-6 h-6 animate-spin mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                            </svg>
                            Creating...
                        </span>
                    ) : (
                        <span>Create Product</span>
                    )}
                </button>
            </div>
        </form>
    )
}

export default ProductForm