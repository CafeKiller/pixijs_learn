const app = new PIXI.Application();


(async () => {
    await app.init({ background: '#021f4b', resizeTo: window });
    document.body.appendChild(app.canvas);

    await addStars(app);

    await addMoon(app);
})();


function addStars(app) {

    const starNumber = 100;
    const graphics = new PIXI.Graphics();

    for (let idx = 0; idx < starNumber; idx++) {

        // 随机坐标，随机大小，随机旋转角度
        const x = (idx * (Math.random()*3) * app.screen.width) % app.screen.width;
        const y = (idx * (Math.random()*3) * app.screen.height) % app.screen.height;
        const radius = 2 + Math.random() * 3;
        const rotation = Math.random() * Math.PI * 2;

        graphics.star(x, y, radius, radius * 0.5, 5, rotation);
        graphics.fill(0xffdf00);
        graphics.alpha = 0.5;
    }

    app.stage.addChild(graphics);
}


async function addMoon(app) {

    // 1. 使用 fetch 加载 SVG 文件
    const response = await fetch('./svg/moon.svg');  
    console.log(response);
      
    const svgText = await response.text();

    const graphics = new PIXI.Graphics().svg(svgText);

    graphics.x = app.screen.width / 2 + 100;
    graphics.y = app.screen.height / 8;
    app.stage.addChild(graphics);

}