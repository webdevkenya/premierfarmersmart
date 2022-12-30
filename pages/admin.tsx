import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { getSession } from '@auth0/nextjs-auth0';
import { CldUploadButton, CldImage } from 'next-cloudinary';
import prisma from '../lib/prisma';

const CreateProductMutation = gql`
	mutation (
		$name: String!
		$price: String!
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

const Admin = () => {
	const [imageURL, setImageURL] = useState<string>();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const [createProduct, { loading, error }] = useMutation(
		CreateProductMutation,
		{
			onCompleted: () => reset(),
		}
	);

	const onSubmit = async (data) => {
		const { name, price, price_type, category, stock } = data;
		const variables = {
			name,
			price,
			price_type,
			image: imageURL,
			category,
			stock: +stock,
		};
		try {
			toast.promise(createProduct({ variables }), {
				loading: 'Creating new product..',
				success: 'Product successfully created!🎉',
				error: `Something went wrong 😥 Please try again -  ${error}`,
			});
		} catch (error) {
			console.error(error);
		}
	};

	const onImageUpload = (error, result, _widget) => {
		if (error) {
			console.error(error);
			toast.error(`Something went wrong 😥 Please try again - ${error}`);
		}
		console.log('result', result);

		setImageURL(result?.info?.secure_url); // Updating local state with asset details
	};

	return (
		<div className="container mx-auto max-w-md py-12">
			<h1 className="text-3xl font-medium my-5">Create a new product</h1>
			<form
				className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
				onSubmit={handleSubmit(onSubmit)}
			>
				<label className="block">
					<span className="text-gray-700">Product Name</span>
					<input
						placeholder="Name"
						name="name"
						type="text"
						{...register('name', { required: true })}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					/>
				</label>
				<label className="block">
					<span className="text-gray-700">Price</span>
					<input
						placeholder="Price"
						name="price"
						type="text"
						{...register('price', { required: true })}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					/>
				</label>
				<label className="block">
					<span className="text-gray-700">Price Type</span>
					<input
						placeholder="Price Type"
						name="price_type"
						type="text"
						{...register('price_type', { required: true })}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					/>
				</label>

				<label className="block">
					<span className="text-gray-700">Category</span>
					<input
						placeholder="Category"
						{...register('category', { required: true })}
						name="category"
						type="text"
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					/>
				</label>
				<label className="block">
					<span className="text-gray-700">Stock</span>
					<input
						placeholder="Stock"
						{...register('stock', { required: true })}
						name="stock"
						type="number"
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					/>
				</label>
				{imageURL && (
					<CldImage width="600" height="600" src={imageURL} />
				)}
				<CldUploadButton
					className="capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
					onUpload={onImageUpload}
					uploadPreset={
						process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
					}
				>
					Upload Image
				</CldUploadButton>
				<button
					disabled={loading}
					type="submit"
					className="capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
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
			</form>
		</div>
	);
};

export default Admin;

export const getServerSideProps = async ({ req, res }) => {
	const session = await getSession(req, res);

	if (!session) {
		return {
			redirect: {
				permanent: false,
				destination: '/api/auth/login',
			},
			props: {},
		};
	}

	const user = await prisma.user.findUnique({
		select: {
			email: true,
			role: true,
		},
		where: {
			email: session.user.email,
		},
	});

	if (user.role !== 'ADMIN') {
		return {
			redirect: {
				permanent: false,
				destination: '/404',
			},
			props: {},
		};
	}

	return {
		props: {},
	};
};
