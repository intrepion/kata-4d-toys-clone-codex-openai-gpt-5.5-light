import * as THREE from "three";
import { clampW, rotate4, toySlice, type ToyKind, type Vec4 } from "./geometry";
import "./styles.css";

type ToyState = {
  id: string;
  kind: ToyKind;
  label: string;
  position: Vec4;
  starter: Vec4;
  wOffset: number;
  rotationPlane: "XW";
  rotation: number;
  visible: THREE.Object3D;
  ghost: THREE.Object3D;
};

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("App root is missing.");
}

app.innerHTML = `
  <section class="toybox" aria-label="4D Toybox">
    <div class="viewport-wrap">
      <canvas id="toybox-canvas" aria-label="4D toybox viewport"></canvas>
      <div class="micro-prompt" data-testid="micro-prompt">Use the W Slice to compare how each 4D toy appears and vanishes.</div>
      <div class="selected-label" data-testid="selected-label">Hypersphere</div>
    </div>
    <aside class="panel" aria-label="Toybox controls">
      <header>
        <p>4D Toybox</p>
        <h1>Starter Scene</h1>
      </header>
      <div class="toy-buttons" aria-label="Select toy">
        <button data-toy="hypersphere" type="button">Hypersphere</button>
        <button data-toy="tesseract" type="button">Tesseract</button>
        <button data-toy="simplex" type="button">5-Cell Simplex</button>
        <button data-toy="duocylinder" type="button">Duocylinder</button>
      </div>
      <label>
        <span>Global W Slice <output id="w-output">0.00</output></span>
        <input id="w-slider" data-testid="w-slider" type="range" min="-1.6" max="1.6" value="0" step="0.05" />
      </label>
      <label>
        <span>Selected-Toy W Offset <output id="offset-output">0.00</output></span>
        <input id="offset-slider" data-testid="offset-slider" type="range" min="-0.8" max="0.8" value="0" step="0.05" />
      </label>
      <button id="rotate-xw" data-testid="rotate-xw" type="button">Rotate XW</button>
      <button id="toss-selected" data-testid="toss-selected" type="button">Toss Selected</button>
      <button id="reset-selected" data-testid="reset-selected" type="button">Reset Selected</button>
      <button id="reset-scene" data-testid="reset-scene" type="button">Reset Scene</button>
      <details class="controls-popover">
        <summary>Controls</summary>
        <ul>
          <li>Drag the Global W Slice to compare all toys.</li>
          <li>Use Selected-Toy W Offset to inspect one toy.</li>
          <li>Rotate XW turns the selected toy through the fourth axis.</li>
          <li>Toss Selected demonstrates auto-return recovery.</li>
        </ul>
      </details>
      <button id="debug-toggle" data-testid="debug-toggle" type="button" aria-expanded="false">Show Debug</button>
      <dl class="debug" hidden>
        <div><dt>Selected toy</dt><dd data-testid="selected-toy">Hypersphere</dd></div>
        <div><dt>Visible scale</dt><dd data-testid="visible-radius">1.00</dd></div>
        <div><dt>State</dt><dd data-testid="slice-state">visible</dd></div>
        <div><dt>XW rotation</dt><dd data-testid="xw-rotation">0.00</dd></div>
      </dl>
    </aside>
  </section>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#toybox-canvas");
const wSlider = document.querySelector<HTMLInputElement>("#w-slider");
const offsetSlider = document.querySelector<HTMLInputElement>("#offset-slider");
const wOutput = document.querySelector<HTMLOutputElement>("#w-output");
const offsetOutput = document.querySelector<HTMLOutputElement>("#offset-output");
const radiusOutput = document.querySelector<HTMLElement>("[data-testid='visible-radius']");
const stateOutput = document.querySelector<HTMLElement>("[data-testid='slice-state']");
const rotationOutput = document.querySelector<HTMLElement>("[data-testid='xw-rotation']");
const selectedOutput = document.querySelector<HTMLElement>("[data-testid='selected-toy']");
const selectedLabel = document.querySelector<HTMLElement>("[data-testid='selected-label']");
const rotateButton = document.querySelector<HTMLButtonElement>("#rotate-xw");
const tossButton = document.querySelector<HTMLButtonElement>("#toss-selected");
const resetSelectedButton = document.querySelector<HTMLButtonElement>("#reset-selected");
const resetButton = document.querySelector<HTMLButtonElement>("#reset-scene");
const debugToggle = document.querySelector<HTMLButtonElement>("#debug-toggle");
const debugPanel = document.querySelector<HTMLElement>(".debug");
const toyButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-toy]"));

if (
  !canvas ||
  !wSlider ||
  !offsetSlider ||
  !wOutput ||
  !offsetOutput ||
  !radiusOutput ||
  !stateOutput ||
  !rotationOutput ||
  !selectedOutput ||
  !selectedLabel ||
  !rotateButton ||
  !tossButton ||
  !resetSelectedButton ||
  !resetButton ||
  !debugToggle ||
  !debugPanel
) {
  throw new Error("Toybox controls are missing.");
}

const webglProbe = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
if (!webglProbe) {
  app.innerHTML = `
    <section class="fallback-panel" role="alert">
      <h1>WebGL is required</h1>
      <p>This 4D toybox needs WebGL to render and manipulate the starter scene.</p>
    </section>
  `;
  throw new Error("WebGL is unavailable.");
}

const controls = {
  canvas,
  wSlider,
  offsetSlider,
  wOutput,
  offsetOutput,
  radiusOutput,
  stateOutput,
  rotationOutput,
  selectedOutput,
  selectedLabel,
  rotateButton,
  tossButton,
  resetSelectedButton,
  resetButton,
  debugToggle,
  debugPanel
};

let globalW = 0;
let selectedId = "hypersphere";

const renderer = new THREE.WebGLRenderer({ canvas: controls.canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(controls.canvas.clientWidth, controls.canvas.clientHeight, false);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#f7fbff");

const camera = new THREE.PerspectiveCamera(45, controls.canvas.clientWidth / controls.canvas.clientHeight, 0.1, 100);
camera.position.set(5.5, 4.5, 7);
camera.lookAt(0, 0.8, 0);

scene.add(new THREE.HemisphereLight("#ffffff", "#d8ecff", 2.2));
const keyLight = new THREE.DirectionalLight("#ffffff", 2.5);
keyLight.position.set(4, 7, 5);
scene.add(keyLight);
scene.add(new THREE.GridHelper(9, 18, "#90a4b8", "#d4e0eb"));

const axisLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 1.1, 0), new THREE.Vector3(1.6, 1.1, 0)]),
  new THREE.LineBasicMaterial({ color: "#e15b64" })
);
scene.add(axisLine);

function solidMaterial(color: string) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.28,
    metalness: 0.02,
    transmission: 0.12,
    thickness: 0.45
  });
}

function ghostMaterial(color: string) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.18,
    wireframe: true
  });
}

function makeVisible(kind: ToyKind, color: string): THREE.Object3D {
  if (kind === "hypersphere") {
    return new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 32), solidMaterial(color));
  }
  if (kind === "tesseract") {
    return new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), solidMaterial(color));
  }
  if (kind === "simplex") {
    return new THREE.Mesh(new THREE.TetrahedronGeometry(0.74), solidMaterial(color));
  }
  return new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.18, 24, 64), solidMaterial(color));
}

function makeGhost(kind: ToyKind, color: string): THREE.Object3D {
  if (kind === "hypersphere") {
    return new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 18), ghostMaterial(color));
  }
  if (kind === "tesseract") {
    return new THREE.Mesh(new THREE.BoxGeometry(1.08, 1.08, 1.08), ghostMaterial(color));
  }
  if (kind === "simplex") {
    return new THREE.Mesh(new THREE.TetrahedronGeometry(0.92), ghostMaterial(color));
  }
  return new THREE.Mesh(new THREE.TorusKnotGeometry(0.42, 0.08, 96, 12), ghostMaterial(color));
}

function makeToy(id: string, kind: ToyKind, label: string, color: string, starter: Vec4): ToyState {
  const visible = makeVisible(kind, color);
  const ghost = makeGhost(kind, color);
  visible.position.set(starter.x, 1.1 + starter.y, starter.z);
  ghost.position.copy(visible.position);
  scene.add(ghost, visible);
  return {
    id,
    kind,
    label,
    starter,
    position: { ...starter },
    wOffset: 0,
    rotationPlane: "XW",
    rotation: 0,
    visible,
    ghost
  };
}

const toys = [
  makeToy("hypersphere", "hypersphere", "Hypersphere", "#2f80ed", { x: -2.4, y: 0, z: -1.1, w: 0 }),
  makeToy("tesseract", "tesseract", "Tesseract", "#19a974", { x: 0, y: 0, z: -1.1, w: 0 }),
  makeToy("simplex", "simplex", "5-Cell Simplex", "#b15cff", { x: 2.4, y: 0, z: -1.1, w: 0 }),
  makeToy("duocylinder", "duocylinder", "Duocylinder", "#f2994a", { x: 0, y: 0, z: 1.35, w: 0 })
];

function selectedToy() {
  const toy = toys.find((candidate) => candidate.id === selectedId);
  if (!toy) {
    throw new Error(`Unknown selected toy: ${selectedId}`);
  }
  return toy;
}

function updateToy(toy: ToyState) {
  const slice = toySlice(toy.kind, globalW + toy.wOffset + toy.position.w);
  toy.visible.scale.setScalar(Math.max(slice.scale, 0.001));
  toy.visible.visible = slice.kind === "visible";
  toy.ghost.scale.setScalar(slice.ghostScale);
  toy.ghost.rotation.y = toy.rotation;
  toy.visible.rotation.y = toy.rotation;
  toy.visible.position.set(toy.position.x, 1.1 + toy.position.y, toy.position.z);
  toy.ghost.position.copy(toy.visible.position);
}

function updateUi() {
  const toy = selectedToy();
  const slice = toySlice(toy.kind, globalW + toy.wOffset + toy.position.w);
  controls.wOutput.value = globalW.toFixed(2);
  controls.offsetOutput.value = toy.wOffset.toFixed(2);
  controls.radiusOutput.textContent = slice.scale.toFixed(2);
  controls.stateOutput.textContent = slice.kind;
  controls.rotationOutput.textContent = toy.rotation.toFixed(2);
  controls.selectedOutput.textContent = toy.label;
  controls.selectedLabel.textContent = toy.label;
  controls.offsetSlider.value = toy.wOffset.toFixed(2);
  axisLine.position.copy(toy.visible.position);
  document.body.dataset.sliceState = slice.kind;
  document.body.dataset.selectedToy = toy.id;
  toyButtons.forEach((button) => {
    button.toggleAttribute("aria-pressed", button.dataset.toy === toy.id);
  });
}

function redraw() {
  autoReturnOutOfBounds();
  toys.forEach(updateToy);
  updateUi();
  renderer.render(scene, camera);
}

function resetToy(toy: ToyState) {
  toy.position = { ...toy.starter };
  toy.wOffset = 0;
  toy.rotation = 0;
}

function autoReturnOutOfBounds() {
  toys.forEach((toy) => {
    const distanceFromTable = Math.hypot(toy.position.x, toy.position.z);
    if (distanceFromTable > 4.2) {
      resetToy(toy);
    }
  });
}

toyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedId = button.dataset.toy ?? selectedId;
    redraw();
  });
});

controls.wSlider.addEventListener("input", () => {
  globalW = clampW(Number(controls.wSlider.value));
  redraw();
});

controls.offsetSlider.addEventListener("input", () => {
  selectedToy().wOffset = clampW(Number(controls.offsetSlider.value), 0.8);
  redraw();
});

controls.rotateButton.addEventListener("click", () => {
  const toy = selectedToy();
  toy.position = rotate4(toy.position, toy.rotationPlane, Math.PI / 8);
  toy.rotation += Math.PI / 8;
  redraw();
});

controls.tossButton.addEventListener("click", () => {
  const toy = selectedToy();
  toy.position.x = 5.2;
  toy.position.z = 3.4;
  updateToy(toy);
  renderer.render(scene, camera);
  window.setTimeout(redraw, 650);
});

controls.resetSelectedButton.addEventListener("click", () => {
  resetToy(selectedToy());
  redraw();
});

controls.resetButton.addEventListener("click", () => {
  globalW = 0;
  controls.wSlider.value = "0";
  toys.forEach(resetToy);
  redraw();
});

controls.debugToggle.addEventListener("click", () => {
  const nextHidden = !controls.debugPanel.hidden;
  controls.debugPanel.hidden = nextHidden;
  controls.debugToggle.setAttribute("aria-expanded", String(!nextHidden));
  controls.debugToggle.textContent = nextHidden ? "Show Debug" : "Hide Debug";
});

window.addEventListener("resize", () => {
  renderer.setSize(controls.canvas.clientWidth, controls.canvas.clientHeight, false);
  camera.aspect = controls.canvas.clientWidth / controls.canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

redraw();
