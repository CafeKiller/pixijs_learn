const app = new PIXI.Application();
const trainContainer = new PIXI.Container();

// HEX值 转换为 16进制 Number
const hexToNumber = (hexStr) => Number('0X' + hexStr.replace(/^#/, '').toUpperCase());


(async () => {
    await app.init({ background: '#021f4b', resizeTo: window });
    document.body.appendChild(app.canvas);

    await addStars(app, 300);

    await addMoon(app);

    addMountains(app);

    addTree(app);

    addGroup(app);

    createTrain(app, trainContainer);

    addSmokes(app, trainContainer);
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

// 添加山脉
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
    });
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

// 添加树木
function addTree(app) {
    const treeWidth = 200;
    const y = app.screen.height - 20;
    const spacing = 15;
    const count = app.screen.width / (treeWidth + spacing) + 1;
    const trees = new Array;

    for (let _idx = 0; _idx < count; _idx++) {
        const treeHeight = 225 + Math.random() * 50;
        const tree = createTree(treeWidth, treeHeight);

        tree.x = _idx * (treeWidth + spacing);
        tree.y = y;

        app.stage.addChild(tree);
        trees.push(tree);
    }

    app.ticker.add((time) => {
        const dx = time.deltaTime * 3;
        trees.forEach( (tree) => {
            tree.x -= dx;
            if(tree.x <= -(treeWidth/2 + spacing)) {
                tree.x += count * (treeWidth + spacing) + spacing * 3;
            }
        });
    });
}

// 创建树木
function createTree(width, height) {
    const trunkWidth = 30;
    const trunkHeight = height / 4;
    const trunkColor = hexToNumber("#6a9752");

    const graphics = new PIXI.Graphics()
        .rect( -trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight )
        .fill({ color: trunkColor }); 

    const crownHeight = height - trunkHeight;
    const crownLevels = 4;
    const crownLevelHeight = crownHeight / crownLevels;
    const crownWidthIncrement = width / crownLevels;
    const crownColor = hexToNumber("#264d3d");

    for(let _idx = 0; _idx < crownLevels; _idx++) {
        const y = -trunkHeight - crownLevelHeight * _idx;
        const levelWidth = width - crownWidthIncrement * _idx;
        const offset = (_idx < crownLevels - 1) ? (crownLevelHeight/2) : 0;

        graphics.moveTo(-levelWidth/2, y)
                .lineTo(0, y - crownLevelHeight - offset)
                .lineTo(levelWidth/2, y)
                .fill({ color: crownColor });        
    }

    return graphics;
}

// 
function addGroup(app) {
    const width = app.screen.width;
    const groupHeight = 20;
    const groupY = app.screen.height;
    
    const group = new PIXI.Graphics()
                    .rect(0, groupY - groupHeight, width, groupHeight)
                    .fill({ color: hexToNumber("#DDDDDD") })

    app.stage.addChild(group);

    const trackHeight = 15;
    const plankWidth = 50;
    const plankHeight = trackHeight / 2;
    const plankGap = 20;
    const plankCount = width / (plankWidth + plankGap) + 1;
    const plankY = groupY - groupHeight;
    const planks = new Array();

    for (let _idx = 0; _idx < plankCount; _idx++) {
        const plank = new PIXI.Graphics()
                        .rect(0, plankY - plankHeight, plankWidth, plankHeight)
                        .fill({ color: hexToNumber("#241811") })

        plank.x = _idx * (plankWidth + plankGap);
        app.stage.addChild(plank);
        planks.push(plank);                        
    }

    app.ticker.add((time)=> {
        const dx = time.deltaTime * 6;
        planks.forEach((plank)=> {
            plank.x -= dx;
            if(plank.x <= -(plankWidth + plankGap)) {
                plank.x += plankCount * (plankWidth + plankGap) + plankGap * 1.5;
            }
        })
    })

    const railHeight = trackHeight / 2;
    const railY = plankY - plankHeight;
    const rail = new PIXI.Graphics()
                    .rect(0, railY - railHeight, width, railHeight)
                    .fill({ color: hexToNumber("#5c5c5c") })

    app.stage.addChild(rail);                    
}

function createTrain(app, container) {
    const scale = 0.75;
    const head = createTrainHead(app);
    const carriage = createTarinCarriage(app);
    
    carriage.x = -carriage.width;

    container.addChild(head, carriage);
    app.stage.addChild(container);

    container.scale.set(scale);
    container.x = app.screen.width / 2 - head.width / 2;

    let elapsed = 0;
    const shakeDistance = 3;
    const baseY = app.screen.height - 35 - 55 * scale;
    const speed = 0.5;

    trainContainer.y = baseY;

    app.ticker.add((time) => {
        elapsed += time.deltaTime;
        const offset = (Math.sin(elapsed * 0.5 * speed) * 0.5 + 0.5) * shakeDistance;
        container.y = baseY + offset;
    })
}

function createTrainHead(app) {

    const container = new PIXI.Container();

    const frontHeight = 100;
    const frontWidth = 140;
    const frontRadius = frontHeight / 2;

    const cabinHeight = 200;
    const cabinWidth = 150;
    const cabinRadius = 15;

    const chimneyBaseWidth = 30;
    const chimneyTopWidth = 50;
    const chimneyHeight = 70;
    const chimneyDomeHeight = 25;
    const chimneyTopOffset = (chimneyTopWidth - chimneyBaseWidth) / 2;
    const chimneyStartX = cabinWidth + frontWidth - frontRadius - chimneyBaseWidth;
    const chimneyStartY = -frontHeight;

    const roofHeight = 25;
    const roofExcess = 20;

    const doorWidth = cabinWidth * 0.7;
    const doorHeight = cabinHeight * 0.7;
    const doorStartX = (cabinWidth - doorWidth) * 0.5;
    const doorStartY = -(cabinHeight - doorHeight) * 0.5  - doorHeight;

    const windowWidth = doorWidth * 0.8;
    const windowHeight = doorHeight * 0.4;
    const offset = (doorWidth - windowWidth) / 2;

    const graphics = new PIXI.Graphics()
        .moveTo(chimneyStartX, chimneyStartY)
        .lineTo(
            chimneyStartX - chimneyTopOffset, 
            chimneyStartY - chimneyHeight + chimneyDomeHeight
        )
        .quadraticCurveTo(
            chimneyStartX + chimneyBaseWidth / 2,
            chimneyStartY - chimneyHeight - chimneyDomeHeight,
            chimneyStartX + chimneyBaseWidth + chimneyTopOffset,
            chimneyStartY - chimneyHeight + chimneyDomeHeight
        )
        .lineTo(chimneyStartX + chimneyBaseWidth, chimneyStartY)
        .fill({ color: hexToNumber("#121212") })
        .roundRect(
            cabinWidth - frontRadius - cabinRadius,
            -frontHeight,
            frontWidth + frontRadius + cabinRadius,
            frontHeight,
            frontRadius
        )
        .fill( { color: hexToNumber("#7f3333") } )
        .roundRect(
            0, 
            -cabinHeight, 
            cabinWidth, 
            cabinHeight, 
            cabinRadius
        )
        .fill({ color: hexToNumber("#725f19") })
        .rect(
            -roofExcess / 2,
            cabinRadius - cabinHeight - roofHeight,
            cabinWidth + roofExcess,
            roofHeight
        )
        .fill({ color: hexToNumber("#52431C") })
        .roundRect(
            doorStartX, 
            doorStartY,
            doorWidth,
            doorHeight,
            cabinRadius
        )
        .stroke({ color: hexToNumber("#52431C"), width: 3 })
        .roundRect(
            doorStartX + offset, 
            doorStartY + offset,
            windowWidth,
            windowHeight,
            10
        )
        .fill({ color: hexToNumber("#848484") });

    const bigWheelRadius = 55;
    const smallWheelRadius = 35;
    const wheelGap = 5;
    const wheelOffsetY = 5;

    const backWheel = createTrainWheel(bigWheelRadius);
    const midWheel = createTrainWheel(smallWheelRadius);
    const frontWhell = createTrainWheel(smallWheelRadius);

    backWheel.x = bigWheelRadius;
    backWheel.y = wheelOffsetY;
    midWheel.x = backWheel.x + bigWheelRadius + smallWheelRadius + wheelGap;
    midWheel.y = backWheel.y + bigWheelRadius - smallWheelRadius;
    frontWhell.x = midWheel.x + smallWheelRadius * 2 + wheelGap;
    frontWhell.y = midWheel.y;

    container.addChild(graphics, backWheel, midWheel, frontWhell);
    
    app.ticker.add((time) => {        
        const dr = time.deltaTime * 0.15;

        backWheel.rotation += dr * (smallWheelRadius / bigWheelRadius);
        midWheel.rotation += dr;
        frontWhell.rotation += dr;
    })

    return container;
}

function createTarinCarriage(app) {
    const container = new PIXI.Container();

    const containerHeight = 125;
    const containerWidth = 200;
    const containerRaduis = 15;
    const edgeHeight = 25;
    const edgeExcess = 20;
    const connectorWidth = 30;
    const connectorHeight = 10;
    const connectorGap = 10;
    const connectorOffsetY = 20;

    const graphics = new PIXI.Graphics()
        .roundRect(
            edgeExcess / 2,
            -containerHeight,
            containerWidth,
            containerHeight,
            containerRaduis,
        )
        .fill({ color: hexToNumber("#725F19") })
        .rect(
            0,
            containerRaduis,
            -connectorHeight - edgeHeight,
            connectorWidth + edgeExcess,
            edgeHeight,
        )
        .fill({ color: hexToNumber("#52431C") })
        .rect(
            connectorWidth + edgeExcess / 2,
            -connectorOffsetY - connectorHeight,
            connectorWidth,
            connectorHeight,
        )
        .rect(
            connectorWidth + edgeExcess / 2,
            -connectorOffsetY - connectorHeight * 2 - connectorGap,
            connectorWidth,
            connectorHeight,
        )
        .fill({ color: hexToNumber("#121212") });

    const wheelRadius = 35;
    const wheelGap = 40;
    const centerX = (containerWidth + edgeExcess) / 2;
    const offsetX = wheelRadius + wheelGap / 2;
    
    const backWheel = createTrainWheel(wheelRadius);
    const frontWheel = createTrainWheel(wheelRadius);

    backWheel.x = centerX - offsetX;
    frontWheel.x = centerX + offsetX;
    frontWheel.y = backWheel.y = 25;

    container.addChild(graphics, backWheel, frontWheel);
    app.ticker.add((time) => {
        const dr = time.deltaTime * 0.15;

        backWheel.rotation += dr;
        frontWheel.rotation += dr;
    })

    return container;
}

function createTrainWheel(radius) {
    // 轮毂参数
    const strokeThickness = radius / 3;
    const innerRadius = radius - strokeThickness;

    return new PIXI.Graphics()
        // 绘制轮毂基础圆形
        .circle(0, 0, radius)
        .fill({ color: hexToNumber("#848484") })
        // 添加轮毂轮缘效果
        .stroke({ color: hexToNumber("#121212"), width: strokeThickness, alignment: 1 })
        // 绘制轮毂垂直辐条
        .rect(-strokeThickness / 2, -innerRadius, strokeThickness, innerRadius * 2)
        // 绘制轮毂水平辐条
        .rect(-innerRadius, -strokeThickness / 2, innerRadius * 2, strokeThickness)
        .fill({ color: hexToNumber("#4f4f4f") });
}

function addSmokes(app, container) {
    const groupCount = 5;
    const particleCount = 7;
    const groups = new Array();
    const baseX = container.x + 170;
    const baseY = container.y - 120;

    console.log(container);
    

    for (let _idx = 0; _idx < groupCount; _idx++) {
        const smokeGroup = new PIXI.Graphics();

        for (let __idx = 0; __idx < particleCount; __idx++) {
            const radius = 20 + Math.random() * 20;
            const x = (Math.random() * 2 - 1) * 40;
            const y = (Math.random() * 2 - 1) * 40;

            smokeGroup.circle(x, y, radius);
        }

        smokeGroup.fill({ color: hexToNumber("#C9C9C9")});

        smokeGroup.x = baseX;
        smokeGroup.y = baseY;
        smokeGroup.tick = _idx * (1 / groupCount);
        
        app.stage.addChild(smokeGroup);
        groups.push(smokeGroup);
    }

    app.ticker.add((time) => {
        const dt = time.deltaTime * 0.01;
        groups.forEach((group) => {
            group.tick = (group + dt) % 1;
            group.x = baseX - Math.pow(group.tick, 2) * 400;
            group.y = baseY - group.tick * 200;
            group.scale.set(Math.pow(group.tick, 0.75));
            group.alpha = Math.pow(group.tick, 0.5);
        })
    })

    // app.stage.addChild(groups);
}