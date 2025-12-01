let colors = [
    [50, 20, 80],   // violet
    [70, 25, 120],  // purple
    [90, 40, 150],  // light purple
    [110, 50, 180], // soft blue
    [130, 70, 200], // bright blue
    [150, 90, 220], // pinkish
    [80, 100, 150], // teal
    [30, 50, 100]   // deep cyan
];

let step = 0;
let colorIndices = [0, 1, 2, 3];
let gradientSpeed = 0.003;

function updateGradient() {
    if (!document.body) return;

    let c0_0 = colors[colorIndices[0]];
    let c0_1 = colors[colorIndices[1]];
    let c1_0 = colors[colorIndices[2]];
    let c1_1 = colors[colorIndices[3]];

    let istep = 1 - step;
    let r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    let g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    let b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    let color1 = `rgb(${r1},${g1},${b1})`;

    let r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    let g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    let b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    let color2 = `rgb(${r2},${g2},${b2})`;

    // Apply gradient to body
    document.body.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;

    // Header, button, and bot messages
    const header = document.querySelector('.top-bar');
    const btn = document.querySelector('.chat-input-wrapper button');
    const botMessages = document.querySelectorAll('.bot-message');

    if(header) header.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
    if(btn) btn.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
    botMessages.forEach(msg => msg.style.background = `linear-gradient(135deg, ${color1}, ${color2})`);

    step += gradientSpeed;
    if (step >= 1) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
    }
}

setInterval(updateGradient, 10);
