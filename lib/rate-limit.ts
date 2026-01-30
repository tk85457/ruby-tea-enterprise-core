// Basic in-memory rate limiter for Enterprise Edge protection
// Note: In a multi-instance production environment, use Redis.

const rateLimitMap = new Map();

export function rateLimit(ip: string, limit: number = 100, windowMs: number = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;

    let userRequests = rateLimitMap.get(ip) || [];

    // Filter old requests
    userRequests = userRequests.filter((timestamp: number) => timestamp > windowStart);

    if (userRequests.length >= limit) {
        return { success: false, remaining: 0, reset: windowStart + windowMs };
    }

    userRequests.push(now);
    rateLimitMap.set(ip, userRequests);

    return { success: true, remaining: limit - userRequests.length, reset: windowStart + windowMs };
}
