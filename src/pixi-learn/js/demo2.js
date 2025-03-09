const app = new PIXI.Application();

    async function setup() {
        await app.init({ background: '#1f1f1f', resizeTo: window });
        document.body.appendChild(app.canvas);

        await preload();

        // const background = Sprite.from('background');
        // background.anchor.set(0.5);

    }

    async function preload() {
        const assets = [
            { alias: 'background', src: 'https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg' },
            { alias: 'fish1', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish1.png' },
            { alias: 'fish2', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish2.png' },
            { alias: 'fish3', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish3.png' },
            { alias: 'fish4', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish4.png' },
            { alias: 'fish5', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish5.png' },
            { alias: 'overlay', src: 'https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png' },
            { alias: 'displacement', src: 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png' },
        ];
        // 加载资源到 Assets 缓存中
        // Assets 是全局唯一的资源管理器单例
        await PIXI.Assets.load(assets);

    }

    const addFish = () => {
        // 创建一个「鱼群」组
        const fishContainer = new PIXI.Container();
        app.stage.addChild(fishContainer); // 直接将「鱼群」添加到场景中

        const fishCount = 20;
        const fishAssets = ['fish1', 'fish2', 'fish3', 'fish4', 'fish5'];
        const fishes = [];

        for (let i = 0; i < fishCount; i++) {
            const fishAsset = fishAssets[i % fishAssets.length];
            const fish = PIXI.Sprite.from(fishAsset);

            // 设置鱼的锚点
            fish.anchor.set(0.5);

            // 控制鱼儿的旋转半径
            fish.direction = Math.random() * Math.PI * 2;
            fish.speed = 0.1 + Math.random() * 0.5;
            fish.turnSpeed = Math.random() - 0.8;

            fish.x = Math.random() * app.screen.width;
            fish.y = Math.random() * app.screen.height;
            fish.scale.set(0.5 + Math.random() * 0.2);

            fishContainer.addChild(fish);
            fishes.push(fish);
            
            app.ticker.add( (time) => {
                const delta = time.deltaTime;
                // fish.speed = fish.speed * delta;
                const stagePadding = 100;
                const boundWidth = app.screen.width + stagePadding * 2;
                const boundHeight = app.screen.height + stagePadding * 2; 

                fishes.forEach((fish) =>
                {
                    fish.direction += fish.turnSpeed * 0.01;
                    fish.x += Math.sin(fish.direction) * fish.speed;
                    fish.y += Math.cos(fish.direction) * fish.speed;
                    fish.rotation = -fish.direction - Math.PI / 2;

                    if (fish.x < -stagePadding)
                    {
                        fish.x += boundWidth;
                    }
                    if (fish.x > app.screen.width + stagePadding)
                    {
                        fish.x -= boundWidth;
                    }
                    if (fish.y < -stagePadding)
                    {
                        fish.y += boundHeight;
                    }
                    if (fish.y > app.screen.height + stagePadding)
                    {
                        fish.y -= boundHeight;
                    }
                });

                // Animate the overlay.
                overlay.tilePosition.x -= delta * 0.1;
                overlay.tilePosition.y -= delta * 0.1;

            })
        }

    }

    setup().then( ()=> {
        const background = PIXI.Sprite.from('background')
        background.anchor.set(0.5);

        if (app.screen.width > app.screen.height) {
            background.width = app.screen.width * 1.2;
            background.scale.y = background.scale.x;
        } else {
            background.height = app.screen.height  * 1.2;
            background.scale.x = background.scale.y;
        }
        // 背景居中
        background.x = app.screen.width / 2;
        background.y = app.screen.height / 2;
        app.stage.addChild(background);

        // console.log(background);

        addFish()
        

        // 将缓存中的 「动态水波纹」 创建为纹理对象
        const texture = PIXI.Texture.from('overlay');

        // 创建一个平铺精灵，用于平铺「动态水波纹」
        overlay = new PIXI.TilingSprite({
            texture,
            width: app.screen.width,
            height: app.screen.height,
        });

        app.stage.addChild(overlay);

        //  ==================

        const sprite = PIXI.Sprite.from('displacement');
        
        sprite.texture.source.style.addressMode = 'repeat';
        
        const filter = new PIXI.DisplacementFilter({
            sprite: sprite,
            scale: 50,
        });
        app.stage.filters = [filter];

        console.log('Overlay texture exists:', PIXI.Assets.get('overlay'));
        console.log('Displacement texture exists:', PIXI.Assets.get('displacement'));

        // const displacementTexture = PIXI.Texture.from('displacement');

        // const displacementSource = new PIXI.ImageSource({
        //     resource: displacementTexture,
        //     addressMode: 'repeat' // 替代原来的 setWrapMode
        // });

        // const displacementFilter = new PIXI.DisplacementFilter({
        //     source: displacementSource,
        //     scale: 30 // 新版本的 scale 敏感度不同，建议调低
        // });

        // app.stage.filters = [displacementFilter];


        // 确保使用 Assets 系统获取纹理
        // const displacementResource = PIXI.Assets.get('displacement');
        
        // // 创建适配 v8 的位移滤镜
        // const displacementFilter = new PIXI.DisplacementFilter({
        //     source: new PIXI.ImageSource({
        //         resource: displacementResource,
        //         addressModeU: 'repeat', // 新版使用 addressModeU/V
        //         addressModeV: 'repeat'
        //     }),
        //     scale: 30
        // });

        // // 必须等待资源准备就绪
        // displacementFilter.source.source.setup({
        //     wrapMode: PIXI.WRAP_MODES.REPEAT
        // }).then(() => {
        //     app.stage.filters = [displacementFilter];
        // });

        // const source = new PIXI.ImageSource({
        //     resource: new Image().src = 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png',
        //     addressMode: 'repeat'
        // });
        // const texture2 = new PIXI.Texture({
        //     source,
        // });
        // const filter = new PIXI.DisplacementFilter({
        //     sprite: texture2,
        //     scale: 50,
        // });
        // app.stage.filters = [filter];


    });