class BossBattle {
    constructor() {
        this.createInterface();
        this.container = document.getElementById('boss-battle');
        this.canvas = document.getElementById('bossCanvas');
        this.setupThreeJS();
        this.setupAudio();
        this.gameState = {
            pods: [],
            isRoundActive: false,
            remainingTime: 10,
            score: 0,
            roundCount: 0,
            currentSituation: null,
            actionType: null,
            availableActions: {
                canDrawLine: true,
                canAddPod: true,
                canMovePod: true
            }
        };
        this.moveIndicators = [];
        this.podSelectionEnabled = false;  
        this.isStarted = false;
        this.selectedPods = [];
        this.highlightedPods = new Set();
    }

    createInterface() {
        const container = document.createElement('div');
        container.id = 'boss-battle';
        container.className = 'hidden';
        container.innerHTML = `
            <canvas id="bossCanvas"></canvas>
            <div class="battle-ui">
                <div class="boss-status">
                    <div class="boss-timer">10</div>
                    <div class="boss-situation"></div>
                </div>
                <div class="grid-status">
                    <div class="grid-controls">
                        <button class="action-btn draw-line">Draw Line</button>
                        <button class="action-btn add-pod">Add Pod</button>
                        <button class="action-btn move-pod">Move Pod</button>
                    </div>
                    <div class="pod-count">Pods: <span>3</span></div>
                </div>
            </div>
        `;
        document.body.appendChild(container);
        
        this.container = container;
        this.canvas = container.querySelector('#bossCanvas');
        
        // Add eject button
        this.setupEjectButton();
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
            <p>Are you sure you want to abort the mission?</p>
            <p>All progress will be lost.</p>
            <div class="buttons">
                <button class="confirm">Yes, Abort Mission</button>
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
        this.gameState.isRoundActive = false;
        clearInterval(this.timerInterval);
        if(this.bgm){
            this.bgm.pause();
        }
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
        message.innerHTML = `Mission Aborted<br>Returning to Universe`;

        flash.appendChild(message);
        this.container.appendChild(flash);

        setTimeout(() => {
            flash.style.opacity = '1';
            setTimeout(() => {
                // Clean up boss battle
                this.clearMoveIndicators();
                if (this.situationLine) {
                    this.scene.remove(this.situationLine);
                    this.situationLine = null;
                }
                
                // Remove all pods
                this.gameState.pods.forEach(pod => {
                    this.scene.remove(pod.mesh);
                    if (pod.label) {
                        this.scene.remove(pod.label);
                    }
                });
                this.gameState.pods = [];
                
                // Hide boss battle and show universe
                this.container.classList.add('hidden');
                
                document.getElementById('ui-overlay').style.display = 'block';
                window.universe.statusPanel.style.display = 'block';
                window.universe.bgm.play();
                
                flash.remove();
                
                // Stop the animation loop
                this.animate = () => {};
                setTimeout(()=>{this.isStarted = false;} , 500);
            }, 2000);    
            
        }, 100);
    }

