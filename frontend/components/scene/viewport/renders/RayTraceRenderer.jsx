import { Color } from "three";
import { useEffect, useRef } from "react";
import Scene from "../Scene";
import Controls from "../Controls";

const RayTraceRenderer = (env, scene) => {
    const { RayTracingRenderer, EnvironmentLight } = require("ray-tracing-renderer/build/RayTracingRenderer");
    const renderer = new RayTracingRenderer();
    scene.add(new EnvironmentLight(env));
    if (env === "#000000" || env === null) {
        scene.background = new Color(env);
    } else {
        scene.background = env;
    }

    return renderer;
}

export default RayTraceRenderer;