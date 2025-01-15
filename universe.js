class StarField {
    constructor(scene) {
        this.scene = scene;
        this.stars = [];
        this.createMilkyWayStripe();
        this.createCircularStars();
    }

    createMilkyWayStripe() {
        // Create particles for the Milky Way stripe
        const stripeGeometry = new THREE.BufferGeometry();
        const stripeVertices = [];
        const stripeColors = [];
        
        // Create a tilted ring of particles
        for (let i = 0; i < 10000; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 200 + (Math.random() - 0.5) * 100;
            // Add some vertical spread
            const height = (Math.random() - 0.5) * 30;
            
            // Create an elliptical distribution
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle) * 0.5; // Compress Z to create oval shape
            const y = height;
            
            stripeVertices.push(x, y, z);
            
            // Random color (mostly white with occasional colors)
            const colorChance = Math.random();
            if (colorChance > 0.975) {
                // Blue-ish stars
                stripeColors.push(0.4, 0.4, 1);
            } else if (colorChance > 0.95) {
                // Red-ish stars
                stripeColors.push(1, 0.33, 0);
            } else {
                // White stars with slight variations
                const brightness = Math.random() * 0.2 + 0.8;
                stripeColors.push(brightness, brightness, brightness);
            }
        }

        stripeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stripeVertices, 3));
        stripeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(stripeColors, 3));

        const stripeMaterial = new THREE.PointsMaterial({
            size: 1+Math.random(),
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        this.milkyWay = new THREE.Points(stripeGeometry, stripeMaterial);
        this.milkyWay.rotation.x = Math.PI / 7; // Tilt the stripe
        this.scene.add(this.milkyWay);
    }

    createCircularStars() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];

        for (let i = 0; i < 3000; i++) {
            // Create stars in a spherical distribution
            const radius = Math.random() * 400 + 150;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1); // This creates uniform spherical distribution

            vertices.push(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );

            // Random color (mostly white with occasional colors)
            const colorChance = Math.random();
            if (colorChance > 0.85) {
                // Blue-ish stars
                colors.push(0.4, 0.4, 1);
            } else if (colorChance > 0.70) {
                // Red-ish stars
                colors.push(1, 0.33, 0);
            } else {
                // White stars with slight variations
                const brightness = Math.random() * 0.2 + 0.8;
                colors.push(brightness, brightness, brightness);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
    }

    animate() {
        // Subtle twinkling effect for stars
        const colors = this.stars.geometry.attributes.color.array;
        
        for (let i = 0; i < colors.length; i += 3) {
            const flicker = 0.95 + Math.random() * 0.1;
            colors[i] *= flicker;
            colors[i + 1] *= flicker;
            colors[i + 2] *= flicker;
        }
        this.stars.geometry.attributes.color.needsUpdate = true;

        // Very slow rotation of the Milky Way stripe
        this.milkyWay.rotation.y += 0.0001;
    }
}

class Planet {
    constructor(name, position, size, color) {
        this.geometry = new THREE.SphereGeometry(size, 64, 64);
        this.material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.2,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(...position);
        this.satellites = [];
        this.name = name;
        this.topicData = TOPICS[name];
        
        // Add topic text
        const sprite = this.createTopicLabel();
        this.mesh.add(sprite);

        this.completedLessons = this.loadCompletedLessons();
        console.log(this.completedLessons);
        this.isReadyForChallenge = this.checkChallengeReadiness();
        
        // Check if challenge is completed
        this.isChallengeCompleted = localStorage.getItem(`planet_${this.name}_complete`) === 'true';
        if (this.isChallengeCompleted) {
            this.addCompletionFlag();
        }
        
    }

    createTopicLabel() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;
        
