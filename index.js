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


    }
    draw(context){
        context.fillRect(this.x,this.y,10,10)

    }


}
class Effect{
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.particles = [];
        this.numOfParticles = 50


    }
    init(){
        for (let i = 0; i < this.numOfParticles;i++){
            this.particles.push(new Particle(this))
        }

    }
    render(ctx){
        this.particles.forEach(particle=>{
            particle.draw(ctx)
        })
    }

}

const effect = new Effect(canvas.width,canvas.height);
effect.init();
effect.render(ctx)
console.log(effect)