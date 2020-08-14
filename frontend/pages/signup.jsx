import React from "react";
import Layout from '../components/layout/Layout/Layout'
import SignUp from "../components/auth/SignUp/SignUp";
import { withAuthSync } from "../lib/auth";

const SignUpPage = () => {
    return (
        <Layout title="Регистрация">
            <SignUp />
        </Layout>
    );
};

export default SignUpPage;
