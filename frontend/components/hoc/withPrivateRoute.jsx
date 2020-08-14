import React from 'react';
import Cookies from "universal-cookie";

export default WrappedComponent => {

    const hocComponent = ({ ...props }) => {
        return <WrappedComponent {...props} />;
    }

    hocComponent.getInitialProps = async (ctx) => {
        const props = WrappedComponent.getInitialProps && await WrappedComponent.getInitialProps(ctx);
        const { res, req } = ctx;

        if (ctx && req !== undefined) {
            let cookies = new Cookies(req?.headers?.cookie);
            if (!cookies.get('token')) {
                res?.writeHead(302, {
                    Location: '/signin',
                });
                res?.end();
            }
        }
        return { ...props };
    };

    return hocComponent;
};