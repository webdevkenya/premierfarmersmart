import React, { ReactElement } from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../lib/prisma';
import toast, { Toaster } from 'react-hot-toast';
import { CldImage } from 'next-cloudinary';
import Layout from '../../components/Layout';
import ProfileSideBar from '../../components/Layout/ProfileSideBar';

const Account = ({ user }) => {
	return (
		<>
			<h1 className="font-bold text-2xl">Account Settings</h1>
			<h2 className="font-bold py-2 mt-4">Account Information</h2>
			<div className="mb-2">
				<p className="text-gray-700">Name</p>
				<p className="text-gray-400">{user.name}</p>
			</div>
			<p className="text-gray-700">Email</p>
			<p className="text-gray-400">{user.email}</p>
		</>
	);
};

Account.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<ProfileSideBar>{page}</ProfileSideBar>
		</Layout>
	);
};

export default Account;

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

	return {
		props: { user: session.user },
	};
};