        // Clear the canvas with a transparent background
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.font = '900 50px Orbitron';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        
        // Word wrap the title
        const words = this.topicData.title.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for(let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + " " + word).width;
            if(width < canvas.width - 40) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        
        // Draw each line
        const lineHeight = 60;
        const startY = (canvas.height - (lines.length * lineHeight)) / 2 + lineHeight;
        lines.forEach((line, index) => {
            context.fillText(line, canvas.width/2, startY + (index * lineHeight));
        });

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true 
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.y = 5;
        sprite.scale.set(8, 4, 1);
        return sprite;
    }

    loadCompletedLessons() {
        const stored = localStorage.getItem(`planet_${this.name}_lessons`);
        return stored ? new Set(JSON.parse(stored)) : new Set();
    }

    markLessonComplete(lessonIndex) {
        this.completedLessons.add(lessonIndex);
        localStorage.setItem(
            `planet_${this.name}_lessons`, 
            JSON.stringify([...this.completedLessons])
        );
        this.checkChallengeReadiness();
    }

    checkChallengeReadiness() {
        // Only ready for challenge when all lessons are completed
        this.isReadyForChallenge = this.completedLessons.size === 3;//satellites.length;
        return this.isReadyForChallenge;
    }

    addCompletionFlag() {
        // Create flag geometry
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const flagGeometry = new THREE.PlaneGeometry(1, 0.6);

        // Create materials
        const poleMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const flagMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffff00,
            side: THREE.DoubleSide,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });

        // Create meshes
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);

        // Position flag
        pole.position.set(0, 1.9, 0);
        flag.position.set(0, 2.5, 0.5);
        flag.rotation.y = Math.PI / 2;

        // Add to planet mesh
        this.mesh.add(pole);
        this.mesh.add(flag);

        // Store references
        this.flagPole = pole;
        this.flag = flag;
    }
}

class Satellite {
    constructor(planet, angle, distance, lessonIndex) {
        this.geometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.material = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            emissive: 0xcccccc,
            emissiveIntensity: 0.2,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.planet = planet;
        this.angle = angle;
        this.distance = distance;
        this.lessonIndex = lessonIndex;
        this.lessonText = planet.topicData.lessons[lessonIndex];
        
        // Add lesson text
        const sprite = this.createLessonLabel();
        this.mesh.add(sprite);
        this.updatePosition();
    }

    createLessonLabel() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        // Clear the canvas with a transparent background
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'Bold 24px Orbitron';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        
        // Word wrap the lesson text
        const words = this.lessonText.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for(let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + " " + word).width;
            if(width < canvas.width - 20) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        
        // Draw each line
        const lineHeight = 30;
        const startY = (canvas.height - (lines.length * lineHeight)) / 2 + lineHeight;
        lines.forEach((line, index) => {
            context.fillText(line, canvas.width/2, startY + (index * lineHeight));
        });

        const texture = new THREE.CanvasTexture(canvas);
        texture.premultiplyAlpha = true;  // Add this line
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });

        const sprite = new THREE.Sprite(material);
        sprite.position.y = 1;
        sprite.scale.set(4, 2, 1);
        return sprite;
    }

    updatePosition() {
        this.mesh.position.x = this.planet.mesh.position.x + Math.cos(this.angle) * this.distance;
        this.mesh.position.z = this.planet.mesh.position.z + Math.sin(this.angle) * this.distance;
        this.mesh.position.y = this.planet.mesh.position.y;
    }
}

class Universe {
    constructor() {
        this.setupAudio();
        this.showLoadingScreen(() => {           
            this.showGameIntro(() => {
                

                // Create a curved path for camera
                this.initializeScene();
                // Start with camera at a dramatic angle
                this.camera.position.set(-100, 150, -200);
                this.camera.lookAt(0, 0, 0);
                this.performOpeningSequence(() => {
                    this.animate();
                });
            });
        });
    }

    initializeScene() {
        this.scene = new THREE.Scene();
        
        // Replace existing camera setup with configurable FOV and better clipping planes
        const aspectRatio = window.innerWidth / window.innerHeight;
        const fov = 60; // Reduced from 75 for less distortion
        const near = 1; // Increased from 0.1 for better depth perception
        const far = 1000;
        
        // Option 1: Perspective Camera (default, good for 3D scenes)
        this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
        
        

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('universeCanvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.createBackgroundGradient();
        this.starField = new StarField(this.scene);
        this.setupLights();
        this.createCentralStar();
        this.createPlanets();
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.focusedPlanet = null;
        this.isTransitioning = false;
    }

    performOpeningSequence(callback) {
        // Create a curved path for the camera
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(400, 150, 40), // Starting position
            new THREE.Vector3(300, 100, 30),
            new THREE.Vector3(200, 60, 20),
            new THREE.Vector3(100, 30, 10),
            new THREE.Vector3(20, 10, 20)  // Final position
        ]);

