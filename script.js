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

// Add a featured premium "TW" logo model to the hero scene
(function() {
    var heroLogo = new THREE.Group();
    
    // Build T for the hero background
    var tSolidH = new THREE.MeshStandardMaterial({ color: 0xb06cf7, metalness: 0.85, roughness: 0.12, emissive: 0x7c3aed, emissiveIntensity: 0.3, transparent: true, opacity: 0.85 });
    var tEdgeH = new THREE.LineBasicMaterial({ color: 0xd8b4fe });
    
    var crossGH = new THREE.BoxGeometry(1.6, 0.35, 0.45);
    var crossH = new THREE.Mesh(crossGH, tSolidH);
    crossH.position.y = 0.75;
    heroLogo.add(crossH);
    heroLogo.add(new THREE.LineSegments(new THREE.EdgesGeometry(crossGH), tEdgeH).translateY(0.75));
    
    var stemGH = new THREE.BoxGeometry(0.4, 1.5, 0.45);
    var stemH = new THREE.Mesh(stemGH, tSolidH);
    stemH.position.y = -0.1;
    heroLogo.add(stemH);
    heroLogo.add(new THREE.LineSegments(new THREE.EdgesGeometry(stemGH), tEdgeH).translateY(-0.1));
    
    // Build W web for the hero background
    var wWireH = new THREE.LineBasicMaterial({ color: 0xddff33 });
    var icoH = new THREE.IcosahedronGeometry(0.9, 1);
    var icoLinesH = new THREE.LineSegments(new THREE.WireframeGeometry(icoH), wWireH);
    icoLinesH.position.set(0.8, -0.1, 0);
    icoLinesH.scale.set(1.1, 1.3, 0.8);
    heroLogo.add(icoLinesH);
    
    var dodH = new THREE.DodecahedronGeometry(0.75, 0);
    var dodLinesH = new THREE.LineSegments(new THREE.WireframeGeometry(dodH), new THREE.LineBasicMaterial({ color: 0xaadd00, transparent: true, opacity: 0.5 }));
    dodLinesH.position.set(0.9, 0.05, 0);
    dodLinesH.scale.set(1.3, 1.1, 0.7);
    dodLinesH.rotation.z = 0.3;
    heroLogo.add(dodLinesH);
    
    heroLogo.position.set(5, 2, -2);
    heroLogo.scale.set(1.5, 1.5, 1.5);
    heroLogo.userData = {
        originalY: 2,
        rotationSpeedX: 0.005,
        rotationSpeedY: 0.012,
        floatSpeed: 0.6,
        floatOffset: Math.random() * Math.PI
    };
    scene.add(heroLogo);
    shapes.push(heroLogo);
})();

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

// UPI Payment Handler has been moved to index.html as a standalone inline script
// so it works independently of script.js (crash-proof).


