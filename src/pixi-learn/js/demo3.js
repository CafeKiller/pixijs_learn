const app = new PIXI.Application();

// HEX值 转换为 16进制 Number
const hexToNumber = (hexStr) => Number('0X' + hexStr.replace(/^#/, '').toUpperCase());

(async () => {
    await app.init({ background: '#021f4b', resizeTo: window });
    document.body.appendChild(app.canvas);

    await addStars(app, 300);

    await addMoon(app);

    addMountains(app);
})();


function addStars(app, starNumber = 100) {
    const container = new PIXI.Container(); // 改用容器存放星星
    
    for (let idx = 0; idx < starNumber; idx++) {
        const graphics = new PIXI.Graphics(); // 每个星星单独的图形对象
        
        // 随机坐标，随机大小，随机旋转角度
        const x = (idx * (Math.random()*3) * app.screen.width) % app.screen.width;
        const y = (idx * (Math.random()*3) * app.screen.height) % app.screen.height;
        const radius = 2 + Math.random() * 3;
        const rotation = Math.random() * Math.PI * 2;

        graphics.star(x, y, radius, radius * 0.5, 5, rotation);
        graphics.fill(0xffdf00);
        graphics.alpha = 0.3 + Math.random() * 0.2; // 初始随机透明度
        
        // 添加动画参数
        graphics.speed = 0.003 + Math.random() * 0.003; // 随机闪烁速度
        
        graphics.baseAlpha = graphics.alpha;          // 存储基准透明度
        
        container.addChild(graphics);
    }

    // 添加动画更新
    app.ticker.add((time) => {
        for (const star of container.children) {
            // 使用正弦波实现平滑闪烁
            star.alpha = star.baseAlpha + Math.sin(time.lastTime * star.speed) * 0.2;
        }
    });

    app.stage.addChild(container);
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

function addMountains(app) {
    const group1 = createMountainGroup(app);
    const group2 = createMountainGroup(app);

    group2.x = app.screen.width;
    app.stage.addChild(group1, group2);

    app.ticker.add((time) => {
        const dx = time.deltaTime * 1;

        group1.x -= dx;
        group2.x -= dx;

        if(group1.x <= -app.screen.width) {
            group1.x += app.screen.width * 2;
        }
        if(group2.x <= -app.screen.width) {
            group2.x += app.screen.width * 2;
        }
    })
}

// 创建三层山脉
function createMountainGroup(app) {
    const graphics = new PIXI.Graphics();

    const width = app.screen.width / 2;
    const startY = app.screen.height;
    
    // 三个山脉的起始 X 坐标
    const startXLeft = 0;
    const startXMiddle = Number(app.screen.width) / 4;
    const startXRight = app.screen.width / 2;

    // 三个山脉的高度
    const heigthLeft = app.screen.height / 2;
    const heigthMiddle = (app.screen.height * 4) / 5;
    const heigthRight = (app.screen.height * 2) / 3;

    // 色彩
    const colorLeft = hexToNumber("#C1C0C2");
    const colorMiddle = hexToNumber("#7E818F");
    const colorRight = hexToNumber("#8C919F");

    // 绘制中间山脉
    graphics.moveTo(startXMiddle, startY)
            .bezierCurveTo(
                startXMiddle + width / 2,
                startY - heigthMiddle,
                startXMiddle + width / 2,
                startY - heigthMiddle,
                startXMiddle + width,
                startY
            )
            .fill({ color: colorMiddle })
            // 绘制左侧山脉
            .moveTo(startXLeft, startY)
            .bezierCurveTo(
                startXLeft + width / 2,
                startY - heigthLeft,
                startXLeft + width / 2,
                startY - heigthLeft,
                startXLeft + width,
                startY
            )
            .fill({ color: colorLeft })
            // 绘制右侧山脉
            .moveTo(startXRight, startY)
            .bezierCurveTo(
                startXRight + width / 2,
                startY - heigthRight,
                startXRight + width / 2,
                startY - heigthRight,
                startXRight + width,
                startY
            )
            .fill({ color: colorRight });

    return graphics;
}