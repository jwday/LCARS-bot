const canvas = require('canvas');
const colorsLCARS = ['#FFCC99', '#CC99CC', '#9999CC']
const randColor = colorsLCARS[Math.floor(Math.random() * colorsLCARS.length)];

canvas.registerFont(`misc/swiss-911-ultra-compressed-bt.ttf`, { family: 'Swiss911' });

// Here we'll create an LCARS-like object to display with the embed
function LCARSbuttongenerator (messageID) {
    const c = canvas.createCanvas(150, 450);
    const ctx = c.getContext('2d');

    var W = c.width;
    var H = c.height;
    // Slotted wide rounded circle with black text
    function buttonSty1() {
        // console.log('style 1')
        ctx.beginPath();
        ctx.arc(W/2, W/2, W/2, 0, Math.PI, true);
        ctx.lineTo(0, 0.75*W, 0);
        ctx.lineTo(W, 0.75*W, 0);
        ctx.lineTo(W, W/2, 0);
        ctx.closePath();
        ctx.fillStyle = randColor;
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, 1.125*W);
        ctx.lineTo(0, H-W/2);
        ctx.arc(W/2, H-W/2, W/2, Math.PI, 0, true);
        ctx.lineTo(W, 1.125*W);
        ctx.closePath();
        ctx.fillStyle = randColor;
        ctx.fill();
        ctx.stroke();
        ctx.save();
        
        ctx.rotate(90*Math.PI/180);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.font = `${W}px Swiss911`;
        ctx.fillText(`SB${messageID.slice(-2)}`, 65*H/100, -W/8);

        return ctx;
    }

    // Wide-slotted rounded circle surrounding colored text
    function buttonSty2() {
        // console.log('style 2')
        ctx.beginPath();
        ctx.arc(W/2, W/2, W/2, 0, Math.PI, true);
        ctx.lineTo(0, 0.55*W, 0);
        ctx.lineTo(W, 0.55*W, 0);
        ctx.lineTo(W, W/2, 0);
        ctx.closePath();
        ctx.fillStyle = randColor;
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, H-0.55*W);
        ctx.lineTo(0, H-W/2);
        ctx.arc(W/2, H-W/2, W/2, Math.PI, 0, true);
        ctx.lineTo(W, H-0.55*W);
        ctx.closePath();
        ctx.fillStyle = randColor;
        ctx.fill();
        ctx.stroke();
        ctx.save();
        
        ctx.rotate(90*Math.PI/180);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFCC99';
        ctx.font = `${1.2*W}px Swiss911`;
        ctx.fillText(`SB${messageID.slice(-2)}`, 50*H/100, -W/15);

        return ctx;
    }

    const buttonStys = [buttonSty2, buttonSty1]
    const randNum = Math.random()
    const select = Math.floor(randNum * buttonStys.length)
    image = buttonStys[select]();

    return image.canvas.toBuffer();
}

module.exports = LCARSbuttongenerator;