// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Magnetic Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const magneticElements = document.querySelectorAll('[data-magnetic]');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animation loop for smooth follower interpolation
function loop() {
    if (window.innerWidth > 768) {
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    }
    
    requestAnimationFrame(loop);
}
loop();

// Magnetic Effect on Hover
magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        
        gsap.to(el, {
            x: distX * 0.2,
            y: distY * 0.2,
            duration: 0.4,
            ease: "power2.out"
        });
        
        cursor.classList.add('magnetic-hover');
        follower.classList.add('magnetic-hover');
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
        
        cursor.classList.remove('magnetic-hover');
        follower.classList.remove('magnetic-hover');
    });
});


// GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Fade Up Elements
const fadeElements = document.querySelectorAll('.fade-up');
fadeElements.forEach(el => {
    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none reverse"
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
    });
});

// Parallax Effects for elements with data-speed
gsap.utils.toArray('[data-speed]').forEach(el => {
    const speed = el.getAttribute('data-speed');
    gsap.to(el, {
        y: (i, target) => -100 * speed,
        ease: "none",
        scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// Three.js Background Implementation (Advanced 3D)
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070709, 0.035);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Advanced 3D Materials (Frosted Glass / Neon Core)
const materials = [
    new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 1.5
    }),
    new THREE.MeshPhysicalMaterial({
        color: 0x8a2be2,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 1.5
    }),
    new THREE.MeshPhysicalMaterial({
        color: 0xccff00,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 1.5
    })
];

const geometries = [
    new THREE.IcosahedronGeometry(1.5, 0),
    new THREE.TorusKnotGeometry(1, 0.3, 100, 16),
    new THREE.OctahedronGeometry(1.4, 0),
    new THREE.TetrahedronGeometry(1.6, 0),
    new THREE.TorusGeometry(1.3, 0.4, 16, 100),
    new THREE.DodecahedronGeometry(1.5, 0),
];
const isMobile = window.innerWidth < 768;
const shapes = [];
const numShapes = isMobile ? 8 : 20;

for (let i = 0; i < numShapes; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const mat = materials[Math.floor(Math.random() * materials.length)];
    const mesh = new THREE.Mesh(geo, mat);
    
    // Spread across standard 100vh hero and down the 500vh page height
    mesh.position.x = (Math.random() - 0.5) * 25;
    
    // Guarantee the first few shapes are always near the camera at the top
    if (i < 4) {
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10 - 2; 
    } else {
        mesh.position.y = (Math.random() - 0.5) * 40; 
        mesh.position.z = (Math.random() - 0.5) * 15 - 5;
    }
    
    mesh.userData = {
        originalY: mesh.position.y,
        rotationSpeedX: (Math.random() - 0.5) * 0.015,
        rotationSpeedY: (Math.random() - 0.5) * 0.015,
        floatSpeed: Math.random() * 0.5 + 0.5,
        floatOffset: Math.random() * Math.PI * 2
    };

    scene.add(mesh);
    shapes.push(mesh);
}

// Particle System (Starfield)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = isMobile ? 500 : 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i=0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 60;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: '#ccff00',
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Emphasized 3D Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x00f0ff, 4, 30);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x8a2be2, 4, 30);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xccff00, 3, 30);
pointLight3.position.set(0, -10, 0);
scene.add(pointLight3);

// Interaction & Scroll Logic
let targetX = 0;
let targetY = 0;
let currentScrollY = window.scrollY;

document.addEventListener('mousemove', (event) => {
    targetX = (event.clientX / window.innerWidth) * 2 - 1;
    targetY = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('scroll', () => {
    currentScrollY = window.scrollY;
});

// Render Loop
const clock = new THREE.Clock();

function animateThree() {
    const elapsedTime = clock.getElapsedTime();

    // Smooth scroll and mouse parallax mapped to Camera
    const targetCameraY = -(currentScrollY * 0.015) + (targetY * 1.5);
    camera.position.y += (targetCameraY - camera.position.y) * 0.05;
    camera.position.x += (targetX * 2 - camera.position.x) * 0.05;

    shapes.forEach((shape) => {
        // Continuous 3D rotation
        shape.rotation.x += shape.userData.rotationSpeedX;
        shape.rotation.y += shape.userData.rotationSpeedY;
        
        // Gentle vertical floating in world-space
        shape.position.y = shape.userData.originalY + Math.sin(elapsedTime * shape.userData.floatSpeed + shape.userData.floatOffset) * 1.5;
    });

    // Animate Particles
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    renderer.render(scene, camera);
    requestAnimationFrame(animateThree);
}
animateThree();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Horizontal Scroll for Process Timeline
const processWrapper = document.querySelector('.process-wrapper');
const processScroll = document.querySelector('.process-horizontal-scroll');

if (processWrapper && processScroll) {
    let scrollWidth = processScroll.scrollWidth - window.innerWidth;
    
    gsap.to(processScroll, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
            trigger: processWrapper,
            pin: true,
            scrub: 1,
            start: "top 10%",
            end: () => "+=" + scrollWidth
        }
    });
}

// 3D Card Tilt Effect
const tiltElements = document.querySelectorAll('.3d-tilt');
tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = (y - centerY) / 8;  // Adjust tilt intensity
        const tiltY = (centerX - x) / 8;
        
        el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        el.style.transition = 'none';
        el.style.zIndex = '10';
        el.style.boxShadow = `0 15px 30px rgba(0, 240, 255, 0.1)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        el.style.transition = 'all 0.5s ease';
        el.style.zIndex = '1';
        el.style.boxShadow = 'none';
    });
});

// ===== Desktop UPI Payment Interceptor =====
const upiButtons = document.querySelectorAll('.upi-pay-btn');
upiButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Native hrefs work flawlessly on Mobile OS, but break on desktops. 
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            e.preventDefault(); // Stop desktop browser from trying to open unhandled upi://
            const plan = btn.getAttribute('data-plan');
            const amount = btn.getAttribute('data-amount');
            alert(`To purchase the ${plan} Plan for ₹${amount}:\nPlease open Google Pay, PhonePe, or Paytm on your phone and send the exact amount to UPI ID: 9553320142@paytm`);
        } else {
            // Give a fallback prompt on mobile ONLY IF the app fails to open the URI
            setTimeout(() => {
                const plan = btn.getAttribute('data-plan');
                const amount = btn.getAttribute('data-amount');
                alert(`If your UPI app didn't open automatically, please manually send ₹${amount} to 9553320142@paytm for the ${plan} Plan.`);
            }, 3000);
        }
    });
});
