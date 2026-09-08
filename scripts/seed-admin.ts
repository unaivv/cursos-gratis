/**
 * One-off: creates the single admin user directly via Better Auth's
 * server API — never through the public HTTP sign-up endpoint (which is
 * blocked, see src/lib/auth/guards.ts). This is the ONLY way a user gets
 * created; there is no sign-up page.
 *
 * Run: DATABASE_URL=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx scripts/seed-admin.ts
 */
import { fileURLToPath } from "node:url";
import { auth } from "../src/lib/auth/config";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
    process.exitCode = 1;
    return;
  }

  await auth.api.signUpEmail({
    body: { email, password, name: "Admin" },
  });

  console.log(`Admin user created: ${email}`);
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => process.exit());
}
