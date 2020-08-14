import React, {forwardRef, useEffect, useState} from "react";

const Container = ({ resize }, ref) => {

    useEffect(() => {
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [ref])



    return <div ref={ref} style={{ width: '100%', height: 'calc(100vh - 218px)' }} />;
}

export default forwardRef(Container);
