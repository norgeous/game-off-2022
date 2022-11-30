# game-off-2022

play: https://norgeous.github.io/game-off-2022/

## development

```
git clone https://github.com/norgeous/game-off-2022.git
cd game-off-2022
npm i
npm run start
```

## project links

https://docs.google.com/document/d/1M7tJdqYT99asYw-pYen-Ex6KVqui2znl7mGJBoGQ4EQ/edit

https://trello.com/b/FtSSrcBy/zombie-vampire-survivors-game


## github pages deployment notes

1. switch to `deploy` branch
1. update `deploy` branch with `main`
1. run `npm run build`
1. delete the `docs` folder
1. rename `dist` to `docs`
1. modify `docs/index.html` - remove the `/` from start of `/assets/` url
1. commit to `deploy` and push


## spritesheets used

freebies from https://craftpix.net/

https://jimmydjourney.itch.io/oil-barrel-and-explosive-oil-barrel


## tutorials used

boilerplate starter https://github.com/ourcade/phaser3-vite-template (thanks @supertommy)

https://blog.ourcade.co/posts/2020/phaser-3-noob-guide-loading-tiled-tilemaps/

https://itnext.io/modular-game-worlds-in-phaser-3-tilemaps-4-meet-matter-js-abf4dfa65ca1

https://phaser.io/examples/v3/view/tilemap/collision/matter-platformer-with-wall-jumping

https://github.com/photonstorm/phaser/issues/5488

https://phaser.io/examples/v3/view/game-objects/graphics/health-bars-demo

https://phaser.discourse.group/t/create-a-matter-sprite-class-from-a-phaser-container/11272

https://blog.ourcade.co/posts/2020/phaser-3-matter-physics-collision-filter/

https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Matter.html#.MatterBodyConfig

https://stackoverflow.com/questions/6039522/given-the-x-and-y-components-of-the-velocity-how-can-the-angle-be-computed

https://phaser.io/examples/v3/view/physics/matterjs/compound-sensors


## sounds used

https://pixabay.com/sound-effects/search/shotgun/

https://pixabay.com/sound-effects/single-gunshot-62-hp-37188/

https://pixabay.com/sound-effects/designed-fire-winds-swoosh-04-116788/


## Tile Extruder

https://github.com/sporadic-labs/tile-extruder#readme
