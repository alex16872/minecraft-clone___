(self["webpackChunkminecraft_clone"] = self["webpackChunkminecraft_clone"] || []).push([["main"],{

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_libs_stats_module_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/libs/stats.module.js */ "./node_modules/three/examples/jsm/libs/stats.module.js");
/* harmony import */ var three_examples_jsm_controls_FirstPersonControls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/controls/FirstPersonControls.js */ "./node_modules/three/examples/jsm/controls/FirstPersonControls.js");
/* harmony import */ var three_examples_jsm_math_ImprovedNoise_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/math/ImprovedNoise.js */ "./node_modules/three/examples/jsm/math/ImprovedNoise.js");
/* harmony import */ var three_examples_jsm_utils_BufferGeometryUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/utils/BufferGeometryUtils.js */ "./node_modules/three/examples/jsm/utils/BufferGeometryUtils.js");





let container, stats;
let camera, controls, scene, renderer;
const worldWidth = 128;
const worldDepth = 128;
const worldHalfWidth = worldWidth / 2;
const worldHalfDepth = worldDepth / 2;
const data = generateHeight(worldWidth, worldDepth);
const clock = new three__WEBPACK_IMPORTED_MODULE_0__.Clock();
init();
animate();

function init() {
  container = document.getElementById("container");
  camera = new three__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.y = getY(worldHalfWidth, worldHalfDepth) * 100 + 100;
  scene = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();
  scene.background = new three__WEBPACK_IMPORTED_MODULE_0__.Color(0xbfd1e5); // sides

  const matrix = new three__WEBPACK_IMPORTED_MODULE_0__.Matrix4();
  const pxGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry(100, 100);
  pxGeometry.attributes.uv.array[1] = 0.5;
  pxGeometry.attributes.uv.array[3] = 0.5;
  pxGeometry.rotateY(Math.PI / 2);
  pxGeometry.translate(50, 0, 0);
  const nxGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry(100, 100);
  nxGeometry.attributes.uv.array[1] = 0.5;
  nxGeometry.attributes.uv.array[3] = 0.5;
  nxGeometry.rotateY(-Math.PI / 2);
  nxGeometry.translate(-50, 0, 0);
  const pyGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry(100, 100);
  pyGeometry.attributes.uv.array[5] = 0.5;
  pyGeometry.attributes.uv.array[7] = 0.5;
  pyGeometry.rotateX(-Math.PI / 2);
  pyGeometry.translate(0, 50, 0);
  const pzGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry(100, 100);
  pzGeometry.attributes.uv.array[1] = 0.5;
  pzGeometry.attributes.uv.array[3] = 0.5;
  pzGeometry.translate(0, 0, 50);
  const nzGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry(100, 100);
  nzGeometry.attributes.uv.array[1] = 0.5;
  nzGeometry.attributes.uv.array[3] = 0.5;
  nzGeometry.rotateY(Math.PI);
  nzGeometry.translate(0, 0, -50); //

  const geometries = [];

  for (let z = 0; z < worldDepth; z++) {
    for (let x = 0; x < worldWidth; x++) {
      const h = getY(x, z);
      matrix.makeTranslation(x * 100 - worldHalfWidth * 100, h * 100, z * 100 - worldHalfDepth * 100);
      const px = getY(x + 1, z);
      const nx = getY(x - 1, z);
      const pz = getY(x, z + 1);
      const nz = getY(x, z - 1);
      geometries.push(pyGeometry.clone().applyMatrix4(matrix));

      if (px !== h && px !== h + 1 || x === 0) {
        geometries.push(pxGeometry.clone().applyMatrix4(matrix));
      }

      if (nx !== h && nx !== h + 1 || x === worldWidth - 1) {
        geometries.push(nxGeometry.clone().applyMatrix4(matrix));
      }

      if (pz !== h && pz !== h + 1 || z === worldDepth - 1) {
        geometries.push(pzGeometry.clone().applyMatrix4(matrix));
      }

      if (nz !== h && nz !== h + 1 || z === 0) {
        geometries.push(nzGeometry.clone().applyMatrix4(matrix));
      }
    }
  }

  const geometry = three_examples_jsm_utils_BufferGeometryUtils_js__WEBPACK_IMPORTED_MODULE_1__.BufferGeometryUtils.mergeBufferGeometries(geometries);
  geometry.computeBoundingSphere();
  const texture = new three__WEBPACK_IMPORTED_MODULE_0__.TextureLoader().load("assets/textures/grass.png");
  texture.magFilter = three__WEBPACK_IMPORTED_MODULE_0__.NearestFilter;
  const mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(geometry, new three__WEBPACK_IMPORTED_MODULE_0__.MeshLambertMaterial({
    map: texture,
    side: three__WEBPACK_IMPORTED_MODULE_0__.DoubleSide
  }));
  scene.add(mesh);
  const ambientLight = new three__WEBPACK_IMPORTED_MODULE_0__.AmbientLight(0xcccccc);
  scene.add(ambientLight);
  const directionalLight = new three__WEBPACK_IMPORTED_MODULE_0__.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 0.5).normalize();
  scene.add(directionalLight);
  renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  controls = new three_examples_jsm_controls_FirstPersonControls_js__WEBPACK_IMPORTED_MODULE_2__.FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 1000;
  controls.lookSpeed = 0.125;
  controls.lookVertical = true;
  stats = new three_examples_jsm_libs_stats_module_js__WEBPACK_IMPORTED_MODULE_3__.default();
  container.appendChild(stats.dom); //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
}

