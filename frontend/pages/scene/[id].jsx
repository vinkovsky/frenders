import React from "react";
import { useRouter } from "next/router";
import Layout from '../../components/layout/Layout/Layout'
import ViewportScene from "../../components/scene/ViewportScene/ViewportScene";

const ScenePage = () => {
    const router = useRouter();

    return (
        <Layout title="Сцена">
            <ViewportScene />
        </Layout>
    );
};

export default ScenePage