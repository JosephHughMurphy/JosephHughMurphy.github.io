// Huge thanks to FrankDovrak for his online course 

// Event listener - load event makes sure all website is fully loaded befo js code
window.addEventListener('load', function(){
    // points at id in html file
    const canvas = document.getElementById('canvas2');
    // passses a contexts in a html file. picks a 2d file to ensure it can load
    const ctx = canvas.getContext('2d'); 
    // convert the canvas to a different height
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;    

    // particle system - blueprint to handle individual particles
    class Particle { 
        constructor(effect,x ,y, color){
            this.effect = effect;
            // values set to ensure specific start point. All particles are at a set point x left to right y top to bot
            this.x = Math.random() * this.effect.width;
            this.y = 0;
            // remember where the particle sits  -math.floor rounds the vlaue down ans optimised speed
            this.originX = Math.floor(x); 
            this.originY = Math.floor(y);
            this.color = color;
            // particle sizing - -1 makes it that there is always a gap 
            this.size = this.effect.gap - 0.1;
            // canvas faster at drawing rectangles than circsa
            
            // velocity values
            this.vx = 0.5;
            this.vy = 0.5;
            // creates the image slowly
            this.ease = 0.02;
            this.dx = 0;
            this.dy = 0;
            this.friction = 0.4;
            this.distance = 0;
            this.force = 0;
            // angle particles pushed away
            this.angle = 0;

        }
        // take properties from class const and draw each particle items from that sector
        draw(context){
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.size, this.size);
        }
        update(){
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            // pythag - but remove sqrt as intensive op
            this.distance = (this.dx * this.dx + this.dy*this.dy)
            this.force = -this.effect.mouse.radius/this.distance;

            if(this.distance < this.effect.mouse.radius){
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }

            this.x += (this.vx *= this.friction) + (this.originX - this.x)* this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y)* this.ease;
    
        }
        warp(){
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.ease = 0.02;
        }
    }

    // handle all particles at the same time 
    class Effect { 
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.particlesArray = [];
            this.image = document.getElementById('image1');
            this.centerX = this.width * 0.25;
            this.centerY = this.height * 0.1;
            this.x = this.centerX - this.image.width * 1;
            this.y = this.centerY - this.image.height * 0.5;
            // size of particle pixels that make the image
            this.gap = 1;
            this.mouse = { 
                radius: 500, 
                x: undefined,
                y: undefined
            }
            // bind the properties 
            window.addEventListener ('mousemove', event => {
                this.mouse.x = event.x;
                this.mouse.y = event.y;
            }) 

        }
        init(context){
            //  this section creates random particles
            // for(let i = 0; i < 100; i++){
            //     this.particlesArray.push(new Particle(this));
            // }

            // draw image on canvas
            context.drawImage(this.image, this.x, this.y);

            // temp helper variable  -gets the image data
            const pixels = context.getImageData(0, 0, this.width, this.height).data;
            for(let y = 0; y < this.height; y += this.gap){
                for(let x = 0; x < this.width; x += this.gap){
                    // *4 to give values from array of rgb and alpha
                    const index = (y * this.width + x) * 4;
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2]; 
                    const alpha = pixels[index + 3];
                    const color = 'rgb('+ red + ',' + green + ',' + blue + ')'
                    // Ignore the alpha particles
                    if (alpha > 0 ){ 
                        this.particlesArray.push(new Particle(this, x, y, color));
                    }
                }
            }

        }
        draw(context){
            this.particlesArray.forEach(particle => particle.draw(context));
            // center the image
            
            
        }
        update(){
            this.particlesArray.forEach(particle => particle.update());
            
        }
        warp(){ 
            this.particlesArray.forEach(particle => particle.warp());
        }
    }

    const effect = new Effect(canvas.width, canvas.height);
    effect.init(ctx);

    
    // Create instance of the class
    

    // to make it all interactive and animated
    function animate(){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        effect.draw(ctx);
        effect.update();
        requestAnimationFrame(animate);
    }

    // gives location of the position and canvas - co-ordinates (x,y,height, width)
    // ctx.fillRect(100, 100, 100, 200)
    // draws the image - image, xpos , ypos, height, width
    // ctx.drawImage(image1, 100, 100, 100, 200);

    animate();


    //  this - console.log(ctx); can be used to inspect the consol

    // warp buttong
    // const warpButton = document.getElementById('warpButton');
    // warpButton.addEventListener('click', function(){
    //     effect.warp();
    // });

}
)