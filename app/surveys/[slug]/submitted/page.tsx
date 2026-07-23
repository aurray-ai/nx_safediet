import type { Route } from "next";
import Link from "next/link";

export default function SurveySubmittedPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <section className="survey-public survey-public--state">
      <div className="survey-public__thankYouCard">
        <div className="survey-public__confetti" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="survey-public__successIcon">✓</div>
        <h1>Thank you!</h1>
        <p>Your response has been recorded. You&apos;re helping us build a better SafeDiet experience.</p>
        <Link href={`/surveys/${params.slug}` as Route} className="survey-public__primaryButton">
          Submit another response
        </Link>
        <Link href="/" className="survey-public__stateLink">
          Share with a friend
        </Link>
      </div>
    </section>
  );
}
