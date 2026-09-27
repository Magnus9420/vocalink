export * from "./r2";
export const APP_ROLES = ["learner", "provider_staff", "employer", "org_partner", "admin"] as const;
export type AppRole = (typeof APP_ROLES)[number];
