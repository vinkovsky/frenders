import React from 'react'
import Layout from '../components/layout/Layout/Layout'
import Index from "../components/index/Index";
import { withAuthSync } from "../lib/auth";

const IndexPage = () => {
    return (
        <Layout title="Главная">
            <Index />
        </Layout>
    )
};

export default withAuthSync(IndexPage);