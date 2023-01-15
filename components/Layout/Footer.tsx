const Footer = () => {
    return (
        <footer className="mt-4 border border-t border-gray-300  p-4 bg-white shadow md:flex md:items-center md:justify-between md:p-6">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">PremierFarmersMart™</a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                    <a href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
                </li>
                <li>
                    <a href="#" className="hover:underline">Contacts</a>
                </li>
            </ul>
        </footer>
    )
}
export default Footer