function generateHeight(width, height) {
  const data = [],
        perlin = new three_examples_jsm_math_ImprovedNoise_js__WEBPACK_IMPORTED_MODULE_4__.ImprovedNoise(),
        size = width * height,
        z = Math.random() * 100;
  let quality = 2;

  for (let j = 0; j < 4; j++) {
    if (j === 0) for (let i = 0; i < size; i++) data[i] = 0;

    for (let i = 0; i < size; i++) {
      const x = i % width,
            y = i / width | 0;
      data[i] += perlin.noise(x / quality, y / quality, z) * quality;
    }

    quality *= 4;
  }

  return data;
}

function getY(x, z) {
  return data[x + z * worldWidth] * 0.2 | 0;
} //


function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
}

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors"], () => (__webpack_exec__("./src/js/app.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9taW5lY3JhZnQtY2xvbmUvLi9zcmMvanMvYXBwLmpzIl0sIm5hbWVzIjpbImNvbnRhaW5lciIsInN0YXRzIiwiY2FtZXJhIiwiY29udHJvbHMiLCJzY2VuZSIsInJlbmRlcmVyIiwid29ybGRXaWR0aCIsIndvcmxkRGVwdGgiLCJ3b3JsZEhhbGZXaWR0aCIsIndvcmxkSGFsZkRlcHRoIiwiZGF0YSIsImdlbmVyYXRlSGVpZ2h0IiwiY2xvY2siLCJUSFJFRSIsImluaXQiLCJhbmltYXRlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsInBvc2l0aW9uIiwieSIsImdldFkiLCJiYWNrZ3JvdW5kIiwibWF0cml4IiwicHhHZW9tZXRyeSIsImF0dHJpYnV0ZXMiLCJ1diIsImFycmF5Iiwicm90YXRlWSIsIk1hdGgiLCJQSSIsInRyYW5zbGF0ZSIsIm54R2VvbWV0cnkiLCJweUdlb21ldHJ5Iiwicm90YXRlWCIsInB6R2VvbWV0cnkiLCJuekdlb21ldHJ5IiwiZ2VvbWV0cmllcyIsInoiLCJ4IiwiaCIsIm1ha2VUcmFuc2xhdGlvbiIsInB4IiwibngiLCJweiIsIm56IiwicHVzaCIsImNsb25lIiwiYXBwbHlNYXRyaXg0IiwiZ2VvbWV0cnkiLCJCdWZmZXJHZW9tZXRyeVV0aWxzIiwiY29tcHV0ZUJvdW5kaW5nU3BoZXJlIiwidGV4dHVyZSIsImxvYWQiLCJtYWdGaWx0ZXIiLCJtZXNoIiwibWFwIiwic2lkZSIsIkRvdWJsZVNpZGUiLCJhZGQiLCJhbWJpZW50TGlnaHQiLCJkaXJlY3Rpb25hbExpZ2h0Iiwic2V0Iiwibm9ybWFsaXplIiwiYW50aWFsaWFzIiwic2V0UGl4ZWxSYXRpbyIsImRldmljZVBpeGVsUmF0aW8iLCJzZXRTaXplIiwiYXBwZW5kQ2hpbGQiLCJkb21FbGVtZW50IiwiRmlyc3RQZXJzb25Db250cm9scyIsIm1vdmVtZW50U3BlZWQiLCJsb29rU3BlZWQiLCJsb29rVmVydGljYWwiLCJTdGF0cyIsImRvbSIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbldpbmRvd1Jlc2l6ZSIsImFzcGVjdCIsInVwZGF0ZVByb2plY3Rpb25NYXRyaXgiLCJoYW5kbGVSZXNpemUiLCJ3aWR0aCIsImhlaWdodCIsInBlcmxpbiIsIkltcHJvdmVkTm9pc2UiLCJzaXplIiwicmFuZG9tIiwicXVhbGl0eSIsImoiLCJpIiwibm9pc2UiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyZW5kZXIiLCJ1cGRhdGUiLCJnZXREZWx0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBLElBQUlBLFNBQUosRUFBZUMsS0FBZjtBQUVBLElBQUlDLE1BQUosRUFBWUMsUUFBWixFQUFzQkMsS0FBdEIsRUFBNkJDLFFBQTdCO0FBRUEsTUFBTUMsVUFBVSxHQUFHLEdBQW5CO0FBQ0EsTUFBTUMsVUFBVSxHQUFHLEdBQW5CO0FBQ0EsTUFBTUMsY0FBYyxHQUFHRixVQUFVLEdBQUcsQ0FBcEM7QUFDQSxNQUFNRyxjQUFjLEdBQUdGLFVBQVUsR0FBRyxDQUFwQztBQUNBLE1BQU1HLElBQUksR0FBR0MsY0FBYyxDQUFDTCxVQUFELEVBQWFDLFVBQWIsQ0FBM0I7QUFFQSxNQUFNSyxLQUFLLEdBQUcsSUFBSUMsd0NBQUosRUFBZDtBQUVBQyxJQUFJO0FBQ0pDLE9BQU87O0FBRVAsU0FBU0QsSUFBVCxHQUFnQjtBQUNkZCxXQUFTLEdBQUdnQixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBWjtBQUVBZixRQUFNLEdBQUcsSUFBSVcsb0RBQUosQ0FDUCxFQURPLEVBRVBLLE1BQU0sQ0FBQ0MsVUFBUCxHQUFvQkQsTUFBTSxDQUFDRSxXQUZwQixFQUdQLENBSE8sRUFJUCxLQUpPLENBQVQ7QUFNQWxCLFFBQU0sQ0FBQ21CLFFBQVAsQ0FBZ0JDLENBQWhCLEdBQW9CQyxJQUFJLENBQUNmLGNBQUQsRUFBaUJDLGNBQWpCLENBQUosR0FBdUMsR0FB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QUFFREEsV0FBTyxJQUFJLENBQVg7QUFDRDs7QUFFRCxTQUFPL0UsSUFBUDtBQUNEOztBQUVELFNBQVNhLElBQVQsQ0FBY2tCLENBQWQsRUFBaUJELENBQWpCLEVBQW9CO0FBQ2xCLFNBQVE5QixJQUFJLENBQUMrQixDQUFDLEdBQUdELENBQUMsR0FBR2xDLFVBQVQsQ0FBSixHQUEyQixHQUE1QixHQUFtQyxDQUExQztBQUNELEMsQ0FFRDs7O0FBRUEsU0FBU1MsT0FBVCxHQUFtQjtBQUNqQjhFLHVCQUFxQixDQUFDOUUsT0FBRCxDQUFyQjtBQUVBK0UsUUFBTTtBQUNON0YsT0FBSyxDQUFDOEYsTUFBTjtBQUNEOztBQUVELFNBQVNELE1BQVQsR0FBa0I7QUFDaEIzRixVQUFRLENBQUM0RixNQUFULENBQWdCbkYsS0FBSyxDQUFDb0YsUUFBTixFQUFoQjtBQUNBM0YsVUFBUSxDQUFDeUYsTUFBVCxDQUFnQjFGLEtBQWhCLEVBQXVCRixNQUF2QjtBQUNELEMiLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuaW1wb3J0IFN0YXRzIGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbGlicy9zdGF0cy5tb2R1bGUuanNcIjtcblxuaW1wb3J0IHsgRmlyc3RQZXJzb25Db250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvRmlyc3RQZXJzb25Db250cm9scy5qc1wiO1xuaW1wb3J0IHsgSW1wcm92ZWROb2lzZSB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbWF0aC9JbXByb3ZlZE5vaXNlLmpzXCI7XG5pbXBvcnQgeyBCdWZmZXJHZW9tZXRyeVV0aWxzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS91dGlscy9CdWZmZXJHZW9tZXRyeVV0aWxzLmpzXCI7XG5cbmxldCBjb250YWluZXIsIHN0YXRzO1xuXG5sZXQgY2FtZXJhLCBjb250cm9scywgc2NlbmUsIHJlbmRlcmVyO1xuXG5jb25zdCB3b3JsZFdpZHRoID0gMTI4O1xuY29uc3Qgd29ybGREZXB0aCA9IDEyODtcbmNvbnN0IHdvcmxkSGFsZldpZHRoID0gd29ybGRXaWR0aCAvIDI7XG5jb25zdCB3b3JsZEhhbGZEZXB0aCA9IHdvcmxkRGVwdGggLyAyO1xuY29uc3QgZGF0YSA9IGdlbmVyYXRlSGVpZ2h0KHdvcmxkV2lkdGgsIHdvcmxkRGVwdGgpO1xuXG5jb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuXG5pbml0KCk7XG5hbmltYXRlKCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyXCIpO1xuXG4gIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICA2MCxcbiAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAxLFxuICAgIDIwMDAwXG4gICk7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gZ2V0WSh3b3JsZEhhbGZXaWR0aCwgd29ybGRIYWxmRGVwdGgpICogMTAwICsgMTAwO1xuXG4gIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoMHhiZmQxZTUpO1xuXG4gIC8vIHNpZGVzXG5cbiAgY29uc3QgbWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcblxuICBjb25zdCBweEdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMTAwLCAxMDApO1xuICBweEdlb21ldHJ5LmF0dHJpYnV0ZXMudXYuYXJyYXlbMV0gPSAwLjU7XG4gIHB4R2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVszXSA9IDAuNTtcbiAgcHhHZW9tZXRyeS5yb3RhdGVZKE1hdGguUEkgLyAyKTtcbiAgcHhHZW9tZXRyeS50cmFuc2xhdGUoNTAsIDAsIDApO1xuXG4gIGNvbnN0IG54R2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxMDAsIDEwMCk7XG4gIG54R2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVsxXSA9IDAuNTtcbiAgbnhHZW9tZXRyeS5hdHRyaWJ1dGVzLnV2LmFycmF5WzNdID0gMC41O1xuICBueEdlb21ldHJ5LnJvdGF0ZVkoLU1hdGguUEkgLyAyKTtcbiAgbnhHZW9tZXRyeS50cmFuc2xhdGUoLTUwLCAwLCAwKTtcblxuICBjb25zdCBweUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMTAwLCAxMDApO1xuICBweUdlb21ldHJ5LmF0dHJpYnV0ZXMudXYuYXJyYXlbNV0gPSAwLjU7XG4gIHB5R2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVs3XSA9IDAuNTtcbiAgcHlHZW9tZXRyeS5yb3RhdGVYKC1NYXRoLlBJIC8gMik7XG4gIHB5R2VvbWV0cnkudHJhbnNsYXRlKDAsIDUwLCAwKTtcblxuICBjb25zdCBwekdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMTAwLCAxMDApO1xuICBwekdlb21ldHJ5LmF0dHJpYnV0ZXMudXYuYXJyYXlbMV0gPSAwLjU7XG4gIHB6R2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVszXSA9IDAuNTtcbiAgcHpHZW9tZXRyeS50cmFuc2xhdGUoMCwgMCwgNTApO1xuXG4gIGNvbnN0IG56R2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxMDAsIDEwMCk7XG4gIG56R2VvbWV0cnkuYXR0cmlidXRlcy51di5hcnJheVsxXSA9IDAuNTtcbiAgbnpHZW9tZXRyeS5hdHRyaWJ1dGVzLnV2LmFycmF5WzNdID0gMC41O1xuICBuekdlb21ldHJ5LnJvdGF0ZVkoTWF0aC5QSSk7XG4gIG56R2VvbWV0cnkudHJhbnNsYXRlKDAsIDAsIC01MCk7XG5cbiAgLy9cblxuICBjb25zdCBnZW9tZXRyaWVzID0gW107XG5cbiAgZm9yIChsZXQgeiA9IDA7IHogPCB3b3JsZERlcHRoOyB6KyspIHtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHdvcmxkV2lkdGg7IHgrKykge1xuICAgICAgY29uc3QgaCA9IGdldFkoeCwgeik7XG5cbiAgICAgIG1hdHJpeC5tYWtlVHJhbnNsYXRpb24oXG4gICAgICAgIHggKiAxMDAgLSB3b3JsZEhhbGZXaWR0aCAqIDEwMCxcbiAgICAgICAgaCAqIDEwMCxcbiAgICAgICAgeiAqIDEwMCAtIHdvcmxkSGFsZkRlcHRoICogMTAwXG4gICAgICApO1xuXG4gICAgICBjb25zdCBweCA9IGdldFkoeCArIDEsIHopO1xuICAgICAgY29uc3QgbnggPSBnZXRZKHggLSAxLCB6KTtcbiAgICAgIGNvbnN0IHB6ID0gZ2V0WSh4LCB6ICsgMSk7XG4gICAgICBjb25zdCBueiA9IGdldFkoeCwgeiAtIDEpO1xuXG4gICAgICBnZW9tZXRyaWVzLnB1c2gocHlHZW9tZXRyeS5jbG9uZSgpLmFwcGx5TWF0cml4NChtYXRyaXgpKTtcblxuICAgICAgaWYgKChweCAhPT0gaCAmJiBweCAhPT0gaCArIDEpIHx8IHggPT09IDApIHtcbiAgICAgICAgZ2VvbWV0cmllcy5wdXNoKHB4R2VvbWV0cnkuY2xvbmUoKS5hcHBseU1hdHJpeDQobWF0cml4KSk7XG4gICAgICB9XG5cbiAgICAgIGlmICgobnggIT09IGggJiYgbnggIT09IGggKyAxKSB8fCB4ID09PSB3b3JsZFdpZHRoIC0gMSkge1xuICAgICAgICBnZW9tZXRyaWVzLnB1c2gobnhHZW9tZXRyeS5jbG9uZSgpLmFwcGx5TWF0cml4NChtYXRyaXgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKChweiAhPT0gaCAmJiBweiAhPT0gaCArIDEpIHx8IHogPT09IHdvcmxkRGVwdGggLSAxKSB7XG4gICAgICAgIGdlb21ldHJpZXMucHVzaChwekdlb21ldHJ5LmNsb25lKCkuYXBwbHlNYXRyaXg0KG1hdHJpeCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoKG56ICE9PSBoICYmIG56ICE9PSBoICsgMSkgfHwgeiA9PT0gMCkge1xuICAgICAgICBnZW9tZXRyaWVzLnB1c2gobnpHZW9tZXRyeS5jbG9uZSgpLmFwcGx5TWF0cml4NChtYXRyaXgpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBnZW9tZXRyeSA9IEJ1ZmZlckdlb21ldHJ5VXRpbHMubWVyZ2VCdWZmZXJHZW9tZXRyaWVzKGdlb21ldHJpZXMpO1xuICBnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTtcblxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKS5sb2FkKFwiYXNzZXRzL3RleHR1cmVzL2dyYXNzLnBuZ1wiKTtcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuXG4gIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChcbiAgICBnZW9tZXRyeSxcbiAgICBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICBtYXA6IHRleHR1cmUsXG4gICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuICAgIH0pXG4gICk7XG4gIHNjZW5lLmFkZChtZXNoKTtcblxuICBjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4Y2NjY2NjKTtcbiAgc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XG5cbiAgY29uc3QgZGlyZWN0aW9uYWxMaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAyKTtcbiAgZGlyZWN0aW9uYWxMaWdodC5wb3NpdGlvbi5zZXQoMSwgMSwgMC41KS5ub3JtYWxpemUoKTtcbiAgc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQpO1xuXG4gIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgY29udHJvbHMgPSBuZXcgRmlyc3RQZXJzb25Db250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIGNvbnRyb2xzLm1vdmVtZW50U3BlZWQgPSAxMDAwO1xuICBjb250cm9scy5sb29rU3BlZWQgPSAwLjEyNTtcbiAgY29udHJvbHMubG9va1ZlcnRpY2FsID0gdHJ1ZTtcblxuICBzdGF0cyA9IG5ldyBTdGF0cygpO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcblxuICAvL1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplKTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXG4gIGNvbnRyb2xzLmhhbmRsZVJlc2l6ZSgpO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUhlaWdodCh3aWR0aCwgaGVpZ2h0KSB7XG4gIGNvbnN0IGRhdGEgPSBbXSxcbiAgICBwZXJsaW4gPSBuZXcgSW1wcm92ZWROb2lzZSgpLFxuICAgIHNpemUgPSB3aWR0aCAqIGhlaWdodCxcbiAgICB6ID0gTWF0aC5yYW5kb20oKSAqIDEwMDtcblxuICBsZXQgcXVhbGl0eSA9IDI7XG5cbiAgZm9yIChsZXQgaiA9IDA7IGogPCA0OyBqKyspIHtcbiAgICBpZiAoaiA9PT0gMCkgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIGRhdGFbaV0gPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IHggPSBpICUgd2lkdGgsXG4gICAgICAgIHkgPSAoaSAvIHdpZHRoKSB8IDA7XG4gICAgICBkYXRhW2ldICs9IHBlcmxpbi5ub2lzZSh4IC8gcXVhbGl0eSwgeSAvIHF1YWxpdHksIHopICogcXVhbGl0eTtcbiAgICB9XG5cbiAgICBxdWFsaXR5ICo9IDQ7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gZ2V0WSh4LCB6KSB7XG4gIHJldHVybiAoZGF0YVt4ICsgeiAqIHdvcmxkV2lkdGhdICogMC4yKSB8IDA7XG59XG5cbi8vXG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcblxuICByZW5kZXIoKTtcbiAgc3RhdHMudXBkYXRlKCk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgY29udHJvbHMudXBkYXRlKGNsb2NrLmdldERlbHRhKCkpO1xuICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9