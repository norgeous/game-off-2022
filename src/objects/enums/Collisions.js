export const collisionCategories = {
  default: 0b00000000000000000000000000000001, // 1 (the default category)
  ladders: 0b00000000000000000000000000000010, // 2
  layer03: 0b00000000000000000000000000000100, // 4
  // ...
  layer32: 0b10000000000000000000000000000000, // 2147483648 (32 max layer)
};

// 4294967295 a mask of everything, the default mask
export const collisionMaskEverything = 0b11111111111111111111111111111111;
