# ADR: Avoiding Next.js Async API Utilities

## Context

Next.js provides async utilities like `cookies()` and `headers()` for handling HTTP operations. However, these utilities present specific challenges in error handling and performance.

## Problem

When setting cookies using async syntax:

```
(await cookies()).set(MY_COOKIE)
```

The cookie will be attached to the response regardless of subsequent errors. For example, if a 500 error occurs after setting the cookie(maybe there was an error throw during creating json response body or setting up other headers), the cookie will still be sent to the client.

Additionally, async methods increase processing time due to how Node.js manages its task and microtask queues. Each async operation adds another item to the end of the queue, potentially impacting performance.

## Decision

We will avoid using Next.js async API utilities where possible and prefer synchronous alternatives. When async utilities must be used, we'll implement careful error handling to ensure proper response management.

## References

- [Next.js PR explaining async approach](https://github.com/vercel/next.js/pull/68812)