    setupThreeJS() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 1); // Set black background
        //const axesHelper = new THREE.AxesHelper( 5 );
        //this.scene.add( axesHelper );
        // Create space environment
        this.createSpaceBackground();
        this.createGrid();
        this.createBoss();
        this.setupLights();

        // Set up camera
        this.camera.position.set(0, 15, 20);
        this.camera.lookAt(0, 0, -5);

        // Add window resize handler
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createSpaceBackground() {
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for(let i = 0; i < 10000; i++) {
            starVertices.push(
                THREE.MathUtils.randFloatSpread(2000),
                THREE.MathUtils.randFloatSpread(2000),
                THREE.MathUtils.randFloatSpread(2000)
            );
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    createGrid() {
        // Create 10x10 grid platform
        const gridGeometry = new THREE.PlaneGeometry(20, 20, 10, 10);
        const gridMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        this.grid = new THREE.Mesh(gridGeometry, gridMaterial);
        this.grid.rotation.x = -Math.PI / 2;
        this.grid.position.set(0, 0, -5);
        this.scene.add(this.grid);

        // Add 10x10 grid lines
        const gridHelper = new THREE.GridHelper(20, 10, 0x444444, 0x444444);
        gridHelper.position.set(0, 0.01, -5);
        this.scene.add(gridHelper);

        // Add axis labels
        for(let i = 0; i <= 10; i++) {
            // X axis labels
            const xLabel = this.createTextSprite(i.toString());
            xLabel.position.set(i*2 - 10, 0.5, 5);
            this.scene.add(xLabel);

            // Y axis labels
            const yLabel = this.createTextSprite(i.toString());
            yLabel.position.set(-10, 0.5, 5-i*2);
            if(i!==0)this.scene.add(yLabel);
        }
    }

    createTextSprite(text) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 64;
        canvas.height = 64;
        
        ctx.font = 'Bold 48px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(text, 32, 48);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.5, 0.5, 1);
        return sprite;
    }

    createPosSprite(text) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128; // Doubled canvas size
        canvas.height = 128;
        
        ctx.font = 'Bold 64px Arial'; // Increased font size
        ctx.fillStyle = '#ffffff'; // Pure white
        ctx.strokeStyle = '#000000'; // Black outline
        ctx.lineWidth = 4; // Thick outline
        ctx.textAlign = 'center';
        ctx.strokeText(text, 64, 80); // Draw text outline
        ctx.fillText(text, 64, 80);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(1, 1, 1); // Doubled sprite scale
        return sprite;
    }

    createBoss() {
        // Create basic boss geometry with improved visibility
        const bossGeometry = new THREE.SphereGeometry(2, 32, 32);
        const bossMaterial = new THREE.MeshPhongMaterial({
            color: 0x303030,
            emissive: 0x303030,
            emissiveIntensity: 0.5,
        });
        this.boss = new THREE.Mesh(bossGeometry, bossMaterial);
        this.boss.position.set(0, 4, -15); // Position boss at back of grid
        this.scene.add(this.boss);

        // Add "eye" effect
        const eyeGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const eyeMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.8
        });
        this.bossEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.bossEye.position.z = 1.5;
        this.boss.add(this.bossEye);
    }

    setupLights() {
        // Improve lighting
        const ambientLight = new THREE.AmbientLight(0x444444, 1);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
        pointLight.position.set(0, 20, 10);
        this.scene.add(pointLight);

        const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        this.scene.add(hemiLight);
    }

    setupAudio() {
        this.bgm = new Audio('challenge.wav');
        this.bgm.loop = true;
        this.bgm.volume = 0.5;
        //this.podSound = new Audio('pod.mp3');
        //this.podSound.volume = 0.7;
        this.eliminateSound = new Audio('eliminate.mp3');
        this.winSound = new Audio('success.mp3');
    }

    startGame() {
        // Hide universe UI and status panel
        document.getElementById('ui-overlay').style.display = 'none';
        window.universe.statusPanel.style.display = 'none';
        window.universe.bgm.pause();
        this.bgm.currentTime = 0;
        this.bgm.play();
        this.isStarted = true;
        // Show boss battle container
        this.container.classList.remove('hidden');
        
        // Remove any existing panels first
        const existingPanels = document.querySelectorAll('.mission-panel');
        existingPanels.forEach(panel => panel.remove());
        
        // Show introduction panel before starting the battle
        this.showIntroductionPanel(() => {
            this.createInitialPods();
            this.setupEventListeners();
            this.startRound();
            this.animate();

            // Ensure canvas is properly sized
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            
            // Focus camera on grid
            gsap.to(this.camera.position, {
                x: 0,
                y: 10,
                z: 12,
                duration: 1,
                ease: "power2.inOut"
            });
        });
    }

    showIntroductionPanel(callback) {
        // Remove any existing panels first
        const existingPanels = document.querySelectorAll('.mission-panel');
        existingPanels.forEach(panel => panel.remove());

        const panel = document.createElement('div');
        panel.className = 'mission-panel';
        panel.innerHTML = `
            <div class="mission-content boss-intro">
                <h2>⚠️ FINAL MISSION: EARTH'S LAST HOPE ⚠️</h2>
                <div class="mission-details">
                    <p class="alert">CRITICAL ALERT: Earth's computational core has been compromised!</p>
                    
                    <h3>SITUATION:</h3>
                    <ul>
                        <li>A hostile AI has taken control of Earth's computational core</li>
                        <li>The core's recovery data is stored in your escape pods</li>
                        <li>You must transmit this data back to Earth</li>
                    </ul>

                    <h3>MISSION OBJECTIVES:</h3>
                    <ul>
                        <li>Guide at least one escape pod to reach Earth (top of grid)</li>
                        <li>Protect pods from the hostile AI's elimination patterns</li>
                        <li>Use all algebraic knowledge you learned to predict AI's behavior</li>
                    </ul>

                    <h3>AVAILABLE ACTIONS:</h3>
                    <ul>
                        <li><span class="action">Draw Line</span>: Draw a line that has correct slope by picking two points</li>
                        <li><span class="action">Add Pod</span>: Deploy a new escape pod (y ≤ 3)</li>
                        <li><span class="action">Move Pod</span>: Reposition an existing pod</li>
                    </ul>

                    <h3>AI BEHAVIOR:</h3>
                    <p>Every 10 seconds, the AI will either:</p>
                    <ul>
                        <li class="warning">ELIMINATE pods that match its pattern</li>
                        <li class="success">ADVANCE pods that match its pattern</li>
                    </ul>
                    
                    <div class="boss-warning">
                        <p>⚠️ All pods must advance strategically to avoid elimination!</p>
                        <p>⚠️ When all pods are eliminated, mission fails</p>
                        <p>⚠️ This challenge is still under development, so there might be some errors</p>
                    </div>
                </div>
                <button class="start-mission">INITIATE FINAL MISSION</button>
            </div>
        `;
        
        this.container.appendChild(panel);

        const startButton = panel.querySelector('.start-mission');
        startButton.addEventListener('click', () => {
            const panels = document.querySelectorAll('.mission-panel');
            panels.forEach(p => p.remove());
            callback();
        }, { once: true }); // Ensure the event listener only fires once
    }

    createInitialPods() {
        for(let i = 0; i < 3; i++) {
            const x = THREE.MathUtils.randInt(0, 10);
            const y = THREE.MathUtils.randInt(0, 3);
            const pod = new Pod(x, y);
            this.gameState.pods.push(pod);
            pod.label = this.createPosSprite(`(${x},${y})`);
            pod.label.position.copy(pod.mesh.position).add(new THREE.Vector3(0, 0.6, 0));
            this.scene.add(pod.label);
            this.scene.add(pod.mesh);
        }
    }

    setupEventListeners() {
        // Add event listeners for buttons
        document.querySelector('.draw-line').addEventListener('click', () => {
            if(this.gameState.availableActions.canDrawLine) {
                this.handlePlayerAction('drawLine');
            }
        });

        document.querySelector('.add-pod').addEventListener('click', () => {
            if(this.gameState.availableActions.canAddPod) {
                this.handlePlayerAction('addPod');
            }
        });

        document.querySelector('.move-pod').addEventListener('click', () => {
            if(this.gameState.availableActions.canMovePod) {
                this.handlePlayerAction('movePod');
            }
        });
    }

    startRound() {
        // Reset state for new round
        this.gameState.isRoundActive = true;
        this.gameState.remainingTime = 10;
        
        // Reset available actions
        this.gameState.availableActions = {
            canDrawLine: true,
            canAddPod: true,
            canMovePod: true
        };
        this.updateActionButtons();

        // Generate new situation
        this.gameState.currentSituation = this.generateSituation();
        document.querySelector('.boss-situation').textContent = 
            this.gameState.currentSituation.getDisplayText();

        // Start timer
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);

        // Show boss turning animation
        gsap.to(this.boss.rotation, {
            y: Math.PI,
            duration: 1,
            ease: "power2.inOut"
        });

        // Clear any existing situation line
        if (this.situationLine) {
            this.scene.remove(this.situationLine);
            this.situationLine = null;
        }

        this.podSelectionEnabled = false;  // Add this line to reset pod selection state
    }

    generateSituation() {
        const types = ['slope', 'equation', 'inequality'];
        const type = types[Math.floor(Math.random() * types.length)];
        const actionType = type === 'slope' ? 'reward' : Math.random() > 0.5 ? 'reward' : 'eliminate';

        let params;
        switch (type) {
            case 'slope':
                params = { slope: Math.floor(Math.random() * 7) - 3 }; // -3 to 3
                break;
            case 'equation':
                params = {
                    a: Math.floor(Math.random() * 3) + 1, // 1 to 3
                    b: Math.floor(Math.random() * 5) - 2  // -2 to 2
                };
                break;
            case 'inequality':
                params = {
                    a: Math.floor(Math.random() * 3) + 1,
                    b: Math.floor(Math.random() * 5) - 2,
                    sign: Math.random() > 0.5 ? '>' : '<'
                };
                break;
        }

        return new BossSituation(type, params, actionType);
    }

    handlePlayerAction(actionType, params) {
        if (!this.gameState.isRoundActive) return;
        
        switch (actionType) {
            case 'drawLine':
                if (!this.gameState.availableActions.canDrawLine) return;
                if (this.gameState.currentSituation.type === 'slope') {
                    this.showFloatingMessage("Select two pods to draw line");
                    this.startPodSelectionMode();
                } else {
                    const line = this.drawLine(params.start, params.end);
                    this.scene.add(line);
                    this.gameState.availableActions.canDrawLine = false;
                }
                break;

            case 'addPod':
                if (!this.gameState.availableActions.canAddPod) return;
                // Restrict pod placement to y ≤ 3
                let x, y;
                do {
                    x = THREE.MathUtils.randInt(0, 10);
                    y = THREE.MathUtils.randInt(0, 3);
                } while (this.gameState.pods.some(pod => pod.x === x && pod.y === y));
                const pod = new Pod(x, y);
                this.gameState.pods.push(pod);
                this.scene.add(pod.mesh);
                // Add position label
                pod.label = this.createPosSprite(`(${x},${y})`);
                pod.label.position.copy(pod.mesh.position).add(new THREE.Vector3(0, 0.6, 0));
                this.scene.add(pod.label);
                this.gameState.availableActions.canAddPod = false;
                break;

            case 'movePod':
                if (!this.gameState.availableActions.canMovePod) return;
                // Clear any existing move indicators
                this.clearMoveIndicators();
                
                // Show message
                this.showFloatingMessage("Choose a pod to move");
                
                // Enable pod selection and setup the handler
                this.podSelectionEnabled = true;  // Add this line
                this.setupPodSelection();
                break;
        }

        this.updateActionButtons();
    }

    startPodSelectionMode() {
        this.selectedPods = [];
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        const clickHandler = (event) => {
            if (!this.gameState.availableActions.canDrawLine) {
                window.removeEventListener('click', clickHandler);
                return;
            }

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);

            const intersects = raycaster.intersectObjects(
                this.gameState.pods.map(pod => pod.mesh)
            );

            if (intersects.length > 0) {
                const clickedPod = this.gameState.pods.find(
                    pod => pod.mesh === intersects[0].object
                );
                
                if (!this.selectedPods.includes(clickedPod)) {
                    this.selectedPods.push(clickedPod);
                    this.highlightPod(clickedPod);

                    if (this.selectedPods.length === 2) {
                        this.drawLineBetweenPods(this.selectedPods[0], this.selectedPods[1]);
                        this.gameState.availableActions.canDrawLine = false;
                        this.updateActionButtons();
                        window.removeEventListener('click', clickHandler);
                        
                        // Calculate and store slope for evaluation
                        const slope = this.calculateSlope(this.selectedPods[0], this.selectedPods[1]);
                        this.drawnSlope = slope;
                    }
                }
            }
        };

        window.addEventListener('click', clickHandler);
    }

    highlightPod(pod) {
        const originalColor = pod.mesh.material.color.getHex();
        pod.mesh.material.color.setHex(0xffff00);
        pod.mesh.material.emissive.setHex(0xffff00);
        this.highlightedPods.add(pod);
    }

    clearPodHighlights() {
        this.highlightedPods.forEach(pod => {
            pod.mesh.material.color.setHex(0x00ff00);
            pod.mesh.material.emissive.setHex(0x00ff00);
        });
        this.highlightedPods.clear();
    }

    drawLineBetweenPods(pod1, pod2) {
        const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
        const points = [
            pod1.mesh.position.clone(),
            pod2.mesh.position.clone()
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        this.drawnLine = line;
        this.scene.add(line);
    }

    calculateSlope(pod1, pod2) {
        return (pod2.y - pod1.y) / (pod2.x - pod1.x);
    }

    setupPodSelection() {
        if (!this.podSelectionEnabled) return;  // Add this check
        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        const clickHandler = (event) => {
            if (!this.podSelectionEnabled) {  // Add this check
                window.removeEventListener('click', clickHandler);
                return;
            }
            
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(
                this.gameState.pods.map(pod => pod.mesh)
            );

            if (intersects.length > 0) {
                const selectedPod = this.gameState.pods.find(
                    pod => pod.mesh === intersects[0].object
                );
                this.showMoveOptions(selectedPod);
            }
        };

        window.addEventListener('click', clickHandler);
        
        // Remove event listener when timer runs out
        const remainingTime = this.gameState.remainingTime;
        setTimeout(() => {
            window.removeEventListener('click', clickHandler);
            this.clearMoveIndicators();
            this.podSelectionEnabled = false;  // Add this line
        }, remainingTime * 1000);
    }

    showMoveOptions(pod) {
        // Clear any existing indicators
        this.clearMoveIndicators();
        
        // Possible move directions: up, right, down, left
        const moves = [
            { dx: 0, dy: 1, x: pod.x, y: pod.y + 1 },
            { dx: 1, dy: 0, x: pod.x + 1, y: pod.y },
            { dx: 0, dy: -1, x: pod.x, y: pod.y - 1 },
            { dx: -1, dy: 0, x: pod.x - 1, y: pod.y }
        ];

        // Create indicator for valid moves
        moves.forEach(move => {
            if (this.isValidMove(move.x, move.y)) {
                const indicator = this.createMoveIndicator(move.x, move.y);
                indicator.userData.move = { dx: move.dx, dy: move.dy };
                indicator.userData.pod = pod;
                
                // Add click handler to indicator
                indicator.userData.clickHandler = () => {
                    pod.move(move.dx, move.dy);
                    this.clearMoveIndicators();
                    this.gameState.availableActions.canMovePod = false;
                    this.updateActionButtons();
                };
                
                this.moveIndicators.push(indicator);
                this.scene.add(indicator);
            }
        });
    }

    isValidMove(x, y) {
        // Check bounds
        if (x < 0 || x > 10 || y < 0 || y > 10) return false;
        
        // Don't allow moving beyond current y + 1
        if (y > 10) return false;
        
        // Check if position is occupied
        return !this.gameState.pods.some(pod => pod.x === x && pod.y === y);
    }

    createMoveIndicator(x, y) {
        const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.6
        });
        const indicator = new THREE.Mesh(geometry, material);
        indicator.position.set(x*2-10, 0.1, 5-y*2);
        
        // Add pulsing animation
        const animate = () => {
            if (!indicator.parent) return; // Stop if removed
            material.opacity = 0.3 + Math.sin(Date.now() * 0.005) * 0.3;
            requestAnimationFrame(animate);
        };
        animate();
        
        // Add click handling to the indicator
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        const clickHandler = (event) => {
            if (!this.podSelectionEnabled) {  // Add this check
                window.removeEventListener('click', clickHandler);
                return;
            }
            
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(indicator);

            if (intersects.length > 0) {
                indicator.userData.clickHandler();
                this.podSelectionEnabled = false;  // Add this line
            }
        };

        window.addEventListener('click', clickHandler);
        
        // Store the handler to remove it later
        indicator.userData.globalClickHandler = clickHandler;
        
        return indicator;
    }

    clearMoveIndicators() {
        this.moveIndicators.forEach(indicator => {
            // Remove click handler
            if (indicator.userData.globalClickHandler) {
                window.removeEventListener('click', indicator.userData.globalClickHandler);
            }
            this.scene.remove(indicator);
        });
        this.moveIndicators = [];
    }

    drawLine(start, end) {
        const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
        const points = [
            new THREE.Vector3(start.x, 0.1, -start.y),
            new THREE.Vector3(end.x, 0.1, -end.y)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return new THREE.Line(geometry, material);
    }

    updateActionButtons() {
        const actions = this.gameState.availableActions;
        document.querySelector('.draw-line').disabled = !actions.canDrawLine;
        document.querySelector('.add-pod').disabled = !actions.canAddPod;
        document.querySelector('.move-pod').disabled = !actions.canMovePod;
    }

    evaluateSituation() {
        const situation = this.gameState.currentSituation;
        
        if (situation.type === 'slope') {
            // Special handling for slope situations
            const targetSlope = situation.params.slope;
            const drawnSlope = this.drawnSlope;
            
            if (drawnSlope === targetSlope) {
                this.showFloatingMessage("Correct slope! Pods advance!", 2000);
                this.selectedPods.forEach(pod => {
                    pod.move(0, Math.min(1, 10 - pod.y));
                });
            } else {
                if(this.selectedPods.length===2)this.showFloatingMessage("Incorrect slope!", 2000);
            }
            
            // Clean up
            if (this.drawnLine) {
                this.scene.remove(this.drawnLine);
                this.drawnLine = null;
            }
            this.clearPodHighlights();
            this.selectedPods = [];
            
            // Move all pods forward and start new round
            setTimeout(() => {
                this.gameState.pods.forEach(pod => pod.move(0, 1));
                this.startRound();
            }, 2000);
            
            return;
        }

        const isReward = situation.actionType === 'reward';
        let affectedPods = [];

        // Check each pod against the current situation
        this.gameState.pods.forEach(pod => {
            if (situation.evaluate(pod)) {
                affectedPods.push(pod);
            }
        });

        if (isReward) {
            // Move affected pods forward
            affectedPods.forEach(pod => {
                pod.move(0, Math.min(1, 10 - pod.y));
                //this.rewardSound.play();
            });
        } else {
            // Eliminate affected pods
            affectedPods.forEach(pod => {
                this.eliminateSound.play();                
                pod.destroy();                
                this.gameState.pods = this.gameState.pods.filter(p => p !== pod);
            });
        }

        // Check win/lose conditions
        if (this.checkWinCondition()) {
            this.showGameOver(true);
        } else if (this.checkLoseCondition()) {
            this.showGameOver(false);
        } else {
            // Move all remaining pods forward one step
            this.gameState.pods.forEach(pod => pod.move(0, 1));
            this.startRound();
        }
    }

    checkWinCondition() {
        return this.gameState.pods.some(pod => pod.y >= 10);
    }

    checkLoseCondition() {
        return this.gameState.pods.length === 0;
    }

    updateTimer() {
        this.gameState.remainingTime--;
        document.querySelector('.boss-timer').textContent = this.gameState.remainingTime;

        if (this.gameState.remainingTime <= 0) {
            clearInterval(this.timerInterval);
            this.clearMoveIndicators();
            
            // Show the line if it's a line or inequality situation
            if (this.gameState.currentSituation.type === 'equation' || 
                this.gameState.currentSituation.type === 'inequality') {
                this.showSituationLine();
            }
            
            // Boss turn around animation
            gsap.to(this.boss.rotation, {
                y: 0,
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    this.evaluateSituation();
                }
            });
        }
    }

    showSituationLine() {
        const situation = this.gameState.currentSituation;
        if (situation.type !== 'equation' && situation.type !== 'inequality') return;
        
        const { a, b } = situation.params;
        const isReward = situation.actionType === 'reward';
        const lineColor = isReward ? 0x00ffff : 0xff3333;
        
        // Create container for all visual elements
        const visualsContainer = new THREE.Group();
        
        // Calculate line points
        const x1 = -10;
        const y1 = a * x1 + b;
        const x2 = 10;
        const y2 = a * x2 + b;
        
        // Create main line
        const start = new THREE.Vector3(x1*2-10, 0.2, 5-y1*2);
        const end = new THREE.Vector3(x2*2-10, 0.2, 5-y2*2);
        
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: lineColor,
            linewidth: 2
        });
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        visualsContainer.add(line);

        if (situation.type === 'inequality') {
            // Create two planes for the valid region
            const validRegionGeometry = new THREE.PlaneGeometry(40, 20, 20, 20);
            const validRegionMaterial = new THREE.MeshBasicMaterial({
                color: lineColor,
                transparent: true,
                opacity: 0.1,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            // Position the plane based on inequality sign
            if (situation.params.sign === '>') {
                // For y > ax + b, create plane above the line
                const plane = new THREE.Mesh(validRegionGeometry, validRegionMaterial);
                plane.rotation.x = -Math.PI / 2;
                plane.position.set(0, 0.1, -5);
                
                // Calculate points for clipping
                const normal = new THREE.Vector3(a, -1, 0).normalize();
                const point = new THREE.Vector3(0, b, 0);
                const clipPlane = new THREE.Plane(normal, -point.dot(normal));
                
                validRegionMaterial.clippingPlanes = [clipPlane];
                this.renderer.localClippingEnabled = true;
                
                //visualsContainer.add(plane);
            } else {
                // For y < ax + b, create plane below the line
                const plane = new THREE.Mesh(validRegionGeometry, validRegionMaterial);
                plane.rotation.x = -Math.PI / 2;
                plane.position.set(0, 0.1, -5);
                
                // Calculate points for clipping
                const normal = new THREE.Vector3(-a, 1, 0).normalize();
                const point = new THREE.Vector3(0, b, 0);
                const clipPlane = new THREE.Plane(normal, -point.dot(normal));
                
                validRegionMaterial.clippingPlanes = [clipPlane];
                this.renderer.localClippingEnabled = true;
                
                //visualsContainer.add(plane);
            }
        }

        this.situationLine = visualsContainer;
        this.scene.add(visualsContainer);

        // Remove all elements after evaluation
        setTimeout(() => {
            if (this.situationLine) {
                this.scene.remove(this.situationLine);
                this.situationLine = null;
                this.renderer.localClippingEnabled = false;
            }
        }, 3000);
    }

    updatePodLabels() {
        this.gameState.pods.forEach(pod => {
            if (pod.label) {
                pod.label.position.copy(pod.mesh.position).add(new THREE.Vector3(0, 0.6, 0));
            }
        });
    }

    animate() {
        if (this.container.classList.contains('hidden')) return;
        
        requestAnimationFrame(() => this.animate());

        // Rotate stars slightly for background effect
        if (this.stars) {
            this.stars.rotation.y += 0.0001;
            this.stars.rotation.x += 0.0001;
        }

        // Pulse effect for boss eye
        if (this.bossEye) {
            const time = performance.now() * 0.001;
            this.bossEye.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
        }

        // Update pods position display
        document.querySelector('.pod-count span').textContent = this.gameState.pods.length;

        // Update pod labels to face camera
        this.updatePodLabels();

        this.renderer.render(this.scene, this.camera);
    }

    showGameOver(won) {
        this.gameState.isRoundActive = false;
        clearInterval(this.timerInterval);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${won ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)'};
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
        `;

        const message = document.createElement('div');
        message.style.cssText = `
            background: rgba(0,0,0,0.8);
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            font-family: 'Orbitron', sans-serif;
            color: white;
        `;
        
        if (won) {
            this.winSound.play();
            message.innerHTML = `
                <h2>Mission Accomplished!</h2>
                <p>You've successfully transmitted the recovery data to Earth!</p>
                <p>Earth's computational core is being restored.</p>
                <button id="returnBtn" class="action-btn">Return to Universe</button>
            `;
        } else {
            message.innerHTML = `
                <h2>Mission Failed</h2>
                <p>All escape pods were lost...</p>
                <button id="retryBtn" class="action-btn">Retry Mission</button>
                <button id="returnBtn" class="action-btn">Return to Universe</button>
            `;
        }

        overlay.appendChild(message);
        this.container.appendChild(overlay);

        // Add button handlers
        const returnBtn = document.getElementById('returnBtn');
        returnBtn.addEventListener('click', () => {
            // Hide boss battle container
            this.container.classList.add('hidden');
            
            // Show universe UI and status panel
            document.getElementById('ui-overlay').style.display = 'block';
            window.universe.statusPanel.style.display = 'block';
            
            // Resume universe BGM
            window.universe.bgm.play();
            this.bgm.pause();
            
            // Clean up boss battle
            this.clearMoveIndicators();
            if (this.situationLine) {
                this.scene.remove(this.situationLine);
                this.situationLine = null;
            }
            
            // Remove all pods
            this.gameState.pods.forEach(pod => {
                this.scene.remove(pod.mesh);
                if (pod.label) {
                    this.scene.remove(pod.label);
                }
            });
            this.gameState.pods = [];
            
            // Remove overlay
            this.container.removeChild(overlay);

            // Remove any floating messages
            const floatingMessages = document.querySelectorAll('.floating-message');
            floatingMessages.forEach(msg => msg.remove());

            // Stop the animation loop
            this.animate = () => {};
            setTimeout(()=>{this.isStarted = false;} , 1000);
        });

        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.container.removeChild(overlay);
                this.gameState.pods = [];
                // Remove any existing panels first
                const existingPanels = document.querySelectorAll('.mission-panel');
                existingPanels.forEach(panel => panel.remove());
                this.createInitialPods();
                this.startRound();
            });
        }
    }

    showFloatingMessage(text, duration = 2000) {
        const message = document.createElement('div');
        message.className = 'floating-message';  // Add class for easy cleanup
        message.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            font-family: 'Orbitron', sans-serif;
            z-index: 1002;
            pointer-events: none;
        `;
        message.textContent = text;
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, duration);
    }
}

