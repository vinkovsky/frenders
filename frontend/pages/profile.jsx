import React from "react";
import Layout from '../components/layout/Layout/Layout'
import Profile from "../components/auth/Profile/Profile";
import SaveScenesList from "../components/dashboard/SaveScenes/SaveScenesList/SaveScenesList";
import withPrivateRoute from "../components/hoc/withPrivateRoute";
import { withAuthSync } from "../lib/auth";
import Settings from "../components/dashboard/Settings/Settings";

const ProfilePage = () => {
    return (
        <Layout title="Профиль">
            <SaveScenesList />
            <Profile />
            <Settings />
        </Layout>
    );
};

export default withAuthSync(withPrivateRoute(ProfilePage));