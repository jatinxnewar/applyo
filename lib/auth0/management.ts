import type { ManagementClient } from "auth0"

let managementClient: ManagementClient | null = null

export async function getManagementClient() {
  if (managementClient) {
    return managementClient
  }

  const { ManagementClient } = await import("auth0")

  managementClient = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN!,
    clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID!,
    clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET!,
  })

  return managementClient
}
