import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (payload: object, secret: string, expiresIn: number): string => {
    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return decoded;
    } catch (error) {
        throw error;
    }
}