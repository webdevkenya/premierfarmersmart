import React from 'react';
import Link from 'next/link'

class PrivacyPolicy extends React.Component {
    render() {
        return (
            <div className="px-4 py-6">
                <h1 className="text-2xl font-medium mb-2">Privacy Policy</h1>
                <p>At Premier Farmers Mart, we are committed to protecting your privacy. This Privacy Policy applies to all information that we collect from you through our website, https://premierfarmersmart.co.ke/. By using our website, you consent to the collection and use of your information as outlined in this policy.</p>
                <section className="my-6">
                    <h2 className="text-lg font-medium">Information We Collect</h2>
                    <ul className="list-disc pl-4 my-2">
                        <li>Personal information, such as your name, email address, and postal address, when you create an account or place an order on our website.</li>
                        <li>Payment information, such as your credit card number, mobile phone number and billing address, when you make a purchase on our website.</li>
                        <li>Navigation information, such as your browsing history, search queries, and the pages you visit on our website.</li>
                        <li>Device information, such as your IP address, browser type, and device type.</li>
                    </ul>
                </section>
                <section className="my-6">
                    <h2 className="text-lg font-medium">How We Use Your Information</h2>
                    <p className="my-2">We use the information we collect from you to provide you with a better shopping experience and to improve our services. Specifically, we use your information for the following purposes:</p>
                    <ul className="list-disc pl-4 my-2">
                        <li>To process and fulfill your orders.</li>
                        <li>To communicate with you about your orders and account.</li>
                        <li>To personalize your shopping experience by showing you relevant products and content.</li>
                        <li>To improve our website and services.</li>
                        <li>To detect and prevent fraud.</li>
                    </ul>
                </section>
                <section className="my-6">
                    <h2 className="text-lg font-medium">Sharing Your Information</h2>
                    <p className="my-2">We do not sell or rent your personal information to third parties. However, we may share your information with third parties as follows:</p>
                    <ul className="list-disc pl-4 my-2">
                        <li>With service providers who assist us in operating our website, such as payment processors and shipping companies.</li>
                        <li>With law enforcement or other government officials as required by law.</li>
                        <li>In the event of a merger or acquisition, with the acquiring company.</li>
                    </ul>
                </section>
                <section className="my-6">
                    <h2 className="text-lg font-medium">Cookies</h2>
                    <p className="my-2">We use cookies to remember your preferences and to help us understand how our website is used. Cookies are small text files that are stored on your device when you visit our website. You can manage your cookie preferences through your browser settings.</p>
                </section>
                <section className="my-6">
                    <h2 className="text-lg font-medium">Security</h2>
                    <p className="my-2">We take the security of your information seriously. We use a variety of security measures, including encryption and authentication tools, to protect your information from unauthorized access and disclosure. However, no method of transmission over the internet or method of electronic storage is 100% secure, so we cannot guarantee its absolute security.</p>
                </section>
                <section className="my-6">
                    <h2 className="text-lg font-medium">Changes to Our Privacy Policy</h2>
                    <p className="my-2">We may update this Privacy Policy from time to time to reflect changes in our practices or the law. We will post any changes on this page and will indicate the date of the last revision at the top of the page. Your continued use of our website after any changes indicates your acceptance of the new Privacy Policy.</p>
                </section>
                <section className="my-6">
                    <h2 className="text-lg font-medium">Contact Us</h2>
                    <p className="my-2">If you have any questions or concerns about our Privacy Policy, please contact us at <Link className='text-sky-600' href='/contacts'>contacts</Link>.</p>
                </section>
            </div>
        );
    }
}

export default PrivacyPolicy;







