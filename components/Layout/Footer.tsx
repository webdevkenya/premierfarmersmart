import Link from 'next/link'
const Footer = () => {
    return (
        <footer className="mt-4 border-t border-gray-300  p-4 bg-white shadow md:flex md:items-center md:justify-between md:p-6">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">PremierFarmersMart™</a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                    <Link href="/privacy-policy" className="mr-4 hover:underline md:mr-6">Privacy Policy</Link>
                </li>
                <li>
                    <Link href="/contacts" className="hover:underline">Contacts</Link>
                </li>
            </ul>
        </footer>
    )
}
export default Footer