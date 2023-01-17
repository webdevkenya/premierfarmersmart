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

            {/* <div className='flex mb-4 flex-wrap sm:flex-nowrap space-y-4 sm:space-y-0'> */}

            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 mx-auto gap-2 mb-4'>
                {
                    data?.categories.map(({ category, id }) =>
                    (
                        <Link key={id} href={`/products/${encodeURIComponent(category)}`} className="text-gray-900 bg-white border border-gray-800 focus:outline-none hover:bg-gray-800 hover:text-white focus:ring-1 focus:ring-gray-900 md:text-sm font-medium truncate text-xs px-2 py-1">{category}</Link>
                    )
                    )
                }
            </div>

            {/* </div> */}
            {children}
        </div>
    )
}
export default ProductTabs