const Loader = ([typeLoader, DRACOLoader = null], path) => {
    return new Promise(resolve => {
        const loader = new typeLoader();
        if (DRACOLoader) {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/threejs/compressor/');
            loader.setDRACOLoader(dracoLoader);
        }
        loader.load(path, resolve, undefined, exception => {
            throw exception;
        });
    })
}

export default Loader;
