// without a defined mathcer, this one line appllies next-auth to all routes
export { default } from "next-auth/middleware"

// to apply for matching routes (can also use regex)
// export const config = { matcher: ["/somepage"] }