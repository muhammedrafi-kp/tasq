import { OAuth2Client, TokenPayload } from 'google-auth-library';

export const verifyGoogleToken = async (token: string): Promise<TokenPayload> => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID as string
        });

        const payload = ticket.getPayload() as TokenPayload;

        return payload;
    } catch (error) {
        console.error('Error verifying Google token:', error);
        throw error;
    }
}