Next.JS now provides async cookies(), headers() etc. The problem is that you can for example set cookies by:
(await cookies()).set(MY_COOKIE) and this cookies gonne best SET despite what request will you return! After settign up the cookie there might be a 500 error that you are returning, and cookie is gonna be attached!!!

reasons for NextJS to use async: https://github.com/vercel/next.js/pull/68812

Additionally async methods on API increases the processing time sicne node uses task queue/micro task queue, so each async puts another item at the end of the queue.