class Pod {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        // Create pod mesh
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.3
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x*2-10, 0.3, 5-y*2);
    }

    move(dx, dy) {
        // Update position
        this.x += dx;
        this.y += dy;
        
        // Animate mesh movement
        gsap.to(this.mesh.position, {
            x: this.x*2-10,
            z: -this.y*2+5,
            duration: 0.5,
            ease: "power2.inOut"
        });
    }

    destroy() {
        // Explosion effect
        const particles = new THREE.Points(
            new THREE.BufferGeometry().setFromPoints(
                Array(20).fill().map(() => new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ))
            ),
            new THREE.PointsMaterial({
                color: 0xff0000,
                size: 0.1
            })
        );
        particles.position.copy(this.mesh.position);
        this.mesh.parent.add(particles);
       
        // Animate explosion
        gsap.to(particles.material, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                particles.parent.remove(particles);
            }
        });

        // Remove pod mesh and label
        this.mesh.parent.remove(this.mesh);
        if (this.label) {
            this.label.parent.remove(this.label);
        }
    }
}

class BossSituation {
    constructor(type, params, actionType) {
        this.type = type; // 'slope', 'equation', or 'inequality'
        this.params = params;
        this.actionType = actionType; // 'reward' or 'eliminate'
    }

    evaluate(pod) {
        switch (this.type) {
            case 'slope':
                // Check if pod lies on a line with the required slope
                return Math.abs((pod.y / pod.x) - this.params.slope) < 0.1;
            
            case 'equation':
                // Check if pod satisfies the equation ax + b = y
                return Math.abs((this.params.a * pod.x + this.params.b) - pod.y) < 0.1;
            
            case 'inequality':
                // Check if pod satisfies the inequality ax + b < y or ax + b > y
                const val = this.params.a * pod.x + this.params.b;
                return this.params.sign === '>' ? pod.y > val : pod.y < val;
        }
    }

    getDisplayText() {
        const action = this.actionType === 'reward' ? 'ADVANCE' : 'ELIMINATE';
        switch (this.type) {
            case 'slope':
                return `${action} PODS ON SLOPE ${this.params.slope}`;
            case 'equation':
                return `${action} PODS ON y = ${this.params.a}x + ${this.params.b}`;
            case 'inequality':
                return `${action} PODS WHERE y ${this.params.sign} ${this.params.a}x + ${this.params.b}`;
        }
    }
}


