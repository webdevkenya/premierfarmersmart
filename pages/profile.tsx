import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { gql, useMutation } from '@apollo/client';
import prisma from '../lib/prisma';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

const DeleteFavoriteMutation = gql`
	mutation deleteFavorite($id: String!) {
		deleteFavorite(id: $id) {
			id
		}
	}
`;

const Profile = ({ user: { favorites } }) => {
	const [deleteFavorite, { data, loading, error }] = useMutation(
		DeleteFavoriteMutation
	);

	const handleDeleteFavorite = (id) => {
		try {
			const variables = { id };
			toast.promise(deleteFavorite({ variables }), {
				loading: 'Removing from favorites..',
				success: 'Favorite successfully deleted!🎉',
				error: `Something went wrong 😥 Please try again -  ${error}`,
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="container mx-auto max-w-md py-12">
			<Toaster />
			<ul className="list-none p-0 m-0">
				{favorites.map(({ id, name, price, image }) => (
					<li
						key={id}
						className="bg-white rounded-lg shadow p-6 mb-4 flex items-center"
					>
						<div className="w-12 h-12 flex-shrink-0 rounded-full mr-4 bg-gray-500 text-white flex items-center justify-center">
							<Image
								alt="product"
								width="600"
								height="600"
								src={image}
							/>
						</div>
						<div className="flex-grow">
							<h3 className="text-lg font-bold text-gray-800 mb-1">
								{name}
							</h3>
							<p className="text-gray-600 mb-4">{price}</p>
							<div className="flex items-center justify-between">
								<button
									onClick={() => handleDeleteFavorite(id)}
									className="text-xs font-semibold rounded-full px-4 py-1 leading-none bg-red-500 text-white hover:bg-red-600"
								>
									Delete
								</button>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Profile;

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
			image: true,
			favorites: true,
			orders: true,
			addresses: true,
		},
		where: {
			email: session.user.email,
		},
	});

	return {
		props: { user },
	};
};
