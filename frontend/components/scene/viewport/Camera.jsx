import { PerspectiveCamera } from "three";

const Camera = () => {
    const camera = new PerspectiveCamera()
    camera.position.set(150, 150, 300);
    return camera;
}

export default Camera;
