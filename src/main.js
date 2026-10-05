import * as THREE from "three";
import "./style.css";

console.log("Scroll Story — project is set up and ready.");

/*
  Three.js Quick Start Guide (for beginners):
  --------------------------------------------
  A Three.js app needs three things:
  1. A "scene" — the container that holds 3D objects, lights, and the camera.
  2. A "camera" — defines what part of the 3D world is visible (like your
     eye or a movie camera).
  3. A "renderer" — takes the 3D scene and draws it as pixels on the
     browser's <canvas> element.
*/

// init() runs once the HTML page is ready so the canvas element exists.
window.addEventListener("DOMContentLoaded", init);

function init() {
  // ---- 1. SCENE ----
  // The scene is like a universe container. Everything we want to see
  // in 3D — objects, lights, even the camera — gets added to it.
  const scene = new THREE.Scene();

  // ---- 2. CAMERA ----
  // The perspective camera simulates how humans see: objects farther away
  // look smaller, giving a realistic 3D depth effect.
  // Parameters: (field of view, aspect ratio, near plane, far plane)
  const camera = new THREE.PerspectiveCamera(
    75,                                              // field of view (degrees)
    window.innerWidth / window.innerHeight,           // aspect ratio
    0.1,                                             // near clipping plane
    1000                                             // far clipping plane
  );

  // Move the camera back so the object fits on screen.
  // z = 5 means 5 units away from the center.
  camera.position.z = 5;

  // ---- 3. RENDERER ----
  // The renderer takes what the camera sees and draws it onto a <canvas>.
  // We reuse the existing <canvas id="webgl-canvas"> from index.html
  // instead of letting Three.js create a new one.
  // "alpha: true" makes the canvas background transparent, so the page's
  // CSS background shows through — this is what lets the 3D object float
  // behind the HTML text without hiding it.
  // Why is the canvas behind the HTML? The canvas has CSS
  // "position: fixed; z-index: 0" while the content has
  // "z-index: 1", so the text always renders on top.
  const canvas = document.getElementById("webgl-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ---- 4. LIGHTING ----
  // Ambient light lights up everything evenly so no side is completely dark.
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Directional light acts like sunlight, creating highlights and soft shadows.
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  // ---- 5. 3D OBJECT ----
  // An icosahedron is a 20-sided shape that looks like a smooth sphere
  // when the detail level is high. We place it on the RIGHT side.
  const geometry = new THREE.IcosahedronGeometry(1.2, 3);
  const material = new THREE.MeshStandardMaterial({
    color: 0xd4a373,      // warm terracotta — matches the CSS accent
    metalness: 0.8,       // 0 = plastic, 1 = mirror (high = glossy)
    roughness: 0.1,       // 0 = perfectly smooth, 1 = rough (low = glossy)
  });
  const object = new THREE.Mesh(geometry, material);

  // Position the object on the right side of the screen.
  // x = 2.5 pushes it toward the right edge, away from the centered text.
  object.position.set(2.5, 0, 0);
  scene.add(object);

  // ---- 6. ANIMATION LOOP ----
  // animate() runs about 60 times per second (once per frame).
  // Each time it does two things:
  //   a) rotates the object by a tiny amount (the gentle spin), and
  //   b) tells the renderer to draw the scene from the camera's view.
  // How rotation works: rotating by 0.003 radians each frame on the Y
  // axis makes the object spin left-and-right slowly. The small X
  // rotation adds a gentle tilt so it doesn't spin perfectly flat.
  function animate() {
    requestAnimationFrame(animate);

    object.rotation.y += 0.003; // spin around Y axis (left-right)
    object.rotation.x += 0.001; // slight tilt around X axis (up-down)

    renderer.render(scene, camera);
  }
  animate();

  // ---- 7. HANDLE WINDOW RESIZING ----
  // When the browser window changes size, update the camera and renderer
  // so the object doesn't stretch or distort.
  // On small screens we also scale the object down so it doesn't
  // cover the text.
  window.addEventListener("resize", onWindowResize);

  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

    // On mobile (width < 640px), shrink and reposition the object
    // to the upper-right so it doesn't overlap with centered text.
    if (width < 640) {
      object.position.set(3, -0.8, 0);
      object.scale.set(0.6, 0.6, 0.6);
    } else {
      object.position.set(2.5, 0, 0);
      object.scale.set(1, 1, 1);
    }
  }
}

// Hero "Click Me" popup interaction
function initHeroPopup() {
  const button = document.querySelector(".hero-cta");
  const popup = document.querySelector(".hero-popup");
  const closeBtn = document.querySelector(".hero-popup-close");

  if (!button || !popup || !closeBtn) return;

  button.addEventListener("click", function() {
    popup.classList.add("show");
    popup.setAttribute("aria-hidden", "false");
  });

  closeBtn.addEventListener("click", function() {
    popup.classList.remove("show");
    popup.setAttribute("aria-hidden", "true");
  });
}

initHeroPopup();
