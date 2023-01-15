import {
	ArrowSmallLeftIcon,
	ArrowLeftOnRectangleIcon,
	Cog6ToothIcon,
	StarIcon,
	ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const ProfileSideBar = ({ children }) => {
	return (
		<div className="flex">
			<aside className="w-64 mt-1 h-screen" aria-label="Sidebar">
				<div className="px-3 py-4 overflow-y-auto bg-white border-r border-gray-200">
					<ul className="space-y-2">
						<li>
							<Link
								href="/"
								className="w-full flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
							>
								<ArrowSmallLeftIcon className="block h-6 w-6 mr-2" />
								Back Home
							</Link>
						</li>
					</ul>
					<ul className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
						<li>
							<Link
								href="/profile/account"
								className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
							>
								<Cog6ToothIcon className="block h-6 w-6" />

								<span className="flex-1 ml-3 whitespace-nowrap">
									Account Settings
								</span>
							</Link>
						</li>
						<li>
							<Link
								href="/profile/orders"
								className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
							>
								<ArchiveBoxIcon className="block h-6 w-6" />

								<span className="ml-3">Your Orders</span>
							</Link>
						</li>
						<li>
							<Link
								href="/profile/favorites"
								className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
							>
								<StarIcon className="block h-6 w-6" />

								<span className="flex-1 ml-3 whitespace-nowrap">
									Your Favorites
								</span>
							</Link>
						</li>
					</ul>
					<ul className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
						<li>
							<Link
								href="/api/auth/logout"
								className="flex items-center p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
							>
								<ArrowLeftOnRectangleIcon className="block h-6 w-6" />

								<span className="ml-4">Sign Out</span>
							</Link>
						</li>
					</ul>
				</div>
			</aside>
			<div className="py-6 px-4 flex-grow">{children}</div>
		</div>
	);
};

export default ProfileSideBar;
