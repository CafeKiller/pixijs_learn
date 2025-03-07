import {Application, Assets} from "pixi.js";

const APP = new Application();

(async () => {
    await setup();
    await preload();
})()


const setup = async () => {
    await APP.init({ background: '#1099bb', resizeTo: window });
    document.body.append(APP.canvas)
}

async function preload()
{
    const assets = [
        { alias: 'background', src: '//pixijs.com/assets/tutorials/fish-pond/pond_background.jpg' },
        { alias: 'fish1', src: '//pixijs.com/assets/tutorials/fish-pond/fish1.png' },
        { alias: 'fish2', src: '//pixijs.com/assets/tutorials/fish-pond/fish2.png' },
        { alias: 'fish3', src: '//pixijs.com/assets/tutorials/fish-pond/fish3.png' },
        { alias: 'fish4', src: '//pixijs.com/assets/tutorials/fish-pond/fish4.png' },
        { alias: 'fish5', src: '//pixijs.com/assets/tutorials/fish-pond/fish5.png' },
        { alias: 'overlay', src: '//pixijs.com/assets/tutorials/fish-pond/wave_overlay.png' },
        { alias: 'displacement', src: '//pixijs.com/assets/tutorials/fish-pond/displacement_map.png' },
    ];
    await Assets.load(assets);
}
