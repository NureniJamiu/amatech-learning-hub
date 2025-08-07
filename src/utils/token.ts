// JWT implementation using Web APIs (Edge Runtime compatible)
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}

// Base64 URL encode
function base64UrlEncode(data: string): string {
    return btoa(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// Base64 URL decode
function base64UrlDecode(data: string): string {
    // Add padding if needed
    const padding = "=".repeat((4 - (data.length % 4)) % 4);
    const base64 = data.replace(/-/g, "+").replace(/_/g, "/") + padding;
    return atob(base64);
}

// Create HMAC SHA256 signature using Web Crypto API
async function createSignature(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const secretKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "HMAC",
        secretKey,
        encoder.encode(data)
    );
    return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

// Verify HMAC SHA256 signature using Web Crypto API
async function verifySignature(
    data: string,
    signature: string,
    secret: string
): Promise<boolean> {
    try {
        const expectedSignature = await createSignature(data, secret);
        return expectedSignature === signature;
    } catch {
        return false;
    }
}

export const generateAuthToken = async (userId: string): Promise<string> => {
    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
        userId,
        iat: now,
        exp: now + 15 * 24 * 60 * 60, // 15 days
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const data = `${encodedHeader}.${encodedPayload}`;

    const signature = await createSignature(data, JWT_SECRET!);

    return `${data}.${signature}`;
};

export const verifyAuthToken = async (
    token: string
): Promise<{ userId: string } | null> => {
    try {
        console.log("Verifying token - JWT_SECRET exists:", !!JWT_SECRET);
        console.log("Token length:", token?.length);
        console.log("Token preview:", token?.substring(0, 20) + "...");

        const parts = token.split(".");
        if (parts.length !== 3) {
            console.error("Token verification failed: Invalid token format");
            return null;
        }

        const [encodedHeader, encodedPayload, signature] = parts;
        const data = `${encodedHeader}.${encodedPayload}`;

        // Verify signature
        const isValid = await verifySignature(data, signature, JWT_SECRET!);
        if (!isValid) {
            console.error("Token verification failed: Invalid signature");
            return null;
        }

        // Decode payload
        const payload = JSON.parse(base64UrlDecode(encodedPayload));

        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            console.error("Token verification failed: Token expired");
            return null;
        }

        console.log(
            "Token verification successful for userId:",
            payload.userId
        );
        return { userId: payload.userId };
    } catch (error) {
        console.error(
            "Token verification failed:",
            error instanceof Error ? error.message : String(error)
        );
        return null;
    }
};
