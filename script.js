const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let arrayParticula = [];
let quadroAnimacao;

const mouse = {
    x: null,
    y: null,
    radius: 120
};

function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = Math.min(150, Math.max(70, (canvas.height / 80) * (canvas.width / 80)));
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particula {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 5;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 5;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 5;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 5;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    arrayParticula = [];
    const numeroDeParticulas = Math.min(150, Math.floor((canvas.height * canvas.width) / 9000));

    for (let i = 0; i < numeroDeParticulas*4; i++) {
        const size = Math.random() * 4 + 1;
        const x = Math.random() * (canvas.width - size * 4) + size * 2;
        const y = Math.random() * (canvas.height - size * 4) + size * 2;
        const directionX = Math.random() * 1.4 - 0.7;
        const directionY = Math.random() * 1.4 - 0.7;
        arrayParticula.push(new Particula(x, y, directionX, directionY, size, '#20135c'));
    }
}

function conexao() {
    for (let a = 0; a < arrayParticula.length; a++) {
        for (let b = a + 1; b < arrayParticula.length; b++) {
            const dx = arrayParticula[a].x - arrayParticula[b].x;
            const dy = arrayParticula[a].y - arrayParticula[b].y;
            const distance = dx * dx + dy * dy;
            const limite = 14000;

            if (distance < limite) {
                const opacityValue = Math.max(0, 1 - distance / limite) * 0.55;
                ctx.strokeStyle = `rgba(32, 19, 92, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(arrayParticula[a].x, arrayParticula[a].y);
                ctx.lineTo(arrayParticula[b].x, arrayParticula[b].y);
                ctx.stroke();
            }
        }
    }
}

function animacao() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arrayParticula.forEach((particula) => particula.update());
    conexao();
    quadroAnimacao = requestAnimationFrame(animacao);
}

let atrasoRedimensionamento;
window.addEventListener('resize', () => {
    clearTimeout(atrasoRedimensionamento);
    atrasoRedimensionamento = setTimeout(() => {
        ajustarCanvas();
        init();
    }, 120);
});

const navegacao = document.querySelector('.navegacao');
const menu = document.querySelector('.menu');
const menuBotao = document.querySelector('.menu-botao');
const menuLinks = [...document.querySelectorAll('.menu-link')];

function fecharMenu() {
    menu.classList.remove('aberto');
    menuBotao.setAttribute('aria-expanded', 'false');
    menuBotao.setAttribute('aria-label', 'Abrir menu');
}

menuBotao.addEventListener('click', () => {
    const aberto = menuBotao.getAttribute('aria-expanded') === 'true';
    menu.classList.toggle('aberto', !aberto);
    menuBotao.setAttribute('aria-expanded', String(!aberto));
    menuBotao.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
});

menuLinks.forEach((link) => link.addEventListener('click', fecharMenu));

document.addEventListener('click', (event) => {
    if (!navegacao.contains(event.target)) fecharMenu();
});

window.addEventListener('scroll', () => {
    navegacao.classList.toggle('rolada', window.scrollY > 20);
}, { passive: true });

const secoes = [...document.querySelectorAll('#inicio, .secao-observada')];
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        menuLinks.forEach((link) => {
            link.classList.toggle('ativo', link.getAttribute('href') === `#${entrada.target.id}`);
        });
    });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });

secoes.forEach((secao) => observador.observe(secao));

function enviarWhats(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    const telefone = '5541999642906';
    const texto = `Olá! Me chamo ${nome}. ${mensagem}`;
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

ajustarCanvas();
init();

if (reduzirMovimento) {
    arrayParticula.forEach((particula) => particula.draw());
    conexao();
} else {
    animacao();
}

window.addEventListener('beforeunload', () => cancelAnimationFrame(quadroAnimacao));
