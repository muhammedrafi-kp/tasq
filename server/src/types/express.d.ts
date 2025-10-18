import { JwtPayload } from "jsonwebtoken";

export interface JwtUserPayload extends JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtUserPayload;
        }
    }
}
