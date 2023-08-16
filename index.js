const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


ctx.fillStyle = 'white';
ctx.strokeStyle = 'white'

class Particle{
    constructor(effect){
        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.speedX = Math.random() *5 -2.5
        this.speedY = Math.random()  *5 -2.5
        this.history = [ {x:this.x, y:this.y}];
        this.maxLength = 60;
        this.angle = 0 


    }
    draw(context){
        context.fillRect(this.x,this.y,5,5);
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length;i++){
            context.lineTo(this.history[i].x, this.history[i].y)
        }
        context.stroke()

    }
    update(){
        this.angle += 0.5
        this.x += this.speedX + Math.sin(this.angle)
        this.y += this.speedY +  Math.cos(this.angle)
        this.history.push({x:this.x,y:this.y})
        if(this.history.length > this.maxLength){
            this.history.shift()
        }
    }


}
class Effect{
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.particles = [];
        this.numOfParticles = 50;
        this.init()


    }
    init(){
        for (let i = 0; i < this.numOfParticles;i++){
            this.particles.push(new Particle(this))
        }

    }
    render(ctx){
        this.particles.forEach(particle=>{
            particle.draw(ctx);
            particle.update();
        })
    }

}

const effect = new Effect(canvas.width,canvas.height);


function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    effect.render(ctx);
    requestAnimationFrame(animate)
}
animate()
