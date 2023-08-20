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
        this.speedModifier = 2
        this.history = [{ x: this.x, y: this.y }];
        this.maxLength = 150
        this.timer = this.maxLength * 1.1
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
        context.strokeWidth = 2
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
        this.numOfParticles = 1000;
        this.cellSize = 10;
        this.rows;
        this.cols;
        this.flowField = [];
        this.curve = 1.68;
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

setTimeout(()=>{
    canvas.remove()
},7500)
/////end of website enter visuals
setTimeout(()=>{

    
       const imageCanvas  = document.getElementById('canvas2')
       const imageCanvasCtx = imageCanvas.getContext('2d')
       const btn = document.getElementById('btn')
   
       const image = document.getElementById('image')
      
   
       imageCanvas.width = window.innerWidth;
       imageCanvas.height = window.innerHeight;
   
   
       class imageParticle{
           constructor(effect,x,y,color){
               this.effect = effect
               this.x = (Math.random() * this.effect.width - this.effect.width / 2) * 5
               this.y = (Math.random() * this.effect.width - this.effect.width / 2) * 5
               this.originX = Math.floor(x)
               this.originY =Math.floor(y)
               this.size = 2
               this.vx = 0
               this.vy =  0
               this.color = color
               this.ease = 0.02;
               this.dx = 0
               this.dy = 0
               this.distance =0
               this.force = 0
               this.angle = 0
               this.friction = 0.45
           }
   
           draw(context){
               context.fillStyle=this.color
               context.fillRect(this.x,this.y,this.size,this.size)
           }
           update(){
               this.dx = this.effect.mouse.x - this.x
               this.dy = this.effect.mouse.y - this.y
               this.distance = this.dx * this.dx + this.dy *this.dy
               this.force = -this.effect.mouse.radius / this.distance
   
               if(this.distance <this.effect.mouse.radius ){
                   this.angle = Math.atan2(this.dy,this.dx)
                   this.vx += this.force * Math.cos(this.angle)
                   this.vy += this.force * Math.sin(this.angle)
               }
   
               this.x += (this.vx *=this.friction)  +(this.originX - this.x) * this.ease
               this.y +=  (this.vy*=this.friction ) +(this.originY - this.y)* this.ease
           }
           warp(){
               this.x = Math.random() * this.effect.width 
               this.y = Math.random() * this.effect.height
               this.ease = 0.07
           }
   
       }
   
   
   
       class imageEffect{
           constructor(width,height){
               this.width = width;
               this.height = height;
               this.amount = 100
               this.particles = [];
               this.image = document.getElementById('image');
               this.centerX = this.width * 0.5;
               this.centerY = this.height * 0.5;
               this.x = this.centerX - this.image.width * 0.5
               this.y = this.centerY - this.image.height * 0.5;
               this.gap = 3;
               this.mouse = {
                   radius:10000,
                   x:undefined,
                   y:undefined
               }
               window.addEventListener('mousemove',(e)=>{
                   this.mouse.x = e.x;
                   this.mouse.y = e.y
   
               })
   
           }
           init(imageCanvasCtx){
             imageCanvasCtx.drawImage(this.image, this.x, this.y)
               const pixels = imageCanvasCtx.getImageData(0,0,this.width,this.height).data
               for(let y = 0; y < this.height; y +=this.gap){
                   for(let x = 0; x < this.width; x +=this.gap){
                      const index = (y * this.width + x) * 4;
                      const red = pixels[index] 
                      const green = pixels[index + 1] 
                      const blue = pixels[index + 2] 
                      const alpha = pixels[index + 3] 
                      const color = `rgb(${red},${green},${blue})`
   
                      if(alpha > 0){
                       this.particles.push(new imageParticle(this,x,y,color))
                      }
                   }
               }
               
           }
           draw(imageCanvasCtx){
               this.particles.forEach(particle=>particle.draw(imageCanvasCtx));
               
               
           }
           update(){
            
               this.particles.forEach(particle=>particle.update());
           }
           warp(){
               this.particles.forEach(particle=>particle.warp());
           }
   
       }
       const imageEffectInstance = new imageEffect(imageCanvas.width,imageCanvas.height);
       
       imageEffectInstance.init(imageCanvasCtx)
       imageEffectInstance.draw(imageCanvasCtx);
       imageEffectInstance.update()
       
      
   
       function animate(){
           imageCanvasCtx.clearRect(0,0,imageCanvas.width,imageCanvas.height)
           imageEffectInstance.draw(imageCanvasCtx);
           imageEffectInstance.update()
           requestAnimationFrame(animate)
       }
       animate()
   
       btn.addEventListener('click',function(){
           imageEffectInstance.warp()
   
       })
       document.querySelector('.main-heading').textContent='Hello I am Different Web Developer'
   
       
   
   
   
    
},7501)
 
