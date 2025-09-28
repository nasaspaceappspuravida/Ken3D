import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Configuración de la Escena 3D ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // alpha:true para fondo transparente

const container = document.getElementById('canvas-container');
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- Controles de Cámara (Opcional, para debug) ---
// const controls = new OrbitControls(camera, renderer.domElement);

// --- Luces ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

camera.position.z = 5;

// --- Modelo del Cohete ---
const loader = new GLTFLoader();
let rocket;

loader.load(
    'rocket.glb', // Asegúrate de que el archivo se llame así
    function (gltf) {
        rocket = gltf.scene;
        rocket.scale.set(0.5, 0.5, 0.5); // Ajusta la escala si es necesario
        rocket.rotation.z = Math.PI / 6; // Inclina un poco el cohete
        scene.add(rocket);
    },
    undefined,
    function (error) {
        console.error('Error al cargar el modelo 3D:', error);
        // Fallback: si no se carga el cohete, muestra un cubo
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0x00aaff });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
    }
);

// --- Fondo de Estrellas ---
const starGeometry = new THREE.BufferGeometry();
const starCount = 10000;
const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 100;
    positions[i3 + 1] = (Math.random() - 0.5) * 100;
    positions[i3 + 2] = (Math.random() - 0.5) * 100;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// --- Interacción con el Mouse ---
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});


// --- Bucle de Animación ---
function animate() {
    requestAnimationFrame(animate);

    // Rotación suave de las estrellas
    stars.rotation.x += 0.0001;
    stars.rotation.y += 0.0001;

    // Animación del cohete
    if (rocket) {
        // Rotación base lenta
        rocket.rotation.y += 0.001;
        // El cohete sigue sutilmente al mouse
        rocket.rotation.z = (mouseY * 0.2) + Math.PI / 6;
        rocket.rotation.x = (mouseX * 0.2);
    }
    
    // controls.update(); // Descomentar si usas OrbitControls
    renderer.render(scene, camera);
}

animate();

// --- Lógica de la Barra de Progreso (Simulación) ---
document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progressBar');
    const progressAmount = document.getElementById('progressAmount');
    const totalGoal = 1550;

    // SIMULACIÓN: Cambia este valor para representar el monto recaudado
    const amountRaised = 420; 
    
    const percentage = (amountRaised / totalGoal) * 100;

    // Animar la barra y el texto al cargar
    setTimeout(() => {
        progressBar.style.width = `${percentage}%`;
        
        let currentAmount = 0;
        const interval = setInterval(() => {
            currentAmount += (amountRaised/100);
            if(currentAmount >= amountRaised) {
                currentAmount = amountRaised;
                clearInterval(interval);
            }
            progressAmount.textContent = `$${Math.floor(currentAmount)}`;
        }, 10);

    }, 500);
});

// --- Manejo del Redimensionamiento de la Ventana ---
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
