# PixiJS Learn

中文文档: https://pixi.nodejs.cn/guides/basics/what-pixijs-is

英文文档: https://pixijs.com/8.x/guides

> 建议阅读英文官方文档，中文文档更新不及时

## TODO

`demo2.js` 中的这部分代码无法正常运行，根据控制信息提示是 baseTexture API Deprecation 问题  
但吊轨的就是，这文档里就没多少提及 baseTexture 迁移的说明，就算有也是牛头不对马嘴的  
包括源代码中也没有对这个迁移的相关说明 *（这 PIXI 似乎连 TypeScript 版本都停更了）*  
先暂时放一边。

```javascript
    // ....
    const sprite = PIXI.Sprite.from('displacement');
    sprite.texture.baseTexture.wrapMode = 'repeat';
    const filter = new PIXI.DisplacementFilter({
        sprite: sprite,
        scale: 50,
    });
    app.stage.filters = [filter];
    // ....
```