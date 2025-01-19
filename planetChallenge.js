class PlanetChallenge {
    constructor() {
        this.container = document.getElementById('planet-challenge');
        this.canvas = document.getElementById('planetCanvas');
        this.statusPanel = document.querySelector('.status-panel');
        this.steeringWheel = document.querySelector('.steering-wheel');
        
        this.setupThreeJS();
        this.setupControls();
        
        this.correctAnswers = 0;
        this.damage = 0;
        this.currentPlanet = null;
        this.isFlying = false;
        this.wrongAnswers = 0;
        this.currentQuestion = null;
        this.flightTimer = 0;
        this.timerInterval = null;
        this.asteroidFields = []; 
        this.currentLane = 1;
        this.stardust = null;  
        this.setupAudio();
        this.showIntroductionPanel = this.showIntroductionPanel.bind(this);
        this.setupEjectButton();
    }

    setupAudio() {
        this.bgm = new Audio('challenge.wav');
        this.bgm.loop = true;
        this.bgm.volume = 0.5;
        this.collisionSound = new Audio('asteroid.mp3');
        this.collisionSound.volume = 1.0;
        this.successSound = new Audio('success.mp3');
    }

    setupThreeJS() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Add space environment
        this.createSpaceEnvironment();
        
        // Create flight track
        this.createFlightTrack();
        
        // Setup initial camera position
        this.camera.position.set(0, -5, 0);
        this.camera.lookAt(0, 0, -50);

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createSpaceEnvironment() {
        // Add stars
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for(let i = 0; i < 2000; i++) {
            starVertices.push(
                THREE.MathUtils.randFloatSpread(200),
                THREE.MathUtils.randFloatSpread(200),
                THREE.MathUtils.randFloatSpread(200)
            );
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);

       
    }

    createFlightTrack() {
        // Create very long static track
        const trackGeometry = new THREE.BoxGeometry(60, 1, 10000);
        const trackMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        this.flightTrack = new THREE.Mesh(trackGeometry, trackMaterial);
        this.flightTrack.position.z = -5000; // Center the long track
        this.scene.add(this.flightTrack);

        // Single set of lane markers
        const markerGeometry = new THREE.BoxGeometry(1, 2, 10000);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        const leftMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        leftMarker.position.x = -20;
        this.flightTrack.add(leftMarker);

        const rightMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        rightMarker.position.x = 20;
        this.flightTrack.add(rightMarker);
    }

    setupControls() {
        // Create steering wheel UI
        const wheelRotator = document.createElement('div');
        wheelRotator.className = 'wheel-rotator';
        
        const wheelImage = document.createElement('img');
        wheelImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGZmZmYiIHN0cm9rZS13aWR0aD0iNCIvPgogIDxnIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSI4Ij4KICAgIDxwYXRoIGQ9Ik0xMDAgMjAgdjMwIiAvPgogICAgPHBhdGggZD0iTTEwMCAxNTAgdjMwIiAvPgogICAgPHBhdGggZD0iTTIwIDEwMCBoMzAiIC8+CiAgICA8cGF0aCBkPSJNMTUwIDEwMCBoMzAiIC8+CiAgICA8cGlyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjE1IiBmaWxsPSIjMDBmZmZmIi8+CiAgPC9nPgo8L3N2Zz4=';
        wheelImage.style.width = '100%';
        wheelImage.style.height = '100%';
        
        wheelRotator.appendChild(wheelImage);
        this.steeringWheel.innerHTML = '';
        this.steeringWheel.appendChild(wheelRotator);

        let steering = 0;
        
        const lanePositions = [-20, 0, 20];
        
        document.addEventListener('keydown', (e) => {
            if (!this.isFlying) return;
            
            if (e.key === 'ArrowLeft') {
                steering = -30;
                wheelRotator.style.transform = `rotate(${steering}deg)`;
                if (this.currentLane > 0) {
                    this.currentLane--;
                    gsap.to(this.camera.position, {
                        x: lanePositions[this.currentLane],
                        duration: 0.5,
                        ease: "power2.out"
                    });
                    this.highlightOption(this.currentLane);
                }
            } else if (e.key === 'ArrowRight') {
                steering = 30;
                wheelRotator.style.transform = `rotate(${steering}deg)`;
                if (this.currentLane < 2) {
                    this.currentLane++;
                    gsap.to(this.camera.position, {
                        x: lanePositions[this.currentLane],
                        duration: 0.5,
                        ease: "power2.out"
                    });
                    this.highlightOption(this.currentLane);
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                steering = 0;
                wheelRotator.style.transform = `rotate(${steering}deg)`;
            }
        });
    }

    highlightOption(laneIndex) {
        const panels = document.querySelectorAll('.answer-panel');
        panels.forEach((panel, index) => {
            if (index === laneIndex) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }

    startChallenge(planet) {
        this.currentPlanet = planet;
        this.container.classList.remove('hidden');
        this.correctAnswers = 0;
        this.damage = 0;
        
        // Show introduction panel before starting the challenge
        this.showIntroductionPanel(() => {
            this.updateStatus(); 
            this.startNewQuestion();
            this.animate();
            this.startTimer();
        });
    }

    showIntroductionPanel(callback) {
        const panel = document.createElement('div');
        panel.className = 'mission-panel';
        panel.innerHTML = `
            <div class="mission-content">
                <h2>EMERGENCY MISSION BRIEFING</h2>
                <div class="mission-details">
                    <p>⚠️ ALERT: Critical situation detected on planet ${this.currentPlanet.name}!</p>
                    <h3>MISSION PARAMETERS:</h3>
                    <ul>
                        <li>Navigate through space avoiding asteroids hidden in stardust. </li>
                        <li>Use ← and → arrow keys to change lanes</li>
                        <li>Choose the correct lane to avoid damage</li>
                        <li>Ship can withstand only 3 wrong decision</li>
                        <li>Complete 5 correct decision to reach destination</li>
                    </ul>
                    <h3>MISSION STATUS:</h3>
                    <p>Ship Integrity: 100%</p>
                    <p>Required decisions: 0/5</p>
                </div>
                <button class="start-mission">BEGIN MISSION</button>
            </div>
        `;
        
        this.container.appendChild(panel);
        this.bgm.play();
        const startButton = panel.querySelector('.start-mission');
        startButton.addEventListener('click', () => {
            panel.remove();
            callback();
        });
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.isFlying) {
                this.flightTimer++;
                this.updateStatus();
            }
        }, 1000);
    }

    startNewQuestion() {
        if (!this.isFlying) {
            this.startFlight();
        }
        
        // Reset all flags and state
        this.trackPosition = 0;
        this.pathChecked = false;
        this.nextQuestionPrepared = false;
        
        // Clear existing objects and ensure arrays are initialized
        this.asteroidFields = this.asteroidFields || [];
        if (this.stardust) {
            this.scene.remove(this.stardust);
            this.stardust = null;
        }
        this.asteroidFields.forEach(field => this.scene.remove(field));
        this.asteroidFields = [];

        // Generate and prepare initial question immediately
        const question = this.generateQuestion();
        this.currentQuestion = question;
        
        const lanes = [-20, 0, 20];
        const correctLane = Math.floor(Math.random() * 3);

        // Create initial stardust and asteroids
        this.createStardustEffect(-400);
        
        lanes.forEach((x, index) => {
            if (index !== correctLane) {
                this.createAsteroidField(x, 420);
            }
        });

        this.correctPathX = lanes[correctLane];
        this.createAnswerPanels(question, correctLane);
        this.updateStatus();
    }

    generateQuestion() {
        // Combine all lesson questions for this planet
        const allQuestions = this.currentPlanet.topicData.lessons.flatMap(
            lesson => QUESTIONS[lesson]
        );
        
        // Select random question
        return allQuestions[Math.floor(Math.random() * allQuestions.length)];
    }


    createAnswerPaths(question) {
        // Clear old paths and obstacles
        if (this.asteroidFields) {
            this.asteroidFields.forEach(field => this.scene.remove(field));
        }
        this.asteroidFields = [];

        // Create stardust effect at decision point
        this.createStardustEffect();

        // Create asteroid fields for wrong answers
        const lanes = [-20, 0, 20];
        const correctLane = Math.floor(Math.random() * 3);

        lanes.forEach((x, index) => {
            if (index !== correctLane) {
                this.createAsteroidField(x);
            }
        });

        // Set correct path data
        this.correctPathX = lanes[correctLane];
        
        // Create answer panels
        this.createAnswerPanels(question, correctLane);
    }

    createStardustEffect(baseZ = -400) {
        const nebula = new THREE.Group();
        
        // Create volumetric fog effect
        for (let i = 0; i < 8; i++) {
            const fogGeometry = new THREE.PlaneGeometry(100, 40);
            const fogMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x00ffff) }
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
                    
                    float rand(vec2 n) { 
                        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
                    }
                    
                    void main() {
                        vec2 uv = vUv;
                        float noise = rand(uv + time * 0.1);
                        float pattern = sin(uv.x * 10.0 + time) * sin(uv.y * 8.0 - time);
                        float alpha = smoothstep(0.0, 1.0, 1.0 - length(uv - 0.5) * 1.2) * 0.5;
                        alpha *= noise * pattern;
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });

            const fogPlane = new THREE.Mesh(fogGeometry, fogMaterial);
            fogPlane.position.z = i * -5;
            fogPlane.rotation.x = Math.PI / 2;
            nebula.add(fogPlane);
        }

        // Add particle system for additional effect
        const particleCount = 8000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = THREE.MathUtils.randFloatSpread(100);
            positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(40);
            positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(40);
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.5,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        nebula.add(particleSystem);

        nebula.position.z = baseZ;
        this.stardust = nebula;
        this.scene.add(nebula);
       
    }

    createAsteroidField(x, baseZ = 420) {
        const field = new THREE.Group();
        const asteroidCount = 20;

        for (let i = 0; i < asteroidCount; i++) {
            const geometry = new THREE.IcosahedronGeometry(1, 0);
            const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const asteroid = new THREE.Mesh(geometry, material);

            asteroid.position.set(
                x + THREE.MathUtils.randFloatSpread(10),
                THREE.MathUtils.randFloat(0, 20),
                THREE.MathUtils.randFloat(0, 50)
            );
            
            asteroid.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            field.add(asteroid);
        }

        field.position.z = -baseZ;
        field.userData.initialZ = -baseZ;
        this.asteroidFields.push(field);
        this.scene.add(field);
    }

    createAnswerPanels(question, correctLane) {
        const oldLabels = this.container.querySelectorAll('.answer-panel');
        oldLabels.forEach(label => label.remove());

        // Map answers to lanes based on correctLane
        const answers = new Array(3).fill(null);
        const availableAnswers = [...question.options];
        
        answers[correctLane] = question.answer;
        availableAnswers.splice(availableAnswers.indexOf(question.answer), 1);
        
        for (let i = 0; i < 3; i++) {
            if (i !== correctLane) {
                const wrongAnswer = availableAnswers.shift();
                answers[i] = wrongAnswer;
            }
        }

        // Position panels with more space between them (20%, 50%, 80%)
        answers.forEach((answer, index) => {
            const panel = document.createElement('div');
            panel.className = 'answer-panel';
            if (index === this.currentLane) panel.classList.add('active');
            panel.style.left = `${20 + (index * 30)}%`;  // Changed from 25+(index*25) to 20+(index*30)
            panel.innerHTML = `<span>${answer}</span>`;
            this.container.appendChild(panel);
        });
    }

    updateCameraPath(index) {
        if (!this.paths[index]) return;
        
        const targetX = this.paths[index].userData.targetX;
        gsap.to(this.camera.position, {
            x: targetX * 0.3, // Scale down camera movement to make it smoother
            duration: 0.5,
            ease: "power2.out"
        });

        // Highlight current path panel
        document.querySelectorAll('.answer-panel').forEach((panel, i) => {
            panel.classList.toggle('selected', i === index);
        });
    }

    takeDamage() {
        this.damage += 34;
        this.showDamageEffect();
        
        if (this.damage >= 100) {
            this.failChallenge();
        }
    }

    showDamageEffect() {
        // Add crack overlay to the panel
        const crack = document.createElement('div');
        crack.className = 'crack-overlay';
        this.container.appendChild(crack);
    }

    completeChallenge() {
        this.isFlying = false;
        this.bgm.pause();
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        // Show landing sequence
        this.showLandingSequence(() => {
            localStorage.setItem(
                `planet_${this.currentPlanet.name}_complete`,
                'true'
            );
            this.container.classList.add('hidden');
        });
    }

    showLandingSequence(callback) {
        // Create landing effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = '#ffffff';
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 2s';
        flash.style.zIndex = '1002';
        this.container.appendChild(flash);

        // Add success message
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.color = '#000';
        message.style.fontFamily = 'Orbitron, sans-serif';
        message.style.fontSize = '2rem';
        message.style.textAlign = 'center';
        message.style.opacity = '0';
        message.style.transition = 'opacity 2s';
        message.innerHTML = `
            <h2>Mission Complete!</h2>
            <p>"That's one small step for you, one giant leap for your future."</p>
        `;
        flash.appendChild(message);

        // Animate landing sequence
        setTimeout(() => {
            this.successSound.currentTime = 0;
            this.successSound.play();
            flash.style.opacity = '1';
            message.style.opacity = '1';
            
            setTimeout(() => {
                this.container.classList.add('hidden'); // Hide container before transition
                flash.style.opacity = '0';
                message.style.opacity = '0';
                
                setTimeout(() => {
                    flash.remove();
                    window.spaceshipInterface.returnToUniverse();
                    callback();
                }, 2000);
            }, 5000);
        }, 100);
    }

    failChallenge() {
        this.isFlying = false;
        this.bgm.pause();
        // Don't reset timer here

        // Create failure effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = '#ff0000';
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 1s';
        flash.style.zIndex = '1002';

        // Add failure message
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.color = '#fff';
        message.style.fontFamily = 'Orbitron, sans-serif';
        message.style.fontSize = '2rem';
        message.style.textAlign = 'center';
        message.style.opacity = '0';
        message.style.transition = 'opacity 1s';
        message.innerHTML = `
            <h2>Mission Failed</h2>
            <p>Ship integrity compromised. Click to retry.</p>
        `;
        flash.appendChild(message);
        this.container.appendChild(flash);

        // Add click handler to retry
        flash.addEventListener('click', () => {
            flash.remove();
            this.wrongAnswers = 0;
            this.correctAnswers = 0;
            this.damage = 0;
            this.currentLane = 1;
            this.bgm.currentTime = 0;
            this.bgm.play();
            this.startNewQuestion();
        });

        // Animate failure sequence
        setTimeout(() => {
            flash.style.opacity = '0.8';
            message.style.opacity = '1';
        }, 100);
    }

    animate() {
        if (this.container.classList.contains('hidden')) return;
        
        requestAnimationFrame(() => this.animate());
        
        if (this.isFlying) {
            // Update flight position and camera
            this.updateFlight();
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    updateStatus() {
        const minutes = Math.floor(this.flightTimer / 60);
        const seconds = Math.floor(this.flightTimer % 60);
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.statusPanel.innerHTML = `
            <div class="main-info">
                <div class="emergency-alert">EMERGENCY SITUATION!</div>
                <div class="question">${this.currentQuestion ? this.currentQuestion.text : ''}</div>
            </div>
            <div class="side-info">
                <div>Flight Time: ${timeStr}</div>
                <div>Distance: ${this.calculateDistance()} ly</div>
                <div>Integrity: ${Math.max(0, 100 - (this.wrongAnswers * 34))}%</div>
                <div>Progress: ${this.correctAnswers}/5</div>
            </div>
        `;
    }

    calculateDistance() {
        // Distance to planet starts at 1000 and decreases as you progress
        const baseDistance = 1000;
        const progressReduction = this.correctAnswers * 200;
        return Math.max(0, baseDistance - progressReduction);
    }

    startFlight() {
        this.isFlying = true;
        this.currentPosition = { x: 0, y: 0, z: -10 };
        this.camera.position.set(0, 5, -5);
        this.camera.lookAt(0, 0, -50);
        this.pathLocked = false; // Reset path lock

        // Add stronger lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2, 100);
        pointLight.position.set(0, 5, 10);
        this.scene.add(pointLight);

        // Add hemisphere light for better overall illumination
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
        this.scene.add(hemiLight);
    }

    updateFlight() {
        if (!this.isFlying) return;
        
        const speed = 1.75;
        this.trackPosition += speed;

        // Move and check objects
        if (this.asteroidFields) {
            this.asteroidFields.forEach(field => {
                field.position.z += speed;
            });
        }

        if (this.stardust) {
            this.stardust.position.z += speed;
            
            // Update shader time
            this.stardust.children.forEach(child => {
                if (child.material.uniforms?.time) {
                    child.material.uniforms.time.value = this.flightTimer * 0.1;
                }
            });
            
            // Check for stardust crossing
            if (!this.pathChecked && 
                this.stardust.position.z > -20 && 
                this.stardust.position.z < 20) {
                this.validateAnswer();
                
                // Prepare next question immediately after validation
                if (!this.nextQuestionPrepared) {
                    this.nextQuestionPrepared = true;
                    this.prepareNextQuestion();
                }
            }
        }

        // Cleanup old objects
        if (this.stardust && this.stardust.position.z > 200) {
            this.scene.remove(this.stardust);
            this.stardust = null;
        }

        if (this.asteroidFields) {
            this.asteroidFields = this.asteroidFields.filter(field => {
                if (field.position.z > 200) {
                    this.scene.remove(field);
                    return false;
                }
                return true;
            });
        }
    }

    prepareNextQuestion() {
        // Ensure arrays are initialized
        this.asteroidFields = this.asteroidFields || [];
        
        const question = this.generateQuestion();
        this.currentQuestion = question;
        
        const lanes = [-20, 0, 20];
        const correctLane = Math.floor(Math.random() * 3);

        // Create stardust and asteroid fields at appropriate distances
        if (this.stardust) {
            this.scene.remove(this.stardust);
        }
        this.createStardustEffect(-400);

        if (this.asteroidFields) {
            this.asteroidFields.forEach(field => this.scene.remove(field));
        }
        this.asteroidFields = [];
        
        // Create asteroid fields immediately after stardust
        lanes.forEach((x, index) => {
            if (index !== correctLane) {
                this.createAsteroidField(x, 420); // Just 20 units behind stardust
            }
        });

        this.correctPathX = lanes[correctLane];
        this.createAnswerPanels(question, correctLane);
        
        this.pathChecked = false;
        this.updateStatus();
    }

    validateAnswer() {
        this.pathChecked = true;
        const currentX = this.camera.position.x;
        
        if (Math.abs(currentX - this.correctPathX) > 10) {
            this.wrongAnswers++;
            this.showDamageEffect();
            this.collisionSound.currentTime = 0;
            this.collisionSound.play();
            if (this.wrongAnswers >= 3) {
                this.failChallenge();
                return;
            }
        } else {
            this.correctAnswers++;
            this.showSuccessEffect();
            if (this.correctAnswers >= 5) {
                this.completeChallenge();
                return;
            }
        }
        this.updateStatus();
        this.nextQuestionPrepared = false; // Reset flag after validation
    }

    extendTrack() {
        // Create new track segment
        const trackGeometry = new THREE.BoxGeometry(60, 1, 1000);
        const trackMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        const newTrack = new THREE.Mesh(trackGeometry, trackMaterial);
        newTrack.position.z = this.currentPosition.z - 1000;
        this.scene.add(newTrack);

        // Add lane markers
        const markerGeometry = new THREE.BoxGeometry(1, 2, 1000);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        const leftMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        leftMarker.position.x = -20;
        newTrack.add(leftMarker);

        const rightMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        rightMarker.position.x = 20;
        newTrack.add(rightMarker);

        // Store track segment for cleanup
        this.trackSegments = this.trackSegments || [];
        this.trackSegments.push(newTrack);
    }

    cleanupOldTrack() {
        if (!this.trackSegments) return;
        
        while (this.trackSegments.length > 2) {
            const segment = this.trackSegments.shift();
            this.scene.remove(segment);
            segment.geometry.dispose();
            segment.material.dispose();
        }
    }

    showSuccessEffect() {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = '#00ff00';
        flash.style.opacity = '0';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '1002';
        this.container.appendChild(flash);

        gsap.to(flash, {
            opacity: 0.3,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                flash.remove();
            }
        });
    }

    setupEjectButton() {
        const ejectBtn = document.createElement('button');
        ejectBtn.className = 'eject-button';
        ejectBtn.textContent = '⚠ EJECT';
        this.container.appendChild(ejectBtn);

        ejectBtn.addEventListener('click', () => this.showEjectConfirmation());
    }

    showEjectConfirmation() {
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <h3>WARNING: MISSION TERMINATION</h3>
            <p>Are you sure you want to eject?</p>
            <p>All mission progress will be lost.</p>
            <div class="buttons">
                <button class="confirm">Yes, Eject</button>
                <button class="cancel">No, Continue Mission</button>
            </div>
        `;

        this.container.appendChild(dialog);

        const confirmBtn = dialog.querySelector('.confirm');
        const cancelBtn = dialog.querySelector('.cancel');

        confirmBtn.addEventListener('click', () => {
            this.ejectFromMission();
            dialog.remove();
        });

        cancelBtn.addEventListener('click', () => {
            dialog.remove();
        });
    }

    ejectFromMission() {
        this.isFlying = false;
        this.bgm.pause();
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        // Show ejection animation/effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = '#ff3333';
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 1s';
        flash.style.zIndex = '1002';

        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.color = '#fff';
        message.style.fontFamily = 'Orbitron, sans-serif';
        message.style.fontSize = '2rem';
        message.style.textAlign = 'center';
        message.innerHTML = `Mission Terminated<br>Returning to Base`;

        flash.appendChild(message);
        this.container.appendChild(flash);

        setTimeout(() => {
            flash.style.opacity = '1';
            setTimeout(() => {
                document.getElementById('ui-overlay').style.display = 'block';
                window.universe.statusPanel.style.display = 'block';
                window.universe.playBgm();
                this.container.classList.add('hidden');
                flash.remove();
            }, 2000);
        }, 100);
    }
}

window.addEventListener('load', () => {
    window.planetChallenge = new PlanetChallenge();
});


