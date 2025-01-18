class WormholeEffect {
    constructor(options = {}) {
        this.options = {
            radius: options.radius || 10,
            depth: options.depth || 60,
            segments: options.segments || 100,
            rings: options.rings || 50,
            // Updated colors for space-like appearance
            baseColor: options.baseColor || 0x1a0033,    // Deep purple
            dustColor: options.dustColor || 0x6600cc,    // Bright purple
            glowColor: options.glowColor || 0x9933ff,    // Light purple
            singularityColor: options.singularityColor || 0xffffff, // Bright white
            timeScale: options.timeScale || 1
        };
        this.group = new THREE.Group();
        this.time = 0;
        this.initialize();
    }

    initialize() {
        this.createTunnel();
        this.createParticleSystem();
        this.createOuterGlow();
        this.createSingularPoint();
        this.createEntranceDistortion();
    }

    createTunnel() {
        // Modified tunnel geometry to narrow towards singular point
        const points = [];
        for (let i = 0; i < this.options.depth; i++) {
            const t = i / this.options.depth;
            // Exponential narrowing towards the end
            const radius = this.options.radius * Math.pow(1 - t, 0.8);
            points.push(new THREE.Vector3(0, 0, -i));
        }

        const tunnelGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),
            this.options.segments,
            this.options.radius,
            this.options.rings,
            false
        );

        const tunnelMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                baseColor: { value: new THREE.Color(this.options.baseColor) },
                glowColor: { value: new THREE.Color(this.options.glowColor) },
                singularityColor: { value: new THREE.Color(this.options.singularityColor) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 baseColor;
                uniform vec3 glowColor;
                uniform vec3 singularityColor;
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    // Create swirling pattern
                    float pattern = sin(vUv.x * 50.0 + time) * 0.5 + 0.5;
                    pattern *= sin(vUv.y * 30.0 - time * 2.0) * 0.5 + 0.5;
                    
                    // Enhanced depth fade towards singular point
                    float depthFade = 1.0 - (vPosition.z / -60.0);
                    float singularityEffect = pow(depthFade, 4.0); // Sharper fade
                    
                    // Enhance brightness towards the end
                    vec3 finalColor = mix(
                        mix(baseColor, glowColor, pattern),
                        singularityColor,
                        singularityEffect
                    );
                    
                    // Add brightness at the center
                    float centerGlow = 1.0 - abs(vUv.x - 0.5) * 2.0;
                    centerGlow = pow(centerGlow, 3.0);
                    
                    // Increase opacity towards singular point
                    float alpha = mix(0.8, 1.0, singularityEffect);
                    
                    gl_FragColor = vec4(finalColor * (pattern + centerGlow + singularityEffect), alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
        this.tunnel = tunnel;
        this.group.add(tunnel);
    }

    createSingularPoint() {
        // Create the singular point at the end of the tunnel
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(this.options.singularityColor) }
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
                uniform vec3 color;
                varying vec2 vUv;
                
                void main() {
                    // Pulsing effect
                    float pulse = 0.8 + 0.2 * sin(time * 3.0);
                    
                    // Radial gradient
                    vec2 center = vUv - vec2(0.5);
                    float dist = length(center);
                    float brightness = 1.0 - dist;
                    brightness = pow(brightness, 0.5); // Sharper falloff
                    
                    // Final color with intense glow
                    vec3 finalColor = color * (brightness * pulse * 2.0);
                    float alpha = brightness * pulse;
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const singularPoint = new THREE.Mesh(geometry, material);
        singularPoint.position.z = -this.options.depth + 0.5;
        this.singularPoint = singularPoint;
        this.group.add(singularPoint);

        // Add lens flare effect around singular point
        const flareGeometry = new THREE.PlaneGeometry(4, 4);
        const flareMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(this.options.singularityColor) }
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
                uniform vec3 color;
                varying vec2 vUv;
                
                void main() {
                    vec2 center = vUv - vec2(0.5);
                    float dist = length(center);
                    
                    // Create multiple circular rings
                    float rings = sin(dist * 20.0 - time) * 0.5 + 0.5;
                    rings *= smoothstep(1.0, 0.0, dist);
                    
                    // Pulsing intensity
                    float pulse = 0.8 + 0.2 * sin(time * 2.0);
                    
                    float alpha = rings * pulse * (1.0 - dist);
                    gl_FragColor = vec4(color, alpha * 0.5);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const flare = new THREE.Mesh(flareGeometry, flareMaterial);
        flare.position.z = -this.options.depth + 0.4;
        this.group.add(flare);
    }

    createParticleSystem() {
        const particleCount = 5000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color = new THREE.Color(this.options.dustColor);
        const geometry = new THREE.BufferGeometry();

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = Math.random() * this.options.radius;
            const theta = Math.random() * Math.PI * 2;
            const z = Math.random() * -this.options.depth;

            positions[i3] = Math.cos(theta) * radius;
            positions[i3 + 1] = Math.sin(theta) * radius;
            positions[i3 + 2] = z;

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pointTexture: { value: new THREE.TextureLoader().load('/path/to/particle.png') }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Add swirling motion
                    float theta = time * 0.1 + pos.z * 0.05;
                    float r = length(pos.xy);
                    pos.x = r * cos(theta);
                    pos.y = r * sin(theta);
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                
                void main() {
                    gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        });

        const particles = new THREE.Points(geometry, particleMaterial);
        this.particles = particles;
        this.group.add(particles);
    }

    createEnergyStreams() {
        const streamCount = 20;
        const curves = [];
        
        for (let i = 0; i < streamCount; i++) {
            const points = [];
            const radius = this.options.radius * 0.8;
            const revolutions = 2 + Math.random() * 3;
            const pointCount = 100;
            
            for (let j = 0; j < pointCount; j++) {
                const t = j / (pointCount - 1);
                const theta = t * Math.PI * 2 * revolutions;
                const r = radius * (1 - t * 0.3);
                const z = -t * this.options.depth;
                
                points.push(new THREE.Vector3(
                    r * Math.cos(theta),
                    r * Math.sin(theta),
                    z
                ));
            }
            
            curves.push(new THREE.CatmullRomCurve3(points));
        }

        const streamMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(this.options.glowColor) }
            },
            vertexShader: `
                varying float vProgress;
                uniform float time;
                
                void main() {
                    vProgress = position.y; // Using Y coordinate as progress
                    vec3 pos = position;
                    
                    // Animate along the curve
                    float offset = mod(time * 0.5, 1.0);
                    pos.y = mod(pos.y + offset, 1.0);
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying float vProgress;

                #define PI 3.14159265359
                                
                void main() {
                    float alpha = sin(vProgress * PI);
                    gl_FragColor = vec4(color, alpha * 0.5);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        curves.forEach(curve => {
            const geometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
            const stream = new THREE.Mesh(geometry, streamMaterial);
            this.group.add(stream);
        });
    }

    createOuterGlow() {
        const glowGeometry = new THREE.TorusGeometry(
            this.options.radius * 1.1,
            this.options.radius * 0.4,
            30,
            100
        );

        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(this.options.glowColor) }
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
                uniform vec3 color;
                varying vec2 vUv;
                
                void main() {
                    float strength = 0.5 * (1.0 + sin(time * 2.0));
                    float alpha = smoothstep(0.0, 1.0, 1.0 - length(vUv - vec2(0.5)));
                    gl_FragColor = vec4(color, alpha * strength * 0.3);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.group.add(glow);
    }

    createEntranceDistortion() {
        const entranceGeometry = new THREE.CircleGeometry(this.options.radius * 1.1, 64);
        const entranceMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(this.options.glowColor) }
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
                uniform vec3 color;
                varying vec2 vUv;
                
                void main() {
                    vec2 center = vUv - 0.5;
                    float dist = length(center);
                    float strength = smoothstep(0.0, 0.5, 1.0 - dist);
                    float ripple = sin(dist * 20.0 - time * 3.0) * 0.5 + 0.5;
                    gl_FragColor = vec4(color, strength * ripple * 0.5);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
        entrance.position.z = 1;
        this.group.add(entrance);
    }

    update(deltaTime) {
        this.time += deltaTime * this.options.timeScale;

        // Update all shader uniforms
        this.tunnel.material.uniforms.time.value = this.time;
        this.particles.material.uniforms.time.value = this.time;
        this.singularPoint.material.uniforms.time.value = this.time;

        // Update all child meshes that have materials with time uniforms
        this.group.traverse(child => {
            if (child.material && child.material.uniforms && child.material.uniforms.time) {
                child.material.uniforms.time.value = this.time;
            }
        });

    }
}


class WormholeChallenge {
    constructor() {
        this.container = document.getElementById('wormhole-challenge');
        this.canvas = document.getElementById('wormholeCanvas');
        this.questionPanel = document.querySelector('.question-panel');
        this.optionsPanel = document.querySelector('.wormhole-options');
        this.correctCount = 0;
        this.currentLevel = 0;
        
        this.setupAudio();
        this.setupThreeJS();
        this.currentOptionsCount = 3;
        this.answeredQuestions = new Set();        
        this.currentLesson = null;
        this.showIntroductionPanel = this.showIntroductionPanel.bind(this);
    }

    setupAudio() {
        this.bgm = new Audio('wormhole.mp3');
        this.bgm.loop = true;
        this.bgm.volume = 0.5;
        this.flySound = new Audio('flyin.mp3');
        this.flySound.volume = 1.0;
        this.successSound = new Audio('success.mp3');
        this.successSound.volume = 0.7;
        this.failSound = new Audio('fail.mp3');
    }

    setupThreeJS() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Add space environment
        this.addSpaceEnvironment();
        
        // Setup camera
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 5;

    }

    addSpaceEnvironment() {
        // Create starfield
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for(let i = 0; i < 1000; i++) {
            starVertices.push(
                THREE.MathUtils.randFloatSpread(100),
                THREE.MathUtils.randFloatSpread(100),
                THREE.MathUtils.randFloatSpread(100)
            );
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });
        this.starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starField);
    }

    createWormholes() {
        // Remove any existing wormholes
        if (this.wormholes) {
            this.wormholes.forEach(wormhole => {
                this.scene.remove(wormhole);
            });
        }

        this.wormholes = [];
        const colors = [0x00ff00, 0xff0000, 0x0000ff, 0xffff00];
        const wormholeCount = this.correctCount + 3;
        for(let i = 0; i < wormholeCount; i++) {
            const wormhole = this.createWormhole(colors[i]);
            wormhole.position.x = 4.5*(2*i-wormholeCount+1);
            wormhole.position.y = 0;
            wormhole.position.z = -10;
            this.wormholes.push(wormhole);
            this.scene.add(wormhole);
        }
    }

    createWormhole(color) {
        const wormholeEffect = new WormholeEffect({
            radius: 3,
            depth: 100,
            timeScale: 1
        });
        // Store the effect instance in the group's userData
        wormholeEffect.group.userData.effect = wormholeEffect;
        return wormholeEffect.group;
    }

    showChallenge(currentLesson) {
        // Setup camera
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 5;
        this.container.classList.remove('hidden');
        this.currentLesson = currentLesson;
        this.answeredQuestions.clear();
        this.currentOptionsCount = 3;
        
        // Show introduction panel before starting the challenge
        this.showIntroductionPanel(() => {
            this.showQuestion();
            this.animate();
        });
    }

    showIntroductionPanel(callback) {
        this.bgm.currentTime = 0;
        this.bgm.play();
        const panel = document.createElement('div');
        panel.className = 'mission-panel';
        panel.innerHTML = `
            <div class="mission-content wormhole-intro">
                <h2>WORMHOLE NAVIGATION BRIEFING</h2>
                <div class="mission-details">
                    <p>⚡ QUANTUM ALERT: Multiple wormholes detected in your sector!</p>
                    <h3>MISSION PARAMETERS:</h3>
                    <ul>
                        <li>Navigate through quantum wormholes by selecting correct answers</li>
                        <li>Each correct answer reveals a new wormhole path</li>
                        <li>Initial paths: 3 wormholes</li>
                        <li>Maximum paths: 5 wormholes</li>
                        <li>Required successful jumps: 3</li>
                    </ul>
                    <h3>CAUTION:</h3>
                    <p>Wrong choices may cause temporal distortions!</p>
                    <div class="wormhole-status">
                        <p>Successful Jumps: 0/3</p>
                    </div>
                </div>
                <button class="start-mission">INITIATE QUANTUM JUMP</button>
            </div>
        `;
        
        this.container.appendChild(panel);

        const startButton = panel.querySelector('.start-mission');
        startButton.addEventListener('click', () => {
            panel.remove();
            callback();
        });
    }

    showQuestion() {
        this.createWormholes();
        const question = this.generateQuestion();
        this.questionPanel.innerHTML = `<h2>${question.text}</h2>`;
        
        this.optionsPanel.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('div');
            button.className = 'wormhole-marker';
            button.textContent = option;
            button.addEventListener('click', () => this.checkAnswer(index === question.correct,index));
            this.optionsPanel.appendChild(button);
        });
    }

    generateQuestion() {
        const lessonQuestions = QUESTIONS[this.currentLesson.name];
        if (!lessonQuestions) return null;

        // Filter out already answered questions
        const availableQuestions = lessonQuestions.filter(q => !this.answeredQuestions.has(q.text));
        if (availableQuestions.length === 0) {
            // If all questions were answered, reset the pool
            this.answeredQuestions.clear();
            return this.generateQuestion();
        }

        // Randomly select a question
        const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        const question = availableQuestions[questionIndex];
        this.answeredQuestions.add(question.text);

        // Get all options and correct answer
        const allOptions = [...question.options];
        const correctAnswer = question.answer;

        // Ensure correct answer is included and get random options
        let selectedOptions = [correctAnswer];
        const remainingOptions = allOptions.filter(opt => opt !== correctAnswer);
        
        // Randomly select additional options up to currentOptionsCount
        while (selectedOptions.length < this.currentOptionsCount && remainingOptions.length > 0) {
            const index = Math.floor(Math.random() * remainingOptions.length);
            selectedOptions.push(remainingOptions.splice(index, 1)[0]);
        }

        // Shuffle the selected options
        selectedOptions = selectedOptions.sort(() => Math.random() - 0.5);

        return {
            text: question.text,
            options: selectedOptions,
            correct: selectedOptions.indexOf(correctAnswer)
        };
    }

    checkAnswer(correct,index) {
        if (correct) {
            this.successSound.play();
            this.correctCount++;
            document.querySelector('.correct-count').textContent = this.correctCount;           
            if (this.correctCount >= 3) {
                this.complete(index);
            } else {
                // Increase options count if still in challenge
                this.currentOptionsCount = Math.min(5, this.currentOptionsCount + 1);
                this.flyThroughWormhole(index, () => this.showQuestion());
            }
        } else {
            // Wrong answer effect
            this.failSound.play();
            this.shakeCamera(this.flyThroughWormhole(index,() => this.showQuestion()));            
        }
    }

    flyThroughWormhole(index,callback) {
        const targetWormhole = this.wormholes[index];        
        gsap.to(this.camera.position, {
            x: targetWormhole.position.x,
            y: targetWormhole.position.y,
            z: targetWormhole.position.z+5,
            duration: 1,
            ease: "power2.in",
            onComplete: () => {
                setTimeout(()=>{this.flySound.play();},2000);
                gsap.to(this.camera.position, {
                    x: targetWormhole.position.x,
                    y: targetWormhole.position.y,
                    z: targetWormhole.position.z-90,
                    duration: 5,
                    ease: "power4.in",
                    onComplete: () => {
                        // Reset camera position
                        this.camera.position.x = 0;
                        this.camera.position.z = 5;
                        callback();
                    }
                });
            }
        });
    }
    

    shakeCamera() {
        const originalPos = { ...this.camera.position };
        gsap.to(this.camera.position, {
            x: "+=0.2",
            y: "+=0.2",
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                gsap.set(this.camera.position, originalPos);
            }
        });
    }

    complete(index) {
        const targetWormhole = this.wormholes[index];
        
        gsap.to(this.camera.position, {
            x: targetWormhole.position.x,
            y: targetWormhole.position.y,
            z: targetWormhole.position.z+5,
            duration: 1,
            ease: "power2.in",
            onComplete: () => {
                setTimeout(()=>{this.flySound.play();},2000);
                gsap.to(this.camera.position, {
                    x: targetWormhole.position.x,
                    y: targetWormhole.position.y,
                    z: targetWormhole.position.z-90,
                    duration: 5,
                    ease: "power4.in",
                    onComplete: () => {
                        this.container.classList.add('hidden');
                        this.correctCount = 0;
                        this.bgm.pause();
                        document.querySelector('.correct-count').textContent = 0;
                        
                        // Mark current lesson as complete in the planet
                        if (this.currentLesson) {
                            const planet = window.universe.focusedPlanet;                   
                            const lessonIndex = planet.satellites.findIndex(s => s.lessonText === this.currentLesson.name);                            
                            planet.markLessonComplete(lessonIndex);                                 
                        }
                        
                        window.spaceshipInterface.returnToUniverse();
                    }
                });
            }
        });
    }

    animate() {
        if (this.container.classList.contains('hidden')) return;
        
        requestAnimationFrame(() => this.animate());
        
        // Rotate starfield
        this.starField.rotation.z += 0.0005;
        
        // Update all wormholes
        this.wormholes.forEach(wormhole => {
            const effect = wormhole.userData.effect;
            if (effect) {
                effect.update(0.016);
            }
            wormhole.rotation.z += 0.0075;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

window.wormholeChallenge = new WormholeChallenge();
