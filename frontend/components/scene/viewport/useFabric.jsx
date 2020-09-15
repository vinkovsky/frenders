import React, { useRef, useCallback } from 'react';
import {fabric} from 'fabric'
import styles from "./Uvw.module.sass";

const useFabric = (onChange) => {
    const fabricRef = useRef();
    const disposeRef = useRef();
    return useCallback((node) => {
        if (node) {
            fabricRef.current = new fabric.Canvas(node, {
                //renderOnAddRemove: false
                containerClass: styles.container
            });
            if (onChange) {
                disposeRef.current = onChange(fabricRef.current);
            }
        }
        else if (fabricRef.current) {
            fabricRef.current.dispose();
            if (disposeRef.current) {
                disposeRef.current();
                disposeRef.current = undefined;
            }
        }
    }, []);
};

export default useFabric;
