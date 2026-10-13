// Number of onboarding questions after the account is created, per role.
// Shared by sign-up (to size the progress bar) and the onboarding page.
export const ONBOARDING_STEPS = {
  freelancer: 4, // category, skills, rate, bio
  client: 2, // company name, about
} as const;
