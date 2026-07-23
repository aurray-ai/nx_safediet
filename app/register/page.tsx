import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

type RegisterPageProps = {
  searchParams?: {
    redirectTo?: string;
    email?: string;
  };
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <OnboardingFlow
      initialStep={4}
      redirectTo={searchParams?.redirectTo}
      initialEmail={searchParams?.email}
    />
  );
}
