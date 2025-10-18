import { Response } from "express";

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  maxAge: number // in milliseconds
) => {
  res.cookie(name, value, {
    maxAge,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};

export const clearCookie = (res: Response, name: string) => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};
