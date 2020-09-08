import React, {useContext, useEffect, useLayoutEffect, useRef, useState, useMemo} from "react";
import WebglRenderer from "./WebglRenderer";
import Container from "../Container";
import Scene from "../Scene";
import Camera from "../Camera";
import RayTraceRenderer from "./RayTraceRenderer";
import Controls from "../Controls";
import * as THREE from "three";
import ViewportSceneContext from "../../../../context/ViewportSceneContext";
import {useRouter} from "next/router";
import { useCallback } from "react";
import Canvas from "./Canvas";
import Loader from "../Loader";

// const Renderer = ({ assets, type }) => {
const Renderer = ({ assets, type }) => {

    return (
        type ?
            <WebglRenderer assets={assets} /> :
            <RayTraceRenderer assets={assets} />
    )

}

export default Renderer;
