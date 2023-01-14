import React, { Fragment } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';
import Image from 'next/image';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { gql, useQuery } from '@apollo/client';
import {
	Bars3Icon,
	XMarkIcon,
	ShoppingCartIcon,
	ArrowLeftOnRectangleIcon,
	UserIcon,
} from '@heroicons/react/24/outline';
import { Popover } from '@headlessui/react'


const navigation = [
	{ name: 'Home', href: '/', current: true },
	{ name: 'Contacts', href: '#', current: false },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

const CategoriesQuery = gql`
query CategoriesQuery {
  categories {
    category
    id
  }
}
`;


export default function Header() {
	const { data, loading } = useQuery(CategoriesQuery)
	const { user, error } = useUser();
	const { count } = useShoppingCart();

	// if (loading) return <p>loading...</p>
	if (error) return <div>{error.message}</div>;
	return (
		<Disclosure as="nav" className="border shadow ">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
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
								<div className="my-auto">
									<Link
										className="title-font font-medium text-gray-900 mb-4 md:mb-0"
										href="/"
									>
										<Image
											className="block h-14 w-auto md:hidden"
											src="/premierfarmersmart-mobile-logo.svg"
											alt="logo"
											height={57}
											width={37}
										/>
										<Image
											className="hidden h-11 w-auto md:block"
											src="/premierfarmersmart-nav-logo.svg"
											alt="logo"
											width={309}
											height={57}
										/>
									</Link>
								</div>
								<div className="hidden sm:ml-8 my-auto sm:block">
									<div className="flex space-x-4">
										{navigation.map((item) => (
											<Link
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
											</Link>
										))}
										<Popover className="relative">
											<Popover.Button className="text-gray-300 hover:text-gray-700
												'px-3 py-2 rounded-md text-sm font-medium"
											>Categories</Popover.Button>

											<Transition
												as={Fragment}
												enter="transition ease-out duration-200"
												enterFrom="opacity-0 translate-y-1"
												enterTo="opacity-100 translate-y-0"
												leave="transition ease-in duration-150"
												leaveFrom="opacity-100 translate-y-0"
												leaveTo="opacity-0 translate-y-1"
											>
												<Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
													<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
														<div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
															{data?.categories.map(({ category, id }) => (
																<a
																	key={id}
																	href={`/products/${encodeURIComponent(category)}`} className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:text-grray-900"
																>

																	<div className="ml-4">
																		<p className="text-sm font-medium text-gray-900">
																			{category}
																		</p>

																	</div>
																</a>
															))}
														</div>

													</div>
												</Popover.Panel>
											</Transition>
										</Popover>
									</div>

								</div>
							</div>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
								<Link
									className="relative p-1 text-gray-300 hover:text-gray-700"
									href="/cart"
								>
									<span className="sr-only">View cart</span>
									<ShoppingCartIcon
										className="h-6 w-6 sm:h-8 sm:w-8"
										aria-hidden="true"
									/>
									<div className="absolute inline-flex items-center justify-center w-6 h-6 text-sm font-bold  rounded-full -top-2 -right-2">
										{count}
									</div>
								</Link>
								{user ? (
									// Profile dropdown
									<Menu as="div" className="relative ml-3 ">
										<div>
											<Menu.Button className="flex items-center text-xs text-gray-300 hover:text-gray-700">
												<span className="sr-only">
													Open user menu
												</span>
												<UserIcon
													className="h-6 w-6 sm:h-8 sm:w-8"
													aria-hidden="true"
												/>
												<p className="ml-2">
													{user.name}
												</p>
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
															href="/profile/account"
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
											className="hidden sm:block sm:ml-8 px-3 py-2  text-sm font-medium rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
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
									as={Link}
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
			)
			}
		</Disclosure >
	);
}
