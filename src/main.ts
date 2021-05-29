import "./main.css";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import {
  cactus,
  copy,
  surface,
  terrainHeight,
  tileSize,
  tileTextureWidth,
  tileTextureHeight,
  chunkSize,
  neighborOffsets,
  glowingBlocks,
  surroundingOffsets,
} from "./constants";
import { World } from "./VoxelWorld";
import { Loop } from "./Loop";
import { Player } from "./Player";
import { initSky } from "./sky";

import {
  ACESFilmicToneMapping,
  Color,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from "three";

let camera: PerspectiveCamera;
let scene: Scene;
let canvas: HTMLCanvasElement;
let world: World;
let player: Player;
let renderer: WebGLRenderer;
let renderRequested = false;
const blocker = document.getElementById("blocker");
const crosshairs = document.getElementById("crosshair-container");
const instructions = document.getElementById("instructions");
let menu = true;

const loopSize = 3;
let minX = -loopSize;
let maxX = loopSize;
let x = minX;
let minY = -loopSize;
let maxY = loopSize;
let y = minY;

init();

function generateChunkAtPosition(pos: Vector3) {
  world.generateChunkData(pos);
  world.updateVoxelGeometry(pos.toArray());
  requestRenderIfNotRequested();
}

function generateChunksAroundCamera() {
  for (let x = -2; x <= 2; x++) {
    for (let y = -2; y <= 2; y++) {
      for (let z = -1; z < 0; z++) {
        const offset = new Vector3(x, z, y).multiplyScalar(chunkSize);
        const newPos = player.position.add(offset);
        generateChunkAtPosition(newPos);
      }
    }
  }
}

function placeVoxel(event) {
  if ((event.button !== 0 && event.button !== 2) || menu) return;

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const x = (pos.x / window.innerWidth) * 2 - 1;
  const y = (pos.y / window.innerHeight) * -2 + 1; // note we flip Y

  const start = new Vector3();
  const end = new Vector3();
  start.setFromMatrixPosition(camera.matrixWorld);
  end.set(x, y, 1).unproject(camera);

  const intersection = world.intersectRay(start, end);
  if (intersection) {
    const voxelId = event.button === 0 ? 0 : cactus;
    const pos = intersection.position
      .map((v, ndx) => {
        return v + intersection.normal[ndx] * (voxelId > 0 ? 0.5 : -0.5);
      })
      .map((coord) => Math.floor(coord)) as [number, number, number];

    const distanceFromPlayerHead = new Vector3(...pos).sub(player.pos).length();
    const distanceFromPlayerFeet = new Vector3(...pos)
      .sub(copy(player.pos).setY(player.pos.y - 1))
      .length();
    if (
      (distanceFromPlayerHead < 1 || distanceFromPlayerFeet < 1) &&
      voxelId !== 0
    ) {
      console.log("Trying to create block within player!");
      return;
    }
    console.log("Setting voxel at ", pos);
    world.setVoxel(pos, voxelId);
    const emanatingLight = glowingBlocks.includes(voxelId) ? 15 : 0;
    const neighborLight = neighborOffsets.reduce((maxLight, offset) => {
      const neighborPos = pos.map(
        (coord, i) => coord + offset.toArray()[i]
      ) as [number, number, number];
      const { light } = world.getVoxel(neighborPos);
      return light > maxLight ? light : maxLight;
    }, 0);
    const lightValue = Math.max(emanatingLight, neighborLight - 1);
    world.setLightValue(pos, lightValue);

    world.floodLight([pos], () => {
      const chunksToUpdateSet = new Set<string>();
      const startingChunkId = world.computeChunkIndex(pos);
      surroundingOffsets.forEach((offset) => {
        const chunkIdWithOffset = startingChunkId
          .split(",")
          .map((coord, idx) => (parseInt(coord) + offset[idx]) * chunkSize)
          .join(",");
        chunksToUpdateSet.add(chunkIdWithOffset);
      });
      console.log({ chunksToUpdateSet });
      chunksToUpdateSet.forEach((chunkId) => {
        // console.log(chunkCoordinates);
        const chunkCoordinates = chunkId
          .split(",")
          .map((coord) => parseInt(coord)) as [number, number, number];
        world.updateChunkGeometry(chunkCoordinates);
      });
      // world.updateVoxelGeometry(...pos);
      requestRenderIfNotRequested();
    });
  }
}

function init() {
  const near = 0.01;
  camera = new PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    near,
    20000
  );
  camera.position.y = terrainHeight + 5;

  canvas = document.querySelector("#canvas");
  renderer = new WebGLRenderer({ antialias: true, canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;

  scene = new Scene();
  scene.background = new Color(0xbfd1e5);

  world = new World({
    chunkSize,
    tileSize,
    tileTextureWidth,
    tileTextureHeight,
    scene,
  });

  const loop = new Loop(camera, scene, renderer);
  player = new Player(new PointerLockControls(camera, document.body), world);
  loop.register(player);
  // loop.register({
  //   tick: (_delta: number) => generateChunksInMovementDirection(),
  // });
  loop.start();

  blocker.addEventListener("click", function () {
    player.controls.lock();
  });

  player.controls.addEventListener("lock", function () {
    menu = false;
    instructions.style.display = "none";
    blocker.style.display = "none";
    crosshairs.style.display = "flex";
  });

  player.controls.addEventListener("unlock", function () {
    menu = true;
    blocker.style.display = "flex";
    instructions.style.display = "";
    crosshairs.style.display = "none";
  });

  const onKeyPress = (event) => {
    if (event.repeat) {
      return;
    }
    switch (event.code) {
      case "KeyF":
        console.log("Pressed F");
        const pos = player.controls.getObject().position;
        const newPos = new Vector3(0, terrainHeight + 5, 0);
        pos.y = newPos.y;
        pos.x = newPos.x;
        pos.z = newPos.z;

        break;
      case "KeyG":
        console.log("Pressed G", player.pos);
        console.log(
          "X is stuck",
          player.pos.x - Math.floor(player.pos.x) <= 0.001
        );
        console.log(
          "Z is stuck",
          player.pos.z - Math.floor(player.pos.z) <= 0.001
        );
        break;
    }
  };

  document.removeEventListener("keypress", onKeyPress);
  document.addEventListener("keypress", onKeyPress);
  window.addEventListener("click", placeVoxel);

  scene.add(player.controls.getObject());

  window.addEventListener("resize", onWindowResize);
  generateChunksAroundCamera();
  // spawnSingleBlock();

  initSky(camera, scene, renderer);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  renderRequested = false;
  generateTerrain();
  renderer.render(scene, camera);
}

function requestRenderIfNotRequested() {
  if (!renderRequested) {
    renderRequested = true;
    requestAnimationFrame(render);
  }
}

function generateTerrain() {
  if (maxX > 5) return;

  if (renderer.info.render.frame % 5 === 0) {
    const pos = new Vector3(x * chunkSize, surface - chunkSize, y * chunkSize);

    generateChunkAtPosition(pos);
    generateChunkAtPosition(copy(pos).sub(new Vector3(0, 1 * chunkSize, 0)));
    generateChunkAtPosition(copy(pos).sub(new Vector3(0, 2 * chunkSize, 0)));

    if (y === maxY && x === maxX - 1) {
      console.log("Finished loop");
      minX--;
      maxX++;
      x = minX;
      minY--;
      maxY++;
      y = minY;
    } else {
      if (y === maxY && x > minX && x < maxX) {
        x++;
      }
      if (y === maxY && x === maxX) {
        x = minX + 1;
      }
      if (y >= minY && y < maxY && x === maxX) {
        y++;
      }

      if (x > minX && x < maxX && y === minY) {
        x++;
      }

      if (x === minX) {
        if (y === maxY) {
          x++;
          y = minY;
        } else {
          y++;
        }
      }
    }
  }
}
