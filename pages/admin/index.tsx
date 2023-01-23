import React, { ReactElement } from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../lib/prisma';
import Layout from '../../components/Layout';
import AdminSideBar from '../../components/Layout/AdminSideBar';

const Admin = () => {
    return (
        <>
            <h1 className="font-bold text-2xl">Dashboard</h1>
        </>
    );
};

Admin.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <AdminSideBar>{page}</AdminSideBar>
        </Layout>
    );
};


export default Admin;

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
