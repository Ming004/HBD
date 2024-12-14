const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const fireworks = [];

// Particle Class
class Particle {
    constructor(x, y, color, size, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= 0.99; // Slow down horizontally (friction)
        this.velocity.y *= 0.99; // Slow down vertically (friction)
        this.velocity.y += 0.1;   // Gravity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;       // Fade out
    }
}

// Firework Class
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random hue
        this.firework = new Particle(x, y, this.color, 5, { x: 0, y: -Math.random() * 5 - 10 }); // Initial upward velocity
        this.exploded = false;
        this.particles = [];
        this.showMessage = false; // Flag to show the message
    }

    update() {
        if (!this.exploded) {
            this.firework.update();
            if (this.firework.velocity.y >= 0) {
                this.exploded = true;
                this.explode();
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Display the message if the firework has exploded
        if (this.exploded && this.showMessage) {
            this.displayMessage();
        }
    }

    explode() {
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2) / particleCount * i;
            const power = Math.random() * 5 + 2; // Random explosion strength
            const velocity = {
                x: Math.cos(angle) * power,
                y: Math.sin(angle) * power
            };
            this.particles.push(new Particle(this.x, this.y, this.color, 2, velocity));
        }

        // Enable the message to be shown
        this.showMessage = true;
    }

    displayMessage() {
        ctx.save();
        ctx.font = '40px Arial'; // Set font size and style
        ctx.fillStyle = this.color; // Use the firework's color
        ctx.textAlign = 'center'; // Center the text
        ctx.fillText('Happy Birthday Rowena', this.x, this.y); // Draw the message
        ctx.restore();
    }
}

// Animation Loop
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Trail effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        if (fireworks[i].particles.length === 0 && fireworks[i].exploded) {
            fireworks.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Create Fireworks on Click
canvas.addEventListener('click', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    fireworks.push(new Firework(x, y));
});

// Create Random Fireworks for Birthday Effect
function createRandomFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2; // Start in the upper half
    fireworks.push(new Firework(x, y));
}

setInterval(createRandomFirework, 500); // Create a new firework every 500ms

animate(); // Start the animation