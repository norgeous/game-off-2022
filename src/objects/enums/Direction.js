export default class Direction {
  static Up = 'Up';
  static UpRight = 'UpRight';
  static Right = 'Right';
  static DownRight = 'DownRight';
  static Down = 'Down';
  static DownLeft = 'DownLeft';
  static Left = 'Left';
  static UpLeft = 'Upleft';
}

const twoPi = 2 * Math.PI;
const deg45 = twoPi / 8;
export const directionToAngle = {
  [Direction.Up]: deg45 * 0,
  [Direction.UpRight]: deg45 * 1,
  [Direction.Right]: deg45 * 2,
  [Direction.DownRight]: deg45 * 3,
  [Direction.Down]: deg45 * 4,
  [Direction.DownLeft]: deg45 * 5,
  [Direction.Left]: deg45 * 6,
  [Direction.UpLeft]: deg45 * 7,
};
