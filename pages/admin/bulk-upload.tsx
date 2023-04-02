import React, { useState, useCallback, ReactElement } from 'react';
import { gql, useMutation } from '@apollo/client';
import { GetAllProductsQuery } from './manage-products';
import { log } from 'next-axiom';
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse';
import prisma from '../../lib/prisma'
import { getSession } from '@auth0/nextjs-auth0';
import Layout from '../../components/Layout';
import AdminSideBar from '../../components/Layout/AdminSideBar';
import { toast, Toaster } from 'react-hot-toast';

const CreateProductsMutation = gql`
	mutation (
		$products: [ProductInput!]!
	) {
		createProduct(
			products: $products	
		) 
	}
`;


const BulkUpload = () => {
    const [parsedCsvData, setParsedCsvData] = useState([]);

    const [createProducts, { loading, error }] = useMutation(
        CreateProductsMutation,
        {
            refetchQueries: [{ query: GetAllProductsQuery }, 'GetAllProducts']
        }
    );

    const handleUpload = useCallback(async () => {
        try {
            const products = parsedCsvData.map(({ price, price_type, name, stock, image, category }) => ({
                name,
                price: parseInt(price),
                price_type,
                image,
                category,
                stock: parseInt(stock),
            }))


            toast.promise(createProducts({ variables: { products } }), {
                loading: 'Uploading products...',
                success: 'Products uploaded successfully!🎉',
                error: `Something went wrong 😥 Please try again -  ${error}`,
            });
        } catch (error) {
            log.error('bulk product upload error', error);
        }
    }, [createProducts, parsedCsvData, error])


    const parseFile = useCallback(file => {
        const requiredColumns = ["name", "category", "price", "price_type", "stock", "image"];
        const reader = new FileReader();
        reader.onload = () => {
            Papa.parse(file, {
                header: true,// first row of parsed data will be interpreted as field names
                complete: results => {
                    const uploadedColumns = Object.keys(results.data[0]);
                    if (
                        requiredColumns.every((column) => uploadedColumns.includes(column))
                    ) {
                        setParsedCsvData(results.data);
                    } else {
                        toast.error('Please upload a valid csv file');
                        console.log("Invalid file format");
                    }
                },
            })
        }
        reader.readAsText(file);
    }, []);

    const onDropRejected = useCallback((fileRejections) => {
        console.log(fileRejections);
    }, []);

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            parseFile(acceptedFiles[0]);
        })
    }, [parseFile])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, onDropRejected })

    return (
        <>

            <Toaster />
            <div className='flex items-center justify-between p-4'>
                <h1 className="font-bold text-2xl">Bulk Upload</h1>
                {parsedCsvData.length > 0 && (
                    <button
                        className="font-semibold text-blue-600 hover:text-blue-700"
                        onClick={handleUpload}
                    >
                        Finish Upload
                    </button>
                )}
            </div>
            {parsedCsvData.length > 0 ? (
                <div className="mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {Object.keys(parsedCsvData[0]).map((key) => (
                                    <th scope="col" className="px-6 py-3" key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {parsedCsvData.map((row, index) => (
                                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" key={index}>
                                    {Object.values(row).map((value: any, index) => (
                                        <td className="px-6 py-4" key={index}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div
                    className="mt-4"
                    {...getRootProps()}
                >
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">{isDragActive ? 'Drop the files here' : 'Click to upload or drag and drop'}</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">CSV</p>
                            </div>
                            <input  {...getInputProps()} id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div>
                </div>)}
        </>
    )
}

BulkUpload.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <AdminSideBar>{page}</AdminSideBar>
        </Layout>
    );
};

export default BulkUpload;

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

    const user = await prisma.user.findUnique({
        select: {
            email: true,
            role: true,
        },
        where: {
            email: session.user.email,
        },
    });

    if (user?.role !== 'ADMIN') {
        return {
            redirect: {
                permanent: false,
                destination: '/404',
            },
            props: {},
        };
    }

    return {
        props: {},
    };
};
