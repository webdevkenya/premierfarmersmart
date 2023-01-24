import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useModal } from '../contexts/ModalContext';
import { AddressesQuery } from './AddressBook';

interface IFormInputs {
    name: string;
    email: string;
    message: string;
}


const schema = yup
    .object({
        name: yup.string().required('please input your name'),
        email: yup.string().email().required('please input your email'),
        message: yup
            .string()
            .required('please input your specific address'),
    })
    .required();

const ContactForm = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });


    const onSubmit = (data: IFormInputs) => {
        const { name, email, message } =
            data;
        console.log('contact form', data);

    };

    return (
        <form className='max-w-7xl mx-auto' onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Name
                </label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        {...register('name')}
                        type="text"
                        className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                    <p className="text-sm text-red-600">
                        {errors.name?.message}
                    </p>
                </div>
            </div>
            <div className="mb-4">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Email
                </label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        {...register('email')}
                        type="text"
                        className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                    <p className="text-sm text-red-600">
                        {errors.email?.message}
                    </p>
                </div>
            </div>
            <div className="mb-4 relative rounded-md shadow-sm">
                <label
                    htmlFor="message"
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Message
                </label>

                <textarea
                    {...register('message')}
                    className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    rows={2}
                ></textarea>
                <p className="text-sm text-red-600">
                    {errors.message?.message}
                </p>
            </div>
            <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900"
                    >
                        Submit
                    </button>
                </span>
            </div>
        </form>
    );
};
export default ContactForm;
