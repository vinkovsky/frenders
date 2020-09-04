import React from "react";
import Layout from '../components/layout/Layout/Layout'
import SaveScenesList from "../components/dashboard/SaveScenes/SaveScenesList/SaveScenesList";
import withPrivateRoute from "../components/hoc/withPrivateRoute";
import { withAuthSync } from "../lib/auth";
import Settings from "../components/dashboard/Settings/Settings";
import ScenesList from "../components/dashboard/Scenes/ScenesList/ScenesList";

const ProfilePage = () => {
    return (
        <Layout title="Профиль">
            <SaveScenesList />
            <ScenesList />
            <Settings />
        </Layout>
    );
};

export default withAuthSync(withPrivateRoute(ProfilePage));
