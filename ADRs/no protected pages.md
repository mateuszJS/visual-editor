If we are planning to release app on mobile, then there is no sense to make protected pages via middleware. We should just do it inside jsx.

API routes of course should remain protected, but the can be prtoected in inside route.ts, no need to use middelware.
