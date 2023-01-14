import { gql, useQuery } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import {
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';


const CategoriesQuery = gql`
query CategoriesQuery {
  categories {
    category
    id
  }
}
`;

const ProductTabs = ({ children }) => {
    const { data, loading, error } = useQuery(CategoriesQuery)

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Oops something went wrong ... {error.message}</p>;

    return (
        <div className='px-8'>
            <Toaster />
            <h1 className="font-bold text-2xl my-4">Products we have in stock</h1>

            <div className='flex mb-4 flex-wrap sm:flex-nowrap space-y-4 sm:space-y-0'>

                <form className="flex items-center mr-4 shrink-0 grow sm:grow-0">
                    <label htmlFor="simple-search" className="sr-only">Search</label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <MagnifyingGlassIcon
                                className="block h-5 w-5"
                                aria-hidden="true"
                            />
                        </div>
                        <input type="text" id="simple-search" className="bg-white border-2 border-gray-300 text-gray-800 text-sm rounded-full focus:ring-gray-500 focus:border-gray-400 block w-full pl-10 p-1" placeholder="Search" required />
                    </div>
                    {/* <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
<MagnifyingGlassIcon
                                    className="block h-5 w-5"
                                    aria-hidden="true"
                                />
<span className="sr-only">Search</span>
</button> */}
                </form>
                <div className='flex space-x-4 flex-wrap'>
                    {
                        data?.categories.map(({ category, id }) =>
                        (
                            <Link key={id} href={`/products/${encodeURIComponent(category)}`} className="text-gray-900 bg-white border-2 border-gray-800 mt-2 focus:outline-none hover:bg-gray-100 focus:ring-1 focus:ring-gray-900 font-medium rounded-full text-sm px-5 py-1">{category}</Link>
                        )
                        )
                    }
                </div>

            </div>
            {children}
        </div>
    )
}
export default ProductTabs