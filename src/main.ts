import * as THREE from "three";
import { clampW, hypersphereSlice, rotate4, type Vec4 } from "./geometry";
import "./styles.css";

type ToyState = {
  position: Vec4;
  rotationXW: number;
  selected: boolean;
};

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("App root is missing.");
}

app.innerHTML = `
  <section class="toybox" aria-label="4D Toybox">
    <div class="viewport-wrap">
      <canvas id="toybox-canvas" aria-label="4D toybox viewport"></canvas>
      <div class="micro-prompt" data-testid="micro-prompt">Drag the W Slice to watch the hypersphere shrink through the fourth axis.</div>
      <div class="selected-label" data-testid="selected-label">Hypersphere</div>
    </div>
    <aside class="panel" aria-label="Toybox controls">
      <header>
        <p>4D Toybox</p>
        <h1>Hypersphere Thin Slice</h1>
      </header>
      <label>
        <span>W Slice <output id="w-output">0.00</output></span>
        <input id="w-slider" data-testid="w-slider" type="range" min="-1.6" max="1.6" value="0" step="0.05" />
      </label>
      <button id="rotate-xw" data-testid="rotate-xw" type="button">Rotate XW</button>
      <button id="reset-scene" data-testid="reset-scene" type="button">Reset Scene</button>
      <dl class="debug">
        <div><dt>Visible radius</dt><dd data-testid="visible-radius">1.00</dd></div>
        <div><dt>State</dt><dd data-testid="slice-state">visible</dd></div>
        <div><dt>XW rotation</dt><dd data-testid="xw-rotation">0.00</dd></div>
      </dl>
    </aside>
  </section>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#toybox-canvas");
const wSlider = document.querySelector<HTMLInputElement>("#w-slider");
const wOutput = document.querySelector<HTMLOutputElement>("#w-output");
const radiusOutput = document.querySelector<HTMLElement>("[data-testid='visible-radius']");
const stateOutput = document.querySelector<HTMLElement>("[data-testid='slice-state']");
const rotationOutput = document.querySelector<HTMLElement>("[data-testid='xw-rotation']");
const rotateButton = document.querySelector<HTMLButtonElement>("#rotate-xw");
const resetButton = document.querySelector<HTMLButtonElement>("#reset-scene");

if (!canvas || !wSlider || !wOutput || !radiusOutput || !stateOutput || !rotationOutput || !rotateButton || !resetButton) {
  throw new Error("Toybox controls are missing.");
}

const controls = {
  canvas,
  wSlider,
  wOutput,
  radiusOutput,
  stateOutput,
  rotationOutput,
  rotateButton,
  resetButton
};

const renderer = new THREE.WebGLRenderer({ canvas: controls.canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(controls.canvas.clientWidth, controls.canvas.clientHeight, false);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#f7fbff");

const camera = new THREE.PerspectiveCamera(45, controls.canvas.clientWidth / controls.canvas.clientHeight, 0.1, 100);
camera.position.set(4, 3, 6);
camera.lookAt(0, 0, 0);

scene.add(new THREE.HemisphereLight("#ffffff", "#d8ecff", 2.2));
const keyLight = new THREE.DirectionalLight("#ffffff", 2.5);
keyLight.position.set(4, 7, 5);
scene.add(keyLight);

const grid = new THREE.GridHelper(8, 16, "#90a4b8", "#d4e0eb");
scene.add(grid);

const visibleMaterial = new THREE.MeshPhysicalMaterial({
  color: "#2f80ed",
  roughness: 0.28,
  metalness: 0.02,
  transmission: 0.15,
  thickness: 0.5
});
const ghostMaterial = new THREE.MeshBasicMaterial({
  color: "#8ec5ff",
  transparent: true,
  opacity: 0.16,
  wireframe: true
});
const axisMaterial = new THREE.LineBasicMaterial({ color: "#e15b64" });

const visibleSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), visibleMaterial);
visibleSphere.position.y = 1.1;
scene.add(visibleSphere);

const ghostSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 18), ghostMaterial);
ghostSphere.position.copy(visibleSphere.position);
scene.add(ghostSphere);

const axisPoints = [new THREE.Vector3(0, 1.1, 0), new THREE.Vector3(1.6, 1.1, 0)];
const axisLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(axisPoints), axisMaterial);
scene.add(axisLine);

const toy: ToyState = {
  position: { x: 0.8, y: 0, z: 0, w: 0 },
  rotationXW: 0,
  selected: true
};

function updateToy() {
  const slice = hypersphereSlice(1, toy.position.w);
  const visibleRadius = Math.max(slice.radius, 0.001);
  visibleSphere.scale.setScalar(visibleRadius);
  visibleSphere.visible = slice.kind === "visible";
  ghostSphere.scale.setScalar(slice.ghostRadius);
  ghostSphere.rotation.y = toy.rotationXW;
  axisLine.visible = toy.selected;

  controls.wOutput.value = toy.position.w.toFixed(2);
  controls.radiusOutput.textContent = slice.radius.toFixed(2);
  controls.stateOutput.textContent = slice.kind;
  controls.rotationOutput.textContent = toy.rotationXW.toFixed(2);
  document.body.dataset.sliceState = slice.kind;
}

function render() {
  renderer.render(scene, camera);
}

controls.wSlider.addEventListener("input", () => {
  toy.position.w = clampW(Number(controls.wSlider.value));
  updateToy();
  render();
});

controls.rotateButton.addEventListener("click", () => {
  toy.position = rotate4(toy.position, "XW", Math.PI / 8);
  toy.rotationXW += Math.PI / 8;
  controls.wSlider.value = toy.position.w.toFixed(2);
  updateToy();
  render();
});

controls.resetButton.addEventListener("click", () => {
  toy.position = { x: 0.8, y: 0, z: 0, w: 0 };
  toy.rotationXW = 0;
  controls.wSlider.value = "0";
  updateToy();
  render();
});

window.addEventListener("resize", () => {
  renderer.setSize(controls.canvas.clientWidth, controls.canvas.clientHeight, false);
  camera.aspect = controls.canvas.clientWidth / controls.canvas.clientHeight;
  camera.updateProjectionMatrix();
  render();
});

updateToy();
render();
