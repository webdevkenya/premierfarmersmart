import Image from 'next/image';
import React from 'react';
import { format } from 'date-fns';

interface Item {
    id: string,
    name: string,
    quantity: number,
    price: number,
    priceType: string
}

interface Props {
    order: {
        id: string,
        createdAt: Date,
        items: [Item],
        shippingAddress: {
            specific_address: string
            Location: {
                name: string,
                county: string
                town: string
                shipping: number
            }
        }
    }
}

const OrderReceipt = ({ order }: Props) => {
    const { id, createdAt, items, shippingAddress: { specific_address, Location } } = order

    const subTotal = items.reduce((acc, { price, quantity }) => acc + (price * quantity), 0)

    return (

        <article className="overflow-hidden">
            <div className="bg-[white] shadow rounded-b-md">
                <Image
                    className="h-auto w-5/12 mx-auto"
                    src="/premierfarmersmart-logo.svg"
                    alt="className"
                    width={558}
                    height={448}
                />

                <div className="flex w-full items-center justify-around">
                    <div className="text-sm font-light text-slate-500">
                        <p className="text-sm font-normal text-slate-700">Billed To</p>
                        <p>{specific_address}</p>
                        <p>{Location.name}</p>
                        <p>{Location.town}</p>
                        <p>{Location.county}</p>
                    </div>
                    <div className="text-sm font-light text-slate-500">
                        <p className="text-sm font-normal text-slate-700">Order Number</p>
                        <p>{id}</p>

                        <p className="mt-2 text-sm font-normal text-slate-700">
                            Date of Issue
                        </p>
                        <p>
                            {format(createdAt, 'MMM d, y | kk:m')}

                        </p>
                    </div>

                </div>
                <div className="p-9">
                    <div className="flex flex-col mx-0 mt-8">
                        <table className="min-w-full divide-y divide-slate-500">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0">
                                        Product
                                    </th>
                                    <th scope="col" className="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell">
                                        Quantity
                                    </th>
                                    <th scope="col" className="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell">
                                        Price
                                    </th>
                                    <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-normal text-slate-700 sm:pr-6 md:pr-0">
                                        Product Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(({ id, name, price, priceType, quantity }) => (
                                    <tr key={id} className="border-b border-slate-200">
                                        <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                                            <div className="font-medium text-slate-700">{name}</div>
                                            <div className="mt-0.5 text-slate-500 sm:hidden">
                                                {`1 ${priceType} at KES ${price}`}
                                            </div>
                                        </td>
                                        <td className="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                            {quantity}
                                        </td>
                                        <td className="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                            {`KES ${price}`}
                                        </td>
                                        <td className="py-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                                            {`KES ${price * quantity}`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th scope="row" colSpan={3} className="hidden pt-6 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0">
                                        Subtotal
                                    </th>
                                    <th scope="row" className="pt-6 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden">
                                        Subtotal
                                    </th>
                                    <td className="pt-6 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                                        {`KES ${subTotal}`}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" colSpan={3} className="hidden pt-4 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0">
                                        Shipping
                                    </th>
                                    <th scope="row" className="pt-4 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden">
                                        Shipping
                                    </th>
                                    <td className="pt-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                                        {`KES ${Location.shipping}`}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" colSpan={3} className="hidden pt-4 pl-6 pr-3 text-sm font-normal text-right text-slate-700 sm:table-cell md:pl-0">
                                        Total
                                    </th>
                                    <th scope="row" className="pt-4 pl-4 pr-3 text-sm font-normal text-left text-slate-700 sm:hidden">
                                        Total
                                    </th>
                                    <td className="pt-4 pl-3 pr-4 text-sm font-normal text-right text-slate-700 sm:pr-6 md:pr-0">
                                        {`KES ${Location.shipping + subTotal}`}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default OrderReceipt;
