import Image from "next/image";
import Link from "next/link";

type SurveyUnavailablePageProps = {
  reason: "not_published" | "not_public" | "not_found";
  slug: string;
};

const COPY: Record<
  SurveyUnavailablePageProps["reason"],
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  not_published: {
    eyebrow: "Survey coming soon",
    title: "This survey is not live yet",
    description:
      "The link is valid, but responses have not been opened yet. Please check back later or contact the person who shared the survey with you.",
  },
  not_public: {
    eyebrow: "Restricted survey",
    title: "This survey is not publicly available",
    description:
      "This survey is currently limited to a specific audience. If you expected access, contact the person who shared the survey with you.",
  },
  not_found: {
    eyebrow: "Survey unavailable",
    title: "We could not find that survey",
    description:
      "The survey link may be incorrect, expired, or no longer available. Double-check the link or ask for a new one.",
  },
};

export function SurveyUnavailablePage({ reason, slug }: SurveyUnavailablePageProps) {
  const copy = COPY[reason];

  return (
    <section className="survey-public survey-public--state">
      <div className="survey-public__stateCard">
        <div className="survey-public__stateBrand">
          <Image src="/brand/logo.png" alt="SafeDiet logo" width={30} height={30} />
          <span>SafeDiet</span>
        </div>
        <div className="survey-public__stateIcon">{reason === "not_found" ? ":(" : "⌛"}</div>
        <p className="survey-public__eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
        <Link href="/" className="survey-public__primaryButton">
          Go to SafeDiet
        </Link>
        <span className="survey-public__stateLink">Survey link: /surveys/{slug}</span>
      </div>
    </section>
  );
}
