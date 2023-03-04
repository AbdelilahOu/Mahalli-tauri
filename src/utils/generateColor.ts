const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomByte = () => randomNumber(0, 255);

export const generateColor = () =>
  `rgba(${[randomByte(), randomByte(), randomByte(), 0.2].join(",")})`;
