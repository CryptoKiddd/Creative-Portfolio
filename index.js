const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


ctx.fillStyle = 'white';
ctx.strokeStyle = 'white'

class Particle {
    constructor(effect) {
        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.speedX;
        this.speedY;
        this.speedModifier = 1
        this.history = [{ x: this.x, y: this.y }];
        this.maxLength = Math.floor(Math.random() * 220 - 10);
        this.timer = this.maxLength * 2
        this.angle = 0;
        this.colors=['#7E1AF0',"#F01AE5"]
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]


    }
    draw(context) {

        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y)
        }
        context.strokeStyle = this.color
        context.stroke()

    }
    update() {
        this.timer--
        if (this.timer >= 1) {

            let x = Math.floor(this.x / this.effect.cellSize)
            let y = Math.floor(this.y / this.effect.cellSize)
            let index = y * this.effect.cols + x;
            this.angle = this.effect.flowField[index]

            this.speedX = Math.cos(this.angle)
            this.speedY = Math.sin(this.angle)

            this.x += this.speedX * this.speedModifier
            this.y += this.speedY * this.speedModifier

            this.history.push({ x: this.x, y: this.y })
            if (this.history.length > this.maxLength) {
                this.history.shift()
            }
        } else if (this.history.length > 1) {
            this.history.shift()
        } else {
            this.reset()
        }
    }
    reset() {
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.history = [{ x: this.x, y: this.y }];
        this.timer = this.timer = this.maxLength * 2
    }


}
class Effect {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.particles = [];
        this.numOfParticles = 2000;
        this.cellSize = 10;
        this.rows;
        this.cols;
        this.flowField = [];
        this.curve = 2;
        this.zoom = 0.08;
        this.debug = false;
        this.init();
        window.addEventListener('keydown',e=>{
            if(e.key ==='d'){
                this.debug = !this.debug
            }
        })


    }
    init() {
        //flow field
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);
        this.flowField = []
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
                this.flowField.push(angle)
            }
        }
        console.log(this.flowField)
        //creating particles
        for (let i = 0; i < this.numOfParticles; i++) {
            this.particles.push(new Particle(this))
        }

    }
    drawGrid(context) {
        context.save()
        context.strokeStyle = 'red'
        for (let c = 0; c < this.cols; c++) {
            context.beginPath()
            context.moveTo(this.cellSize * c, 0);
            context.lineTo(this.cellSize * c, this.height)
            context.stroke()
        }
        for (let r = 0; r < this.rows; r++) {
            context.beginPath()
            context.moveTo(0,this.cellSize * r);
            context.lineTo(this.width ,this.cellSize * r)
            context.stroke()
        }
        context.restore()
    }
    render(ctx) {
        if(this.debug){

            this.drawGrid(ctx)
        }
        this.particles.forEach(particle => {
            particle.draw(ctx);
            particle.update();
        })
    }

}

const effect = new Effect(canvas.width, canvas.height);


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.render(ctx);
    requestAnimationFrame(animate)
}
animate()
