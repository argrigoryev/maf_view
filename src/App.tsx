import React, { FormEvent, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';

import {
  AmbientLight,
  AxesHelper,
  Color,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader';

const Hello = () => {
  const ifcLoader = new IFCLoader();
  const scene = new Scene();
  useEffect(() => {
    // Creates the Three.js scene
    scene.background = new Color(0xaaaaaa);

    // Object to store the size of the viewport
    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Creates the camera (point of view of the user)
    const camera = new PerspectiveCamera(75, size.width / size.height);
    camera.position.z = 3;
    camera.position.y = 3;
    camera.position.x = 3;

    // Creates the lights of the scene
    const lightColor = 0xffffff;

    const ambientLight = new AmbientLight(lightColor, 0.5);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(lightColor, 1);
    directionalLight.position.set(0, 10, 0);
    directionalLight.target.position.set(-5, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    // Sets up the renderer, fetching the canvas of the HTML
    const threeCanvas = document.getElementById('three-canvas');
    const renderer = new WebGLRenderer({ canvas: threeCanvas });
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Creates grids and axes in the scene
    const grid = new GridHelper(50, 30);
    scene.add(grid);

    const axes = new AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    scene.add(axes);

    // Creates the orbit controls (to navigate the scene)
    const controls = new OrbitControls(camera, threeCanvas);
    controls.enableDamping = true;

    // Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Adjust the viewport to the size of the browser
    window.addEventListener('resize', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      (size.width = window.innerWidth), (size.height = window.innerHeight);
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
    });

    // Sets up the IFC loading
    ifcLoader.setWasmPath('/');

    // const input = document.getElementById('file-input')!;
    // input.addEventListener(
    //   'change',
    //   (changed) => {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     const ifcURL = URL.createObjectURL(changed.target.files[0]);
    //     console.log(ifcURL);
    //     ifcLoader.load(ifcURL, (geometry: any) => scene.add(geometry));
    //   },
    //   false
    // );
    ifcLoader.parse('').then().catch();
  });

  function onFileInput(changed: FormEvent<HTMLInputElement>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const ifcURL = URL.createObjectURL(changed.target.files[0]);
    console.log(ifcURL);
    ifcLoader.load(ifcURL, (geometry: any) => scene.add(geometry));
  }

  return (
    <div>
      <input type="file" name="load" id="file-input" onInput={onFileInput} />
      <canvas id="three-canvas" />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