// ===== Premium 3D TW Logo — Hollow Extruded T + Wireframe Web W =====
(function() {
    'use strict';

    // Helper: create a hollow "tube frame" letter T from box edges
    function buildLetterT(scale) {
        var tGroup = new THREE.Group();
        
        // Material for the solid purple T body
        var tSolid = new THREE.MeshStandardMaterial({
            color: 0xb06cf7,
            metalness: 0.85,
            roughness: 0.12,
            emissive: 0x7c3aed,
            emissiveIntensity: 0.35,
            transparent: true,
            opacity: 0.88
        });
        
        // Edge material — brighter purple for the wireframe edges
        var tEdge = new THREE.LineBasicMaterial({ color: 0xd8b4fe });
        
        // Cross-bar of the T (horizontal)
        var crossGeo = new THREE.BoxGeometry(1.6 * scale, 0.35 * scale, 0.45 * scale);
        var crossMesh = new THREE.Mesh(crossGeo, tSolid);
        crossMesh.position.y = 0.75 * scale;
        tGroup.add(crossMesh);
        
        // Edges on the crossbar
        var crossEdges = new THREE.LineSegments(new THREE.EdgesGeometry(crossGeo), tEdge);
        crossEdges.position.copy(crossMesh.position);
        tGroup.add(crossEdges);
        
        // Vertical stem of the T
        var stemGeo = new THREE.BoxGeometry(0.4 * scale, 1.5 * scale, 0.45 * scale);
        var stemMesh = new THREE.Mesh(stemGeo, tSolid);
        stemMesh.position.y = -0.1 * scale;
        tGroup.add(stemMesh);
        
        var stemEdges = new THREE.LineSegments(new THREE.EdgesGeometry(stemGeo), tEdge);
        stemEdges.position.copy(stemMesh.position);
        tGroup.add(stemEdges);
        
        // Inner cutout blocks to create the "hollow frame" look (top-left and top-right)
        var cutMat = new THREE.MeshStandardMaterial({
            color: 0x9333ea,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x581c87,
            emissiveIntensity: 0.5
        });
        
        var innerGeoL = new THREE.BoxGeometry(0.45 * scale, 0.15 * scale, 0.25 * scale);
        var innerL = new THREE.Mesh(innerGeoL, cutMat);
        innerL.position.set(-0.48 * scale, 0.75 * scale, 0);
        tGroup.add(innerL);
        var innerEdgesL = new THREE.LineSegments(new THREE.EdgesGeometry(innerGeoL), tEdge);
        innerEdgesL.position.copy(innerL.position);
        tGroup.add(innerEdgesL);
        
        var innerR = new THREE.Mesh(innerGeoL, cutMat);
        innerR.position.set(0.48 * scale, 0.75 * scale, 0);
        tGroup.add(innerR);
        var innerEdgesR = new THREE.LineSegments(new THREE.EdgesGeometry(innerGeoL), tEdge);
        innerEdgesR.position.copy(innerR.position);
        tGroup.add(innerEdgesR);
        
        // Serifs / connecting brackets
        var bracketGeo = new THREE.BoxGeometry(0.12 * scale, 0.35 * scale, 0.35 * scale);
        var bracketL = new THREE.Mesh(bracketGeo, tSolid);
        bracketL.position.set(-0.2 * scale, 0.42 * scale, 0);
        tGroup.add(bracketL);
        var bracketEdgesL = new THREE.LineSegments(new THREE.EdgesGeometry(bracketGeo), tEdge);
        bracketEdgesL.position.copy(bracketL.position);
        tGroup.add(bracketEdgesL);
        
        var bracketR = new THREE.Mesh(bracketGeo, tSolid);
        bracketR.position.set(0.2 * scale, 0.42 * scale, 0);
        tGroup.add(bracketR);
        var bracketEdgesR = new THREE.LineSegments(new THREE.EdgesGeometry(bracketGeo), tEdge);
        bracketEdgesR.position.copy(bracketR.position);
        tGroup.add(bracketEdgesR);
        
        return tGroup;
    }
    
    // Helper: create a "W" as a complex wireframe web structure
    function buildLetterW(scale) {
        var wGroup = new THREE.Group();
        
        // Material for thin solid struts
        var wSolid = new THREE.MeshStandardMaterial({
            color: 0xccff00,
            metalness: 0.6,
            roughness: 0.25,
            emissive: 0x88aa00,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.85
        });
        
        var wWireMat = new THREE.LineBasicMaterial({ color: 0xddff33 });
        
        // Build the W from 4 angled struts (V shapes)
        function createStrut(x, angle, height) {
            var strutGeo = new THREE.BoxGeometry(0.08 * scale, height * scale, 0.12 * scale);
            var strut = new THREE.Mesh(strutGeo, wSolid);
            strut.position.x = x * scale;
            strut.rotation.z = angle;
            
            var strutEdge = new THREE.LineSegments(new THREE.EdgesGeometry(strutGeo), wWireMat);
            strutEdge.position.copy(strut.position);
            strutEdge.rotation.copy(strut.rotation);
            
            var g = new THREE.Group();
            g.add(strut, strutEdge);
            return g;
        }
        
        // Left V
        wGroup.add(createStrut(-0.5, 0.28, 1.4));
        wGroup.add(createStrut(-0.15, -0.28, 1.4));
        // Right V
        wGroup.add(createStrut(0.2, 0.28, 1.4));
        wGroup.add(createStrut(0.55, -0.28, 1.4));
        
        // Create the web mesh overlay — an icosahedron wireframe
        var icoGeo = new THREE.IcosahedronGeometry(0.9 * scale, 1);
        var icoWire = new THREE.WireframeGeometry(icoGeo);
        var icoLines = new THREE.LineSegments(icoWire, wWireMat);
        icoLines.position.x = 0.05 * scale;
        icoLines.position.y = -0.1 * scale;
        icoLines.scale.set(1.1, 1.3, 0.8);
        wGroup.add(icoLines);
        
        // Add a second, larger dodecahedron web layer for complexity
        var dodGeo = new THREE.DodecahedronGeometry(0.75 * scale, 0);
        var dodWire = new THREE.WireframeGeometry(dodGeo);
        var dodLines = new THREE.LineSegments(dodWire, new THREE.LineBasicMaterial({ color: 0xaadd00, transparent: true, opacity: 0.5 }));
        dodLines.position.x = 0.1 * scale;
        dodLines.position.y = 0.05 * scale;
        dodLines.scale.set(1.3, 1.1, 0.7);
        dodLines.rotation.z = 0.3;
        wGroup.add(dodLines);
        
        // Add small connector nodes at intersections
        var nodeMat = new THREE.MeshStandardMaterial({ color: 0xeeff66, metalness: 0.9, roughness: 0.1, emissive: 0xccff00, emissiveIntensity: 0.6 });
        var nodeGeo = new THREE.SphereGeometry(0.04 * scale, 6, 6);
        var nodePositions = [
            [-0.5, 0.5], [-0.15, -0.5], [-0.33, 0], 
            [0.2, 0.5], [0.55, -0.5], [0.03, 0],
            [0.38, 0], [-0.5, -0.5], [0.55, 0.5]
        ];
        nodePositions.forEach(function(pos) {
            var node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.set(pos[0] * scale, pos[1] * scale, 0.15 * scale);
            wGroup.add(node);
        });
        
        return wGroup;
    }

    function init3DLogo(containerId) {
        var container = document.getElementById(containerId);
        if (!container) {
            console.warn('[TechWebs] 3D Logo Container #' + containerId + ' not found.');
            return;
        }

        var testCanvas = document.createElement('canvas');
        var gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
        if (!gl) {
            console.warn('[TechWebs] WebGL not supported, using fallback logo for #' + containerId);
            addFallbackLogo(container);
            return;
        }

        try {
            console.log('[TechWebs] Initializing Premium 3D Logo for #' + containerId + '...');

            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
            camera.position.z = 4.5;

            var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            var width = container.clientWidth || 60;
            var height = container.clientHeight || 60;
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0);
            container.innerHTML = '';
            container.appendChild(renderer.domElement);

            var logoGroup = new THREE.Group();
            scene.add(logoGroup);

            // Build the T
            var letterT = buildLetterT(1.0);
            letterT.position.x = -0.7;
            letterT.position.y = -0.1;
            logoGroup.add(letterT);

            // Build the W (web structure)
            var letterW = buildLetterW(1.0);
            letterW.position.x = 0.55;
            letterW.position.y = -0.15;
            logoGroup.add(letterW);
            
            // Center the combined logo
            logoGroup.position.x = -0.05;
            logoGroup.scale.set(1.15, 1.15, 1.15);

            // Premium lighting setup
            scene.add(new THREE.AmbientLight(0xffffff, 0.9));
            
            var keyLight = new THREE.PointLight(0xd8b4fe, 3.5, 25);
            keyLight.position.set(4, 4, 6);
            scene.add(keyLight);
            
            var fillLight = new THREE.PointLight(0xccff00, 2.5, 25);
            fillLight.position.set(-4, -2, 5);
            scene.add(fillLight);

            var rimLight = new THREE.PointLight(0x00d2ff, 1.5, 20);
            rimLight.position.set(0, -3, -3);
            scene.add(rimLight);
            
            var topLight = new THREE.PointLight(0xffffff, 2.0, 15);
            topLight.position.set(0, 5, 4);
            scene.add(topLight);

            // Mouse interaction
            var targetRotX = 0, targetRotY = 0;
            document.addEventListener('mousemove', function(e) {
                targetRotY = (e.clientX / window.innerWidth - 0.5) * 1.8;
                targetRotX = (e.clientY / window.innerHeight - 0.5) * 1.2;
            });

            // Animation with floating + scroll reaction
            var lastScrollY = window.scrollY;
            var time = 0;
            function animate() {
                requestAnimationFrame(animate);
                time += 0.016;
                
                // Mouse follow
                logoGroup.rotation.y += (targetRotY - logoGroup.rotation.y) * 0.04;
                logoGroup.rotation.x += (targetRotX - logoGroup.rotation.x) * 0.04;
                
                // Idle spin + scroll
                var currentScroll = window.scrollY;
                var scrollDelta = currentScroll - lastScrollY;
                logoGroup.rotation.y += 0.008 + (scrollDelta * 0.006);
                lastScrollY = currentScroll;
                
                // Gentle floating bob
                logoGroup.position.y = Math.sin(time * 1.5) * 0.05;
                
                renderer.render(scene, camera);
            }
            animate();

            // Resize
            window.addEventListener('resize', function() {
                var w = container.clientWidth || 60;
                var h = container.clientHeight || 60;
                renderer.setSize(w, h);
            });

            console.log('[TechWebs] Premium 3D Logo rendered for #' + containerId);

        } catch(err) {
            console.error('[TechWebs] 3D Logo failed for #' + containerId + ':', err);
            addFallbackLogo(container);
        }
    }

    function addFallbackLogo(container) {
        container.innerHTML = '<svg viewBox="0 0 45 45" width="45" height="45"><text x="5" y="32" font-family="Syne, sans-serif" font-weight="800" font-size="20" fill="url(#twGrad)">TW</text><defs><linearGradient id="twGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#ccff00"/></linearGradient></defs></svg>';
    }

    window.init3DLogo = init3DLogo;

    function startLogos() {
        try {
            init3DLogo('logo-header');
            init3DLogo('logo-footer');
        } catch(err) {
            console.error('[TechWebs] Logo bootstrap failed:', err);
        }
    }

    if (document.readyState === 'complete') {
        startLogos();
    } else {
        window.addEventListener('load', startLogos);
    }
})();
