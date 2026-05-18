import { evaluateProfileCompletion, type ProfileRole } from "@batch/core";
import { demoUsers } from "@/lib/api-demo-store";

export function getDemoProfile(userId = "buyer_demo") {
  const user = demoUsers.find((item) => item.id === userId) ?? demoUsers[0];
  const completion = evaluateProfileCompletion({
    role: user.role as ProfileRole,
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    businessName: "businessName" in user ? user.businessName : undefined,
  });

  return { user, completion: completion.ok ? completion.data : null };
}
