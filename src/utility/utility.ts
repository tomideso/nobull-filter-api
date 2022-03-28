import * as bcrypt from "bcryptjs";

export const getHash = (input: string) => {
  return bcrypt.hashSync(input, 8);
};

export const getRandomNumber = (length: number) =>
  Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );

export const parseNumber = (val = "") => {
  const num = val ? String(val).replace(/(\-)?[^0-9.]/g, "") : 0;
  return num ? +num : 0;
};

export const isValidDate = (val) => {
  const date = new Date(val);
  return date.getTime() - date.getTime() === 0;
};

export function extractTokenFromHeaderAsBearerToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}
