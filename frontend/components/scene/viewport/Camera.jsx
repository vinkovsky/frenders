import { PerspectiveCamera } from "three";

const Camera = () => {
    const camera = new PerspectiveCamera()
    camera.position.set(0, 100, 300);
    return camera;
}

export default Camera;
