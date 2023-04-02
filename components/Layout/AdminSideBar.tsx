import {
    ArrowSmallLeftIcon,
    ArrowLeftOnRectangleIcon,
    ArchiveBoxIcon,
    MapIcon,
    PresentationChartLineIcon,
    DocumentChartBarIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const AdminSideBar = ({ children }) => {
    return (
        <div className="flex">
            <aside className="w-16 md:w-64 mt-1 h-screen" aria-label="Sidebar">
                <div className="md:px-3 py-4 overflow-y-auto bg-white border-r border-gray-200">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/"
                                className="w-full flex flex-col md:flex-row items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <ArrowSmallLeftIcon className="block h-6 w-6" />
                                <span className='text-xs text-center md:text-base mt-2 md:mt-0 md:ml-3'>Back Home</span>
                            </Link>
                        </li>
                    </ul>
                    <ul className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                        <li>
                            <Link
                                href="/admin"
                                className="flex flex-col md:flex-row items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <PresentationChartLineIcon className="block h-6 w-6" />
                                <span className="md:hidden text-xs text-center">
                                    Dashboard
                                </span>
                                <span className="hidden md:block flex-1 ml-3 whitespace-nowrap">
                                    Dashboard
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/bulk-upload"
                                className="flex flex-col md:flex-row items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <DocumentChartBarIcon className="block h-6 w-6" />
                                <span className="md:hidden text-xs text-center">
                                    Bulk Upload
                                </span>
                                <span className="hidden md:block flex-1 ml-3 whitespace-nowrap">
                                    Bulk Upload
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/manage-products"
                                className="flex flex-col md:flex-row items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <ClipboardDocumentListIcon className="block h-6 w-6" />
                                <span className="md:hidden text-xs text-center">
                                    Products
                                </span>
                                <span className="hidden md:block flex-1 ml-3 whitespace-nowrap">
                                    Manage Products
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/manage-orders"
                                className="flex flex-col md:flex-row items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <ArchiveBoxIcon className="block h-6 w-6" />
                                <span className="md:hidden text-xs text-center">
                                    Orders
                                </span>
                                <span className="hidden md:block ml-3">Manage Orders</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/manage-locations"
                                className="flex flex-col md:flex-row items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <MapIcon className="block h-6 w-6" />
                                <span className="md:hidden text-xs text-center">
                                    Locations
                                </span>
                                <span className="hidden md:block flex-1 ml-3 whitespace-nowrap">
                                    Manage Locations
                                </span>
                            </Link>
                        </li>
                    </ul>
                    <ul className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                        <li>
                            <Link
                                href="/api/auth/logout"
                                className="flex flex-col md:flex-row items-center p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                            >
                                <ArrowLeftOnRectangleIcon className="block h-6 w-6" />

                                <span className="text-xs md:text-base text-center mt-2 md:mt-0 md:ml-4">Sign Out</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
            <div className="py-6 px-4 flex-grow">{children}</div>
        </div>
    );
};

export default AdminSideBar;
