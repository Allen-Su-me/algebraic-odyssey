class SpaceshipInterface {
    constructor() {
        this.interface = document.getElementById('spaceship-interface');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelector('.close-btn').addEventListener('click', () => this.leave());
        document.getElementById('submit-answer').addEventListener('click', () => this.checkAnswer());
    }

    show(lessonKey) {
        const lesson = LESSONS[lessonKey];
        if (!lesson) return;

        this.currentLesson = lesson;
        this.interface.classList.remove('hidden');
        
        document.querySelector('.lesson-title').textContent = lesson.title;
        document.querySelector('.mission-brief').innerHTML = `<h3>Mission Brief</h3><p>${lesson.mission}</p>`;
        document.querySelector('.concept-explanation').innerHTML = `<h3>Navigation Computer</h3><p>${lesson.concept}</p>`;
        document.querySelector('.problem-section').innerHTML = `
            <h3>Space Challenge</h3>
            <p class="problem-text">${lesson.problem.question}</p>
        `;
        lesson.problem.plotFunction(Plotly);
    }

    hide() {
        this.interface.classList.add('hidden');
    }

    leave(){
        this.interface.classList.add('hidden');
        window.universe.statusPanel.style.display = 'block';
        window.universe.playBgm();
    }

    checkAnswer() {
        const input = document.getElementById('answer-input').value;
        //const correct = this.currentLesson.problem.tolerance===0?input===this.currentLesson.problem.answer:Math.abs(parseFloat(input) - parseFloat(this.currentLesson.problem.answer)) <= this.currentLesson.problem.tolerance;
        const correct = this.currentLesson.problem.tolerance===0
        ? this.currentLesson.problem.answer.includes(input)
        : Math.abs(parseFloat(input) - parseFloat(this.currentLesson.problem.answer)) <= this.currentLesson.problem.tolerance;
        
        if (correct) {
            this.hide();
            window.wormholeChallenge.showChallenge(this.currentLesson);
        } else {
            alert('Mission Failed. Check your calculations and try again.');
        }
    }

    returnToUniverse() {
            
        const topicInfo = document.getElementById('topic-info');
        topicInfo.textContent = '';
        window.universe.statusPanel.style.display = 'block';
        window.universe.playBgm();
    }
}

window.spaceshipInterface = new SpaceshipInterface();
