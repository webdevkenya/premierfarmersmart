import React, { ReactElement } from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { gql, useMutation } from '@apollo/client';
import prisma from '../../lib/prisma';
import toast, { Toaster } from 'react-hot-toast';
import { CldImage } from 'next-cloudinary';
import Layout from '../../components/Layout';
import ProfileSideBar from '../../components/Layout/ProfileSideBar';
import ProductCard from '../../components/ProductCard';

const DeleteFavoriteMutation = gql`
	mutation deleteFavorite($id: String!) {
		deleteFavorite(id: $id) {
			id
		}
	}
`;

const Favorites = ({ favorites }) => {
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
		<>
			<Toaster />
			<h1 className="font-bold text-2xl">Favorites</h1>

			<ul className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{favorites.map((favorite) => (
					<ProductCard key={favorite.id} product={favorite} />
				))}
			</ul>
		</>
	);
};

Favorites.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<ProfileSideBar>{page}</ProfileSideBar>
		</Layout>
	);
};

export default Favorites;

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
			favorites: true,
		},
		where: {
			email: session.user.email,
		},
	});

	return {
		props: { favorites: user.favorites },
	};
};
