import { PerspectiveCamera } from "three";

const Camera = () => {
    const camera = new PerspectiveCamera()
    camera.far = 10000;
  //  camera.position.set(500, 350, 500);
    return camera;
}

export default Camera;
