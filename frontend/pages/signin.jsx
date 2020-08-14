import React from "react";
import Layout from '../components/layout/Layout/Layout'
import SignIn from "../components/auth/SignIn/SignIn";
import { withAuthSync } from "../lib/auth";

const SignInPage = () => {
    return (
         <Layout title="Вход">
             <SignIn />
         </Layout>
    );
};

export default SignInPage