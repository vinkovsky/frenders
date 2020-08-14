import { useRef, useEffect, useLayoutEffect } from 'react';

// const useFrame = callback => {
//     const callbackRef = useRef(callback);
//     useEffect(() => {
//         callbackRef.current = callback;
//     }, [callback]);

//     const loop = time => {
//         frameRef.current = requestAnimationFrame(loop);
//         const cb = callbackRef.current;
//         cb(time);
//     };

//     const frameRef = useRef();

//     useLayoutEffect(() => {

//         frameRef.current = requestAnimationFrame(loop);

//         return () => {
//             cancelAnimationFrame(frameRef.current);
//         }

//     }, []);
// };

const useFrame = callback => {
    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = useRef();
    const previousTimeRef = useRef();
    
    const animate = time => {
      if (previousTimeRef.current) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime)
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    }
    
    useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }, []); // Make sure the effect runs only once
  }

export default useFrame;