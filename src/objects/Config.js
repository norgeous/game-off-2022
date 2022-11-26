export default class Config {
  // debug
  static PLAY_MUSIC = true;
  static PLAY_SFX = true;
  static SPAWN_ENEMIES = false;
  static DRAW_DEBUG = false;

  // physics
  static GRAVITY = {x: 0, y: 1};

  // Scene
  static SCENE_TRANSITION_TIME_MS = 1000;
  static SCENES = {
    FOREST: {
      NAME: 'theForest',
      AREA1 : {
        SCENE_KEY: 'forest-area1',
        SCENE_NAME: 'The hidden forest',
      },
      AREA2 : {
        SCENE_KEY: 'forest-area2',
        SCENE_NAME: 'The hidden forest 2',
      },
      AREA3 : {
        SCENE_KEY: 'forest-area3',
        SCENE_NAME: 'The hidden forest 3',
      },
      AREA4 : {
        SCENE_KEY: 'forest-area4',
        SCENE_NAME: 'The hidden forest 4',
      },
      AREA51 : {
        SCENE_KEY: 'forest-area51',
        SCENE_NAME: 'Area 51',
      },
    }
  };
}
