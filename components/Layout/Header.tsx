import React, { Fragment } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';
import Image from 'next/image';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
	Bars3Icon,
	XMarkIcon,
	ShoppingCartIcon,
	ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
	{ name: 'Home', href: '/', current: true },
	{ name: 'Products', href: '/products', current: false },
	{ name: 'Contacts', href: '#', current: false },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function Header() {
	const { user, error } = useUser();
	const { count } = useShoppingCart();

	if (error) return <div>{error.message}</div>;
	return (
		<Disclosure as="nav" className="border border-gray-200 py-4">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								{/* Mobile menu button*/}
								<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
									<span className="sr-only">
										Open main menu
									</span>
									{open ? (
										<XMarkIcon
											className="block h-6 w-6"
											aria-hidden="true"
										/>
									) : (
										<Bars3Icon
											className="block h-6 w-6"
											aria-hidden="true"
										/>
									)}
								</Disclosure.Button>
							</div>
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex flex-shrink-0 items-center">
									<Link
										className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
										href="/"
									>
										<Image
											className="block h-16 sm:h-14 w-auto md:hidden"
											src="/premierfarmersmart-mobile-logo.svg"
											alt="logo"
											height={57}
											width={37}
										/>
										<Image
											className="hidden h-12 w-auto md:block"
											src="/premierfarmersmart-nav-logo.svg"
											alt="logo"
											width={309}
											height={57}
										/>
									</Link>
								</div>
								<div className="hidden sm:ml-6 sm:block">
									<div className="flex space-x-4">
										{navigation.map((item) => (
											<a
												key={item.name}
												href={item.href}
												className={classNames(
													item.current
														? 'text-grey-900'
														: 'text-gray-300 hover:text-gray-700',
													'px-3 py-2 rounded-md text-sm font-medium'
												)}
												aria-current={
													item.current
														? 'page'
														: undefined
												}
											>
												{item.name}
											</a>
										))}
									</div>
								</div>
							</div>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
								<button
									type="button"
									className="relative p-1 text-gray-300 hover:text-gray-700"
								>
									<span className="sr-only">View cart</span>
									<ShoppingCartIcon
										className="h-6 w-6 sm:h-8 sm:w-8"
										aria-hidden="true"
									/>
									<div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gray-900  rounded-full -top-2 -right-2">
										{count}
									</div>
								</button>
								{user ? (
									// Profile dropdown
									<Menu
										as="div"
										className="relative ml-3 sm:ml-8"
									>
										<div>
											<Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
												<span className="sr-only">
													Open user menu
												</span>
												<img
													className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
													alt="profile"
													src={user.picture}
												/>
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-100"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
												<Menu.Item>
													{({ active }) => (
														<Link
															href="/profile"
															className={classNames(
																active
																	? 'bg-gray-100'
																	: '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
														>
															Your Profile
														</Link>
													)}
												</Menu.Item>

												<Menu.Item>
													{({ active }) => (
														<Link
															className={classNames(
																active
																	? 'bg-gray-100'
																	: '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
															href="/api/auth/logout"
														>
															Sign out
														</Link>
													)}
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu>
								) : (
									<>
										<Link
											href="/api/auth/login"
											className="block sm:hidden ml-3 p-1 text-gray-300 hover:text-gray-700"
										>
											<span className="sr-only">
												Sign In
											</span>
											<ArrowLeftOnRectangleIcon
												className="h-6 w-6 sm:h-8 sm:w-8"
												aria-hidden="true"
											/>
										</Link>
										<Link
											href="/api/auth/login"
											className="hidden sm:block sm:ml-8 px-3 py-2 rounded-md text-sm font-medium rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
										>
											Sign In
										</Link>
									</>
								)}
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 px-2 pt-2 pb-3">
							{navigation.map((item) => (
								<Disclosure.Button
									key={item.name}
									as="a"
									href={item.href}
									className={classNames(
										item.current
											? 'bg-gray-900 text-white'
											: 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'block px-3 py-2 rounded-md text-base font-medium'
									)}
									aria-current={
										item.current ? 'page' : undefined
									}
								>
									{item.name}
								</Disclosure.Button>
							))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