        let progress = 0;
        const duration = 5; // seconds
        const startTime = performance.now();

        const animateCamera = () => {
            const now = performance.now();
            progress = (now - startTime) / (duration * 1000);

            if (progress < 1) {
                // Get position along curve
                const point = curve.getPoint(progress);
                this.camera.position.copy(point);
                
                // Smoothly look at center
                this.camera.lookAt(0, 0, 0);
                
                // Render frame
                this.renderer.render(this.scene, this.camera);
                
                requestAnimationFrame(animateCamera);
            } else {
                // Ensure final position is exact
                this.camera.position.set(20, 10, 20);
                this.camera.lookAt(0, 0, 0);
                
                // Setup remaining UI and start regular animation
                this.setupStatusPanel();
                this.addEventListeners();
                callback();
            }
        };

        animateCamera();
    }

    createBackgroundGradient() {
        const vertexShader = `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform vec3 topColor;
            uniform vec3 middleColor;
            uniform vec3 bottomColor;
            varying vec3 vWorldPosition;
            void main() {
                float y = normalize(vWorldPosition).y;
                vec3 color;
                if (y > 0.0) {
                    color = mix(middleColor, topColor, y);
                } else {
                    color = mix(middleColor, bottomColor, -y);
                }
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        const uniforms = {
            topColor: { value: new THREE.Color(0x0B0B3B) },    // Dark blue
            middleColor: { value: new THREE.Color(0x3B0B6E) }, // Deep purple
            bottomColor: { value: new THREE.Color(0x000000) }  // Black
        };

        const skyGeo = new THREE.SphereGeometry(400, 32, 32);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(sky);
    }

    setupAudio() {
        this.bgm = new Audio('main theme.mp3');
        this.bgm.loop = true;
        this.bgm.volume = 0.25;
    }

    playBgm(){
        this.bgm.currentTime = 0;
        this.bgm.play();
    }

    showLoadingScreen(callback) {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <h1>ALGEBRAIC ODYSSEY</h1>
                <div class="loading-progress">
                    <div class="progress-bar"></div>
                </div>
                <div class="loading-text">Initializing Quantum Systems...</div>
                <button class="start-game" style="display: none;">Enter the Universe</button>
            </div>
        `;

        document.body.appendChild(loadingScreen);

        // Loading messages
        const loadingMessages = [
            "Calibrating quantum drive...",
            "Initializing navigation systems...",
            "Loading star charts...",
            "Stabilizing wormhole passages...",
            "Systems ready."
        ];

        const progressBar = loadingScreen.querySelector('.progress-bar');
        const loadingText = loadingScreen.querySelector('.loading-text');
        const startButton = loadingScreen.querySelector('.start-game');

        let messageIndex = 0;
        const updateLoadingText = () => {
            if (messageIndex < loadingMessages.length) {
                loadingText.textContent = loadingMessages[messageIndex];
                messageIndex++;
                const progress = (messageIndex / loadingMessages.length) * 100;
                progressBar.style.width = `${progress}%`;
                
                if (messageIndex === loadingMessages.length) {
                    setTimeout(() => {
                        startButton.style.display = 'inline-block';
                        setTimeout(() => startButton.classList.add('visible'), 100);
                    }, 500);
                } else {
                    setTimeout(updateLoadingText, 900);
                }
            }
        };

        // Start loading sequence
        setTimeout(updateLoadingText, 500);

        // Add click handler to start button
        startButton.addEventListener('click', () => {
            loadingScreen.style.transition = 'opacity 1s';
            loadingScreen.style.opacity = '0';
            this.bgm.play();
            setTimeout(() => {
                loadingScreen.remove();
                callback();
            }, 1000);
        });
    }

    showGameIntro(callback) {
        const intro = document.createElement('div');
        intro.className = 'game-intro';
        intro.innerHTML = `
            <div class="intro-content">
                <h1>ALGEBRAIC ODYSSEY</h1>
                <div class="story-sequence">
                    <div class="story-panel active">
                        <h2>THE YEAR 2157</h2>
                        <p>Humanity faces its greatest challenge yet. The Earth's computational core, responsible for maintaining global systems, has been compromised by an unknown quantum anomaly.</p>
                    </div>
                    <div class="story-panel">
                        <h2>THE CRISIS</h2>
                        <p>The anomaly has fragmented crucial algebraic knowledge across four distant planets in our solar system. Without this knowledge, Earth's systems will fail within days.</p>
                    </div>
                    <div class="story-panel">
                        <h2>YOUR MISSION</h2>
                        <p>As Earth's last hope, you must pilot an advanced spacecraft through the Algebraic Universe. Visit each planet, recover the lost knowledge, and save humanity.</p>
                    </div>
                    <div class="story-panel">
                        <h2>THE PLANETS</h2>
                        <ul>
                            <li>🌍 Coordinates Prime - Master of Position</li>
                            <li>🌎 Linear Vista - Guardian of Lines</li>
                            <li>🌏 System Nexus - Keeper of Equations</li>
                            <li>🌏 Inequality Domain - Balance of Numbers</li>
                        </ul>
                    </div>
                    <div class="story-panel">
                        <h2>WARNING</h2>
                        <p>Each planet's knowledge is protected by quantum challenges. You'll need to solve mathematical puzzles while navigating through space hazards.</p>
                        <p>The fate of humanity rests in your calculations.</p>
                    </div>
                </div>
                <div class="intro-controls">
                    <button class="nav-btn prev-btn" disabled>◄ Previous</button>
                    <button class="nav-btn next-btn">Next ►</button>
                </div>
                <button class="start-odyssey hidden">BEGIN ODYSSEY</button>
            </div>
        `;

    
        document.body.appendChild(intro);

        // Story navigation logic
        let currentPanel = 0;
        const panels = intro.querySelectorAll('.story-panel');
        const prevBtn = intro.querySelector('.prev-btn');
        const nextBtn = intro.querySelector('.next-btn');
        const startBtn = intro.querySelector('.start-odyssey');

        // Hide all text content initially
        panels.forEach(panel => {
            const textElements = panel.querySelectorAll('p, li');
            textElements.forEach(element => {
                element.style.visibility = 'hidden';
                // Store original text and clear content
                element.dataset.originalText = element.textContent;
                element.textContent = '';
            });
        });

        const updatePanels = () => {
            panels.forEach((panel, index) => {
                panel.classList.toggle('active', index === currentPanel);
            });
            prevBtn.disabled = currentPanel === 0;
            nextBtn.textContent = currentPanel === panels.length - 1 ? 'Start Journey' : 'Next ►';
        };

        const typeWriter = (element, text, callback) => {
            element.style.visibility = 'visible';
            element.textContent = '';
            let i = 0;
            const speed = 30;

            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else if (callback) {
                    callback();
                }
            }
            type();
        };

        // Modify panel navigation to include typewriter effect
        const switchPanel = (newPanel) => {
            const currentPanelElement = panels[currentPanel];
            const nextPanelElement = panels[newPanel];
            currentPanelElement.classList.remove('active');
            nextPanelElement.classList.add('active');
            
            // Get all text elements in the new panel
            const textElements = nextPanelElement.querySelectorAll('p, li');
            let elementIndex = 0;

            const typeNextElement = () => {
                if (elementIndex < textElements.length) {
                    const element = textElements[elementIndex];
                    const originalText = element.dataset.originalText;
                    typeWriter(element, originalText, () => {
                        elementIndex++;
                        typeNextElement();
                    });
                }
            };

            // Reset visibility of all elements in the panel
            textElements.forEach(element => {
                element.style.visibility = 'hidden';
                element.textContent = '';
            });

            typeNextElement();
            currentPanel = newPanel;
            updatePanels();
        };

        // Modify navigation button handlers
        prevBtn.addEventListener('click', () => {
            if (currentPanel > 0) {
                switchPanel(currentPanel - 1);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPanel < panels.length - 1) {
                switchPanel(currentPanel + 1);
            } else {
                intro.remove();
                callback();
            }
        });

        // Start with first panel
        switchPanel(0);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);

        const centerLight = new THREE.PointLight(0xffffcc, 1, 100);
        centerLight.position.set(0, 0, 0);
        this.scene.add(centerLight);

        const hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        this.scene.add( hemiLight );
    }

    createCentralStar() {
        // Create star core
        const starGeometry = new THREE.SphereGeometry(4, 64, 64);
        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0xffff00) },
                color2: { value: new THREE.Color(0xff8800) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                
                void main() {
                    float noise = sin(vUv.x * 20.0 + time) * sin(vUv.y * 20.0 + time) * 0.5 + 0.5;
                    vec3 color = mix(color1, color2, noise);
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });

        this.centralStar = new THREE.Mesh(starGeometry, starMaterial);
        
        // Add corona effect
        const coronaGeometry = new THREE.SphereGeometry(5, 32, 32);
        const coronaMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.5);
                    gl_FragColor = vec4(1.0, 0.85, 0.3, intensity * 0.4);
                }
            `,
            transparent: true,
            side: THREE.BackSide
        });
        const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
        this.centralStar.add(corona);
        this.scene.add(this.centralStar);
    }

    createPlanets() {
        const orbitRadius = 16;
        const angles = [0, Math.PI/2, Math.PI, -Math.PI/2];
        
        const planetConfigs = [
            {
                name: "Coordinates",
                color1: new THREE.Color(0x4287f5),
                color2: new THREE.Color(0x1a4b8f),
                ringColor: 0x84b7ff
            },
            {
                name: "Lines",
                color1: new THREE.Color(0x42f54b),
                color2: new THREE.Color(0x1f8f24),
                ringColor: 0x84ffaa
            },
            {
                name: "Systems",
                color1: new THREE.Color(0xf54242),
                color2: new THREE.Color(0x8f1f1f),
                ringColor: 0xff8484
            },
            {
                name: "Inequalities",
                color1: new THREE.Color(0xf5d442),
                color2: new THREE.Color(0x8f7b1f),
                ringColor: 0xffe484
            }
        ];

        this.planets = planetConfigs.map((config, index) => {
            const position = [
                orbitRadius * Math.cos(angles[index]),
                0,
                orbitRadius * Math.sin(angles[index])
            ];

            const planet = new Planet(config.name, position, 1.5, config.color1);
            
            // Simplified planet shader without stripes
            planet.mesh.material = new THREE.ShaderMaterial({
                uniforms: {
                    color1: { value: config.color1 },
                    color2: { value: config.color2 }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vViewPosition;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        vViewPosition = -mvPosition.xyz;
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    uniform vec3 color1;
                    uniform vec3 color2;
                    varying vec3 vNormal;
                    varying vec3 vViewPosition;
                    
                    void main() {
                        vec3 color = mix(color1, color2, 0.5);
                        
                        // Brighter ambient lighting
                        float ambient = 0.6;
                        
                        // Enhanced diffuse lighting
                        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                        float diff = max(dot(vNormal, lightDir), 0.0) * 0.8;
                        
                        // Subtle rim lighting
                        vec3 viewDir = normalize(vViewPosition);
                        float rimPower = 2.0;
                        float rim = pow(1.0 - max(dot(viewDir, vNormal), 0.0), rimPower) * 0.3;
                        
                        // Combine lighting with increased intensity
                        float finalLight = ambient + diff + rim;
                        
                        gl_FragColor = vec4(color * finalLight, 1.0);
                    }
                `
            });

            function addRing(ir,or,color){
                // Simple ring without stripes
                const ringGeometry = new THREE.RingGeometry(ir, or, 64);
                const ringMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        baseColor: { value: new THREE.Color(color) },
                        time: { value: 0 }
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform vec3 baseColor;
                        uniform float time;
                        varying vec2 vUv;
                        
                        void main() {
                            // Just use base color with subtle glow
                            vec3 finalColor = baseColor;
                            float glow = 0.2;
                            finalColor += baseColor * glow;
                            
                            gl_FragColor = vec4(finalColor, 0.6);
                        }
                    `,
                    transparent: true,
                    side: THREE.DoubleSide
                });
                
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2;
                return ring;
            }
            const mainRing=addRing(1.75,3,config.ringColor);
            planet.mesh.add(mainRing);
            for(let i=0;i<6;i++){
                const stripe=addRing(0.2*i+1.8,0.2*i+1.87,0xffffff);
                stripe.position.y = 0.01;
                planet.mesh.add(stripe);
            }         
            
            return planet;
        });

        this.planets.forEach((planet, index) => {
            planet.orbitRadius = orbitRadius;
            planet.orbitAngle = angles[index];
            this.scene.add(planet.mesh);
            this.createSatellites(planet);
        });
    }

    createSatellites(planet) {
        const lessons = planet.topicData.lessons;
        const lessonCount = Math.min(lessons.length, 3); // Maximum of 3 satellites
        
        for (let i = 0; i < lessonCount; i++) {
            const angle = (Math.PI * 2 / lessonCount) * i;
            const satellite = new Satellite(planet, angle, 5, i);
            planet.satellites.push(satellite);
            this.scene.add(satellite.mesh);
        }
    }

    setupCamera() {
        // Position camera from the side
        this.camera.position.set(20, 10, 20);
        this.camera.lookAt(0, 0, 0);
    }

    setupStatusPanel() {
        this.statusPanel = document.createElement('div');
        this.statusPanel.className = 'status-panel-planet';
        //this.statusPanel.style.display = 'none'; // Hide initially
        this.statusPanel.innerHTML = `
            <h2>Planet Status</h2>
            <div class="planet-info">
                <p>Select a planet to view status</p>
            </div>
        `;
        document.body.appendChild(this.statusPanel);
    }

    updateStatusPanel(planet) {
        if (!planet) {
            //this.statusPanel.style.display = 'none';
            this.statusPanel.innerHTML = `
            <h2>Planet Status</h2>
            <div class="planet-info">
                <p>Select a planet to view status</p>
            </div>
        `;
            return;
        }

        const completedLessons = planet.completedLessons.size;
        const totalLessons = planet.satellites.length;
        const progress = (completedLessons / totalLessons) * 100;
        
        this.statusPanel.style.display = 'block';
        this.statusPanel.querySelector('.planet-info').innerHTML = `
            <h3>${planet.topicData.title}</h3>
            <div class="progress-container">
            <div class="progress-bar-planet" style="width: ${progress}%"></div>
            </div>
            <p>Lessons completed: ${completedLessons}/${totalLessons}</p>
            ${planet.isChallengeCompleted ? '<p class="completed">✓ Challenge Completed</p>' : 
              planet.isReadyForChallenge ? '<p class="ready">Ready for Challenge!</p>' : 
              '<p class="pending">Complete all lessons to unlock challenge</p>'}
            <p>Click on a satellite to start a lesson</p>
            <p>Click on the planet to return to orbit</p>
        `;
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            const aspectRatio = window.innerWidth / window.innerHeight;
            
            if (this.camera instanceof THREE.PerspectiveCamera) {
                this.camera.aspect = aspectRatio;
            } else if (this.camera instanceof THREE.OrthographicCamera) {
                const frustumSize = 100;
                this.camera.left = frustumSize * aspectRatio / -2;
                this.camera.right = frustumSize * aspectRatio / 2;
                this.camera.top = frustumSize / 2;
                this.camera.bottom = frustumSize / -2;
            }
            
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('click', (event) => {
            if (this.isTransitioning) return;

            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            
            // Check planet intersections
            const planetIntersects = this.raycaster.intersectObjects(
                this.planets.map(planet => planet.mesh)
            );

            // Check satellite intersections
            const satelliteIntersects = this.raycaster.intersectObjects(
                this.planets.flatMap(planet => 
                    planet.satellites.map(satellite => satellite.mesh)
                )
            );

            if (planetIntersects.length > 0) {
                const clickedPlanet = this.planets.find(
                    planet => planet.mesh === planetIntersects[0].object
                );
                
                if (this.focusedPlanet === clickedPlanet) {
                    this.returnToOrbit(clickedPlanet);
                } else {
                    this.focusOnPlanet(clickedPlanet);
                }
            } else if (satelliteIntersects.length > 0 && this.focusedPlanet) {
                const clickedSatellite = this.focusedPlanet.satellites.find(
                    satellite => satellite.mesh === satelliteIntersects[0].object
                );
                if (clickedSatellite) {
                    this.bgm.pause();
                    this.statusPanel.style.display = 'none';
                    window.spaceshipInterface.show(clickedSatellite.lessonText);
                }
            }
        });
    }

    focusOnPlanet(planet) {
        this.isTransitioning = true;
        this.focusedPlanet = planet;

        // Get planet position vector
        const planetPos = new THREE.Vector3(
            planet.mesh.position.x,
            20,
            planet.mesh.position.z
        );

        // Calculate direction vector from planet to original camera position
        
        const direction = new THREE.Vector3(20, 20, 20).sub(planetPos).normalize();
        
        // Calculate target position 15 units away from planet
        const targetPosition = planetPos.clone().add(direction.multiplyScalar(12));

        // Animate camera movement
        gsap.to(this.camera.position, {
            x: targetPosition.x,
            y: 6,
            z: targetPosition.z,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
                this.isTransitioning = false;
            }
        });

        this.updateStatusPanel(planet);
        
        if (planet.isReadyForChallenge) {            
            let challengeBtn = document.querySelector('.challenge-btn');
            if (!challengeBtn) {
            challengeBtn = document.createElement('button');
            challengeBtn.classList.add('challenge-btn');
            document.getElementById('topic-info').appendChild(challengeBtn);
            }
            challengeBtn.textContent = 'Start Planet Challenge';
            challengeBtn.onclick = () => this.startPlanetChallenge(planet);
        }
        
        
    }

    returnToOrbit(planet) {
        this.isTransitioning = true;

        // Return camera to original position
        gsap.to(this.camera.position, {
            x: 20,
            y: 10,
            z: 20,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
                this.focusedPlanet = null;
                this.isTransitioning = false;
            }
        });

        // Return camera look at to center

        const topicInfo = document.getElementById('topic-info');
        topicInfo.textContent = '';
        this.updateStatusPanel(null);
    }

    startPlanetChallenge(planet) {
        if (!window.planetChallenge) {
            console.error('Planet Challenge not initialized');
            return;
        }
        // Hide universe UI
        document.getElementById('ui-overlay').style.display = 'none';
        this.statusPanel.style.display = 'none';
        this.bgm.pause();
        window.planetChallenge.startChallenge(planet);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = performance.now() * 0.001;
        
        // Update star shader
        if (this.centralStar.material.uniforms) {
            this.centralStar.material.uniforms.time.value = time;
            this.centralStar.children[0].material.uniforms.time.value = time;
        }
        
        this.starField.animate(); 


        // Only orbit planets if none is focused
        if (!this.focusedPlanet) {
            const orbitSpeed = 0.005;
            this.planets.forEach(planet => {
                planet.orbitAngle += orbitSpeed;
                planet.mesh.position.x = Math.cos(planet.orbitAngle) * planet.orbitRadius;
                planet.mesh.position.z = Math.sin(planet.orbitAngle) * planet.orbitRadius;
                planet.mesh.rotation.y += 0.01;

                planet.satellites.forEach(satellite => {
                    satellite.angle += 0.02;
                    satellite.updatePosition();
                });
            });
        } else {
            // Rotate only the focused planet
            this.focusedPlanet.mesh.rotation.y += 0.01;
            
            // Update its satellites
            this.focusedPlanet.satellites.forEach(satellite => {
                satellite.angle += 0.01;
                satellite.updatePosition();
            });
        }

        // Update ring shaders
        this.planets.forEach(planet => {
            const ring = planet.mesh.children.find(child => 
                child instanceof THREE.Mesh && 
                child.geometry instanceof THREE.RingGeometry
            );
            if (ring && ring.material.uniforms) {
                ring.material.uniforms.time.value = time;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Wait for planetChallenge to be ready
window.addEventListener('load', () => {
    if (window.planetChallenge) {
        window.universe=new Universe();
    } else {
        console.error('Planet Challenge must be initialized before Universe');
    }
});

