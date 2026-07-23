"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { PublicSurvey, SurveyQuestion } from "@/lib/types";

type PublicSurveyFormProps = {
  survey: PublicSurvey;
};

function renderQuestionValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return "";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PublicSurveyForm({ survey }: PublicSurveyFormProps) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [respondentEmail, setRespondentEmail] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderedQuestions = useMemo(
    () =>
      survey.sections
        .slice()
        .sort((left, right) => left.position - right.position)
        .flatMap((section) =>
          survey.questions
            .filter((question) => question.section_id === section.id)
            .sort((left, right) => left.position - right.position),
        ),
    [survey.questions, survey.sections],
  );

  const activeQuestion = orderedQuestions[stepIndex];
  const progress = orderedQuestions.length > 0 ? Math.round(((stepIndex + 1) / orderedQuestions.length) * 100) : 0;
  const emailIsValid = EMAIL_PATTERN.test(respondentEmail.trim());
  const canStartSurvey = !survey.settings.collect_email || emailIsValid;

  function updateAnswer(questionId: string, value: unknown) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/surveys/${survey.slug}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          respondent_email: respondentEmail || null,
          respondent_name: respondentName || null,
          answers: orderedQuestions.map((question) => ({
            question_id: question.id,
            value: answers[question.id] ?? null,
          })),
        }),
      });
      const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.detail ?? "Unable to submit survey response.");
      }
      router.push(`/surveys/${survey.slug}/submitted`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit survey response.");
      setIsSubmitting(false);
    }
  }

  if (orderedQuestions.length === 0) {
    return (
      <section className="survey-public survey-public--state">
        <div className="survey-public__stateCard">
          <div className="survey-public__stateBrand">SafeDiet</div>
          <div className="survey-public__stateIcon">?</div>
          <h1>This survey has no questions yet</h1>
          <p>The survey exists, but it has not been configured with any questions.</p>
        </div>
      </section>
    );
  }

  if (!started) {
    return (
      <section className="survey-public">
        <div className="survey-public__landing">
          <div className="survey-public__landingCopy">
            <div className="survey-public__brandRow">
              <Image src="/brand/logo.png" alt="SafeDiet logo" width={42} height={42} />
              <strong>SafeDiet</strong>
            </div>
            <h1>{survey.title || "Help us build a healthier future"}</h1>
            <p>
              {survey.description || "Your feedback helps us create better meal plans and experiences for everyone."}
            </p>

            <div className="survey-public__metaRow">
              {/* <span>Guided</span>
              <span>{orderedQuestions.length} questions</span>
              <span>{survey.settings.collect_email ? "Identified" : "Anonymous"}</span> */}
            </div>

            {survey.settings.collect_email ? (
              <div className="survey-public__introFields">
                <input
                  className="survey-public__input"
                  placeholder="Your name"
                  value={respondentName}
                  onChange={(event) => setRespondentName(event.target.value)}
                />
                <input
                  className="survey-public__input"
                  type="email"
                  placeholder="you@example.com"
                  value={respondentEmail}
                  onChange={(event) => setRespondentEmail(event.target.value)}
                  required
                  aria-required="true"
                />
              </div>
            ) : null}

            <button
              type="button"
              className="survey-public__primaryButton"
              onClick={() => setStarted(true)}
              disabled={!canStartSurvey}
            >
              Start Survey
            </button>
            <small>By continuing, you agree to our Privacy Policy.</small>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="survey-public">
      <div className="survey-public__stepCard">
        <div className="survey-public__progressHeader">
          <span>Step {stepIndex + 1} of {orderedQuestions.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="survey-public__progressBar">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="survey-public__questionBlock">
          <h2>{activeQuestion.title}</h2>
          <p>{activeQuestion.description || "Select the option that best represents you."}</p>
        </div>

        {activeQuestion.type === "single_choice" ? (
          <div className="survey-public__optionStack">
            {activeQuestion.options.map((option) => {
              const selected = answers[activeQuestion.id] === option.value;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`survey-public__choiceCard ${selected ? "is-selected" : ""}`}
                  onClick={() => updateAnswer(activeQuestion.id, option.value)}
                >
                  <span className="survey-public__radio" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {activeQuestion.type === "multiple_choice" ? (
          <div className="survey-public__optionStack">
            {activeQuestion.options.map((option) => {
              const currentValues = Array.isArray(answers[activeQuestion.id]) ? (answers[activeQuestion.id] as string[]) : [];
              const selected = currentValues.includes(option.value);
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`survey-public__choiceCard ${selected ? "is-selected" : ""}`}
                  onClick={() => {
                    const next = selected
                      ? currentValues.filter((item) => item !== option.value)
                      : [...currentValues, option.value];
                    updateAnswer(activeQuestion.id, next);
                  }}
                >
                  <span className="survey-public__checkbox" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {activeQuestion.type === "linear_scale" ? (
          <div className="survey-public__scaleRow">
            {Array.from({
              length: (activeQuestion.config.scale_max ?? 5) - (activeQuestion.config.scale_min ?? 1) + 1,
            }).map((_, index) => {
              const value = (activeQuestion.config.scale_min ?? 1) + index;
              const selected = answers[activeQuestion.id] === value;
              return (
                <button
                  key={value}
                  type="button"
                  className={`survey-public__scaleButton ${selected ? "is-selected" : ""}`}
                  onClick={() => updateAnswer(activeQuestion.id, value)}
                >
                  {value}
                </button>
              );
            })}
            <div className="survey-public__scaleLabels">
              <span>{activeQuestion.config.scale_min_label || "Never"}</span>
              <span>{activeQuestion.config.scale_max_label || "Very Often"}</span>
            </div>
          </div>
        ) : null}

        {activeQuestion.type === "dropdown" ? (
          <select
            className="survey-public__input"
            value={renderQuestionValue(answers[activeQuestion.id])}
            onChange={(event) => updateAnswer(activeQuestion.id, event.target.value)}
          >
            <option value="">Select one option</option>
            {activeQuestion.options.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : null}

        {(activeQuestion.type === "short_text" || activeQuestion.type === "paragraph" || activeQuestion.type === "number" || activeQuestion.type === "email") ? (
          activeQuestion.type === "paragraph" ? (
            <textarea
              className="survey-public__textarea"
              value={renderQuestionValue(answers[activeQuestion.id])}
              placeholder={activeQuestion.config.placeholder || "Your answer"}
              rows={5}
              onChange={(event) => updateAnswer(activeQuestion.id, event.target.value)}
            />
          ) : (
            <input
              className="survey-public__input"
              type={activeQuestion.type === "number" ? "number" : activeQuestion.type === "email" ? "email" : "text"}
              value={renderQuestionValue(answers[activeQuestion.id])}
              placeholder={activeQuestion.config.placeholder || "Your answer"}
              onChange={(event) => updateAnswer(activeQuestion.id, event.target.value)}
            />
          )
        ) : null}

        {activeQuestion.type === "date" ? (
          <input
            className="survey-public__input"
            type="date"
            value={renderQuestionValue(answers[activeQuestion.id])}
            onChange={(event) => updateAnswer(activeQuestion.id, event.target.value)}
          />
        ) : null}

        {error ? <p className="survey-public__errorText">{error}</p> : null}

        <div className="survey-public__footerActions">
          <button
            type="button"
            className="survey-public__secondaryButton"
            onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            disabled={stepIndex === 0 || isSubmitting}
          >
            Back
          </button>
          {stepIndex < orderedQuestions.length - 1 ? (
            <button
              type="button"
              className="survey-public__primaryButton"
              onClick={() => setStepIndex((current) => Math.min(orderedQuestions.length - 1, current + 1))}
            >
              Continue
            </button>
          ) : (
            <button type="button" className="survey-public__primaryButton" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
