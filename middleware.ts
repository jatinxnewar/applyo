import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge"

export default withMiddlewareAuthRequired()

export const config = {
  matcher: ["/dashboard/:path*", "/resume/:path*", "/jobs/:path*", "/applications/:path*", "/profile/:path*"],
}
