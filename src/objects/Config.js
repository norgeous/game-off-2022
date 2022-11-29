export default class Config {
  // debug
  static DRAW_DEBUG = false;

  // depth values
  static PLAYER_DEPTH = 900;
  static IN_FRONT_OF_PLAYER = 909;
  static UI_DEPTH = 999;
  static UI_BUTTON_DEPTH = 1000;
  static PARTICLE_EFFECT_DEPTH = 1000;

  // options
  static PLAY_MUSIC = false;
  static PLAY_SFX = true;
  static SPAWN_ENEMIES = true;
  static SCREEN_SHAKE = true;
  static SCREEN_SHAKE_DURATION = 300;
  static SCREEN_SHAKE_INTENSITY = 0.006;

  // physics
  static GRAVITY = {x: 0, y: 1};

  // scene
  static SCENE_TRANSITION_TIME_MS = 1000;
  static DISPLAY_MAP_NAME_TIME_MS = 5000;
  static FLOATING_PLATFORM_DEFAULT_TIME = 8000;
  static FLOATING_PLATFORM_DEFAULT_IMAGE_KEY = 'floatingPlatform'

  // game
  static TOXIC_DAMAGE = 10;
  static SPAWN_RANGE = 1000; // range from player to spawn enemies.
  static DESPAWN_RANGE = 1300; // range from player to despawn enemies.
  static ZOMBIE_SPAWN_TIME = 1000;
  static HURT_FADE_IN_TIME_MS = 100;
  static HURT_FADE_IN_COLOUR = {
    r:200,
    b:0,
    g:0
  };
  static EXPLODING_BARRELS_RADIUS = 200;
  static EXPLODING_BARRELS_FORCE = 200;
  static EXPLODING_BARRELS_DAMAGE = 200;
  static EXPLODING_BARRELS_TEXTURE = 'explosion'
}
