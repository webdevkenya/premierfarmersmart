import React from 'react';
import Image from 'next/image';
import ContactForm from '../components/ContactForm';

const ContactPage = () => {

    return (
        <div className="px-4 py-6 bg-white rounded-b-lg min-h-[80vh] shadow-lg flex flex-col justify-center">
            <Image
                className="h-auto w-1/4 mx-auto"
                src="/support.svg"
                alt="className"
                width={312}
                height={264}
            />
            <h1 className="text-2xl font-medium text-center my-4">Contact Us</h1>
            <div className="my-4 text-center text-sm leading-5 text-gray-500">
                <p>Email: <a href="mailto:info@mystore.com">support@premierfarmersmart.co.ke</a></p>
                <p>Phone: <a href="tel:+1234567890">+254 705 000 000</a></p>
            </div>

            {/* <ContactForm /> */}

        </div>
    )
}

export default ContactPage;