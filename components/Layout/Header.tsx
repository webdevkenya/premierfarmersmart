import React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';
import Image from 'next/image';

const Header = () => {
	const { user, error } = useUser();
	const { count } = useShoppingCart();

	if (error) return <div>{error.message}</div>;

	return (
		<header className="text-gray-600 body-font">
			<div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
				<Link
					className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
					href="/"
				>
					<Image
						className="w-12"
						src={'/logo2.png'}
						alt="logo"
						width={144}
						height={194}
					/>
					<span className="ml-3 capitalize">
						PREMIER FARMERS MART
						<div className="text-sm text-center font-light">
							Connecting Agri Needs
						</div>
					</span>
				</Link>
				<nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
					<Link
						href="/cart"
						className="mr-5 inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
					>
						Cart {count}
					</Link>

					{user ? (
						<div className="flex items-center space-x-5">
							<Link
								href="/api/auth/logout"
								className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
							>
								Logout
							</Link>
							<img
								alt="profile"
								className="rounded-full w-12 h-12"
								src={user.picture}
							/>
						</div>
					) : (
						<Link
							href="/api/auth/login"
							className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
						>
							Login
						</Link>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
