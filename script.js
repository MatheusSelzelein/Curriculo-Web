const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let arrayParticula;

//posiçao do mouse

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80),

}

window.addEventListener('mousemove' ,
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

//criando a particula

class Particula {
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    //metodo para desenhar uma particula individual
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#20135c';
        ctx.fill();
    }

    //verifica a posição da particula, verifica a posição do mouse, move a particula
    //e desenha a particula
    update() {
        //verifica se a particula ainda esta no canvas
        if(this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        //verifica a detecção da colisao - posição do mouse e posição da particula
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < mouse.radius + this.size) {
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if(mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if(mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if(mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }

        //move a particula
        this.x += this.directionX;
        this.y += this.directionY;

        //desenha a particula
        this.draw();

    }
}

//cria o array da particula
function init() {
    arrayParticula = [];
    let numerodeParticulas = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numerodeParticulas*2; i++) {
        let size = (Math.random() * 5) +1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#20135c';

        arrayParticula.push(new Particula(x, y, directionX, directionY, size, color));
    }
}

//verifica se as particulas estao perto uma da outra 
function conexao() {
    let opacityValue = 1;
    for (let a = 0; a < arrayParticula.length; a++) {
        for (let b = a; b < arrayParticula.length; b++) {
            let distance = ((arrayParticula[a].x - arrayParticula[b].x) * (arrayParticula[a].x - arrayParticula[b].x)) + 
            ((arrayParticula[a].y - arrayParticula[b].y) * (arrayParticula[a].y - arrayParticula[b].y));
            if(distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(32, 19, 92,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(arrayParticula[a].x, arrayParticula[a].y);
                ctx.lineTo(arrayParticula[b].x, arrayParticula[b].y);
                ctx.stroke();
            }
            
        }
    }
}

//loop da animação
function animacao() {
    requestAnimationFrame(animacao);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < arrayParticula.length; i++) {
        arrayParticula[i]. update(); 
    }
    conexao();
}

// faz um evento de redimensionamento
window.addEventListener('resize',
    function() {
        canvas.width = innerWidth;
        canvas.height = innerWidth;
        mouse.radius = ((canvas.height/80) * (canvas.width/80));
        init();
    }
);

//evento de saida do mouse
window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }
);


init();
animacao();



