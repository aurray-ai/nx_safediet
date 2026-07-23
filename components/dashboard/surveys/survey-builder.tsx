"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type {
  AdminSurvey,
  SurveyQuestion,
  SurveyQuestionOption,
  SurveyQuestionType,
  SurveyTemplate,
} from "@/lib/types";

type SurveyBuilderProps = {
  role: string;
  initialSurvey?: AdminSurvey;
  templates?: SurveyTemplate[];
};

type SurveyDraft = {
  title: string;
  slug: string;
  description: string;
  settings: AdminSurvey["settings"];
  theme: AdminSurvey["theme"];
  sections: AdminSurvey["sections"];
  questions: AdminSurvey["questions"];
};

type BuilderStep = "template" | "build";

const QUESTION_TYPE_OPTIONS: Array<{ value: SurveyQuestionType; label: string }> = [
  { value: "short_text", label: "Short Text" },
  { value: "paragraph", label: "Long Text" },
  { value: "single_choice", label: "Single Choice" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "dropdown", label: "Dropdown" },
  { value: "linear_scale", label: "Scale / Rating" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "date", label: "Date / Time" },
];

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function buildDefaultDraft(): SurveyDraft {
  const firstSectionId = generateId("section");
  return {
    title: "",
    slug: "",
    description: "",
    settings: {
      is_public: true,
      collect_email: false,
      require_auth: false,
      limit_one_response_per_user: false,
      limit_one_response_per_email: false,
      show_progress_bar: true,
      shuffle_question_order: false,
      confirmation_message: "Thanks for completing this survey.",
      accepting_responses: true,
    },
    theme: {
      accent_color: "#b9821f",
      header_image_url: "",
      font_family: "inherit",
    },
    sections: [
      {
        id: firstSectionId,
        title: "Section 1: Getting to know you",
        description: "",
        position: 1,
      },
    ],
    questions: [
      {
        id: generateId("question"),
        section_id: firstSectionId,
        position: 1,
        type: "single_choice",
        title: "What is your age range?",
        description: "",
        required: true,
        options: [
          { id: generateId("option"), label: "18 - 24", value: "18_24", position: 1 },
          { id: generateId("option"), label: "25 - 34", value: "25_34", position: 2 },
        ],
        validation: {},
        config: {
          placeholder: "",
          allow_other: false,
          scale_min: null,
          scale_max: null,
          scale_min_label: "",
          scale_max_label: "",
        },
      },
    ],
  };
}

function surveyToDraft(survey: AdminSurvey): SurveyDraft {
  return {
    title: survey.title,
    slug: survey.slug,
    description: survey.description,
    settings: { ...survey.settings },
    theme: { ...survey.theme },
    sections: survey.sections.map((section) => ({ ...section })),
    questions: survey.questions.map((question) => ({
      ...question,
      options: question.options.map((option) => ({ ...option })),
      validation: { ...question.validation },
      config: { ...question.config },
    })),
  };
}

function templateToDraft(template: SurveyTemplate): SurveyDraft {
  return {
    title: template.survey.title,
    slug: template.survey.slug,
    description: template.survey.description,
    settings: { ...template.survey.settings },
    theme: { ...template.survey.theme },
    sections: template.survey.sections.map((section) => ({ ...section })),
    questions: template.survey.questions.map((question) => ({
      ...question,
      options: question.options.map((option) => ({ ...option })),
      validation: { ...question.validation },
      config: { ...question.config },
    })),
  };
}

function normalizeSections(sections: AdminSurvey["sections"]) {
  return sections
    .slice()
    .sort((left, right) => left.position - right.position)
    .map((section, index) => ({ ...section, position: index + 1 }));
}

function normalizeQuestions(questions: SurveyQuestion[]) {
  const grouped = new Map<string, SurveyQuestion[]>();
  for (const question of questions) {
    const sectionQuestions = grouped.get(question.section_id) ?? [];
    sectionQuestions.push(question);
    grouped.set(question.section_id, sectionQuestions);
  }

  const normalized: SurveyQuestion[] = [];
  for (const sectionQuestions of grouped.values()) {
    sectionQuestions
      .sort((left, right) => left.position - right.position)
      .forEach((question, index) => normalized.push({ ...question, position: index + 1 }));
  }
  return normalized;
}

function questionSupportsOptions(type: SurveyQuestionType) {
  return type === "single_choice" || type === "multiple_choice" || type === "dropdown";
}

function applyQuestionTypeDefaults(question: SurveyQuestion, type: SurveyQuestionType): SurveyQuestion {
  const shouldHaveOptions = questionSupportsOptions(type);

  return {
    ...question,
    type,
    options: shouldHaveOptions
      ? question.options.length > 0
        ? question.options
        : [{ id: generateId("option"), label: "Option 1", value: "option_1", position: 1 }]
      : [],
    config: {
      ...question.config,
      allow_other: shouldHaveOptions ? question.config.allow_other : false,
      scale_min: type === "linear_scale" ? question.config.scale_min ?? 1 : null,
      scale_max: type === "linear_scale" ? question.config.scale_max ?? 5 : null,
      scale_min_label: type === "linear_scale" ? question.config.scale_min_label : "",
      scale_max_label: type === "linear_scale" ? question.config.scale_max_label : "",
    },
  };
}

function buildPayload(draft: SurveyDraft) {
  const sections = normalizeSections(draft.sections);
  const firstSectionId = sections[0]?.id ?? generateId("section");
  const questions = normalizeQuestions(
    draft.questions.map((question, index) => ({
      ...question,
      section_id: question.section_id || firstSectionId,
      position: question.position || index + 1,
      options: question.options.map((option, optionIndex) => ({
        ...option,
        label: option.label.trim(),
        value: option.value.trim() || option.label.trim(),
        position: optionIndex + 1,
      })),
    })),
  );

  return {
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    description: draft.description.trim(),
    settings: draft.settings,
    theme: draft.theme,
    sections,
    questions,
  };
}

type SaveMode = "draft" | "publish" | "close";

export function SurveyBuilder({ role, initialSurvey, templates = [] }: SurveyBuilderProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<SurveyDraft>(() => initialSurvey ? surveyToDraft(initialSurvey) : buildDefaultDraft());
  const [builderStep, setBuilderStep] = useState<BuilderStep>(() =>
    initialSurvey || templates.length === 0 ? "build" : "template",
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(() => draft.questions[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedQuestion = useMemo(
    () => draft.questions.find((question) => question.id === selectedQuestionId) ?? draft.questions[0] ?? null,
    [draft.questions, selectedQuestionId],
  );

  function setDraftPatch(patch: Partial<SurveyDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function applyTemplate(template: SurveyTemplate) {
    const next = templateToDraft(template);
    setDraft(next);
    setSelectedQuestionId(next.questions[0]?.id ?? null);
    setSelectedTemplateId(template.template_id);
    setBuilderStep("build");
    setSuccessMessage(`Loaded template: ${template.name}`);
    setError(null);
  }

  function startFromScratch() {
    const next = buildDefaultDraft();
    setDraft(next);
    setSelectedQuestionId(next.questions[0]?.id ?? null);
    setSelectedTemplateId(null);
    setBuilderStep("build");
    setSuccessMessage("Started a blank survey.");
    setError(null);
  }

  function updateQuestion(questionId: string, patch: Partial<SurveyQuestion>) {
    setDraft((current) => ({
      ...current,
      questions: normalizeQuestions(
        current.questions.map((question) => question.id === questionId ? { ...question, ...patch } : question),
      ),
    }));
  }

  function addQuestion(type: SurveyQuestionType, sectionId?: string) {
    setDraft((current) => {
      const targetSectionId = sectionId ?? current.sections[0]?.id ?? generateId("section");
      const nextQuestion: SurveyQuestion = {
        id: generateId("question"),
        section_id: targetSectionId,
        position: current.questions.filter((question) => question.section_id === targetSectionId).length + 1,
        type,
        title: "Untitled question",
        description: "",
        required: false,
        options: questionSupportsOptions(type)
          ? [{ id: generateId("option"), label: "Option 1", value: "option_1", position: 1 }]
          : [],
        validation: {},
        config: {
          placeholder: "",
          allow_other: false,
          scale_min: type === "linear_scale" ? 1 : null,
          scale_max: type === "linear_scale" ? 5 : null,
          scale_min_label: "",
          scale_max_label: "",
        },
      };
      setSelectedQuestionId(nextQuestion.id);
      return {
        ...current,
        questions: normalizeQuestions([...current.questions, nextQuestion]),
      };
    });
  }

  function removeQuestion(questionId: string) {
    setDraft((current) => {
      const remaining = current.questions.filter((question) => question.id !== questionId);
      setSelectedQuestionId(remaining[0]?.id ?? null);
      return {
        ...current,
        questions: normalizeQuestions(remaining),
      };
    });
  }

  function addSection() {
    setDraft((current) => ({
      ...current,
      sections: [
        ...normalizeSections(current.sections),
        {
          id: generateId("section"),
          title: `Section ${current.sections.length + 1}`,
          description: "",
          position: current.sections.length + 1,
        },
      ],
    }));
  }

  function updateSection(sectionId: string, title: string) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section) => section.id === sectionId ? { ...section, title } : section),
    }));
  }

  function addOption(questionId: string) {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) {
          return question;
        }
        const nextPosition = question.options.length + 1;
        return {
          ...question,
          options: [
            ...question.options,
            {
              id: generateId("option"),
              label: `Option ${nextPosition}`,
              value: `option_${nextPosition}`,
              position: nextPosition,
            },
          ],
        };
      }),
    }));
  }

  function updateOption(questionId: string, optionId: string, patch: Partial<SurveyQuestionOption>) {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) {
          return question;
        }
        return {
          ...question,
          options: question.options.map((option) => option.id === optionId ? { ...option, ...patch } : option),
        };
      }),
    }));
  }

  async function saveSurvey(mode: SaveMode) {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = buildPayload(draft);
      const isEditing = Boolean(initialSurvey);
      const response = await fetch(isEditing ? `/api/admin/surveys/${initialSurvey?.id}` : "/api/admin/surveys", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const savedSurvey = (await response.json().catch(() => null)) as AdminSurvey | { detail?: string } | null;

      if (!response.ok || !savedSurvey || !("id" in savedSurvey)) {
        throw new Error((savedSurvey && "detail" in savedSurvey ? savedSurvey.detail : null) ?? "Unable to save survey.");
      }

      if (mode === "publish") {
        const publishResponse = await fetch(`/api/admin/surveys/${savedSurvey.id}/publish`, { method: "POST" });
        if (!publishResponse.ok) {
          const publishPayload = (await publishResponse.json().catch(() => null)) as { detail?: string } | null;
          throw new Error(publishPayload?.detail ?? "Unable to publish survey.");
        }
      }

      if (mode === "close") {
        const closeResponse = await fetch(`/api/admin/surveys/${savedSurvey.id}/close`, { method: "POST" });
        if (!closeResponse.ok) {
          const closePayload = (await closeResponse.json().catch(() => null)) as { detail?: string } | null;
          throw new Error(closePayload?.detail ?? "Unable to close survey.");
        }
      }

      router.push(`/dashboard/${role}/surveys/${savedSurvey.id}` as Route);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save survey.");
    } finally {
      setIsSaving(false);
    }
  }

  const sectionMap = normalizeSections(draft.sections).map((section) => ({
    ...section,
    questions: draft.questions
      .filter((question) => question.section_id === section.id)
      .sort((left, right) => left.position - right.position),
  }));

  if (!initialSurvey && templates.length > 0 && builderStep === "template") {
    return (
      <section className="survey-builder survey-builder--templatesOnly">
        <section className="survey-builder__templates">
          <div className="survey-builder__stepper">
            <span className="is-active">1 Template</span>
            <span>2 Build</span>
            <span>3 Settings</span>
            <span>4 Review</span>
          </div>

          <h3>Choose a template to get started</h3>
          <p>Start from a template or build from scratch.</p>

          <div className="survey-builder__templateGrid">
            <article className="survey-builder__templateCard survey-builder__templateCard--blank">
              <strong>Build from scratch</strong>
              <span>Create a survey from blank</span>
              <button type="button" className="survey-builder__templatePlus" onClick={startFromScratch}>
                +
              </button>
            </article>
            {templates.map((template) => (
              <article
                key={template.template_id}
                className={`survey-builder__templateCard ${selectedTemplateId === template.template_id ? "is-selected" : ""}`}
              >
                <strong>{template.name}</strong>
                <span>{template.description}</span>
                <small>{template.survey.questions.length} questions</small>
                <button type="button" className="app__admin-secondaryButton" onClick={() => applyTemplate(template)}>
                  Use Template
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="survey-builder">
      <section className="survey-builder__toolbar">
        <div>
          <p className="app__admin-eyebrow">Survey Builder</p>
          <h3>{draft.title || "Create Survey"}</h3>
        </div>
        <div className="survey-builder__toolbarActions">
          <span className="survey-builder__saved">Draft saved</span>
          <button type="button" className="app__admin-secondaryButton" onClick={() => saveSurvey("draft")} disabled={isSaving}>
            Preview
          </button>
          <button type="button" className="app__admin-primaryButton" onClick={() => saveSurvey("publish")} disabled={isSaving}>
            {isSaving ? "Saving..." : "Next"}
          </button>
        </div>
      </section>

      {error ? <p className="app__admin-formError">{error}</p> : null}
      {successMessage ? <p className="app__admin-formSuccess">{successMessage}</p> : null}

      <div className="survey-builder__shell">
        <aside className="survey-builder__palette">
          <strong>Add Question</strong>
          {QUESTION_TYPE_OPTIONS.map((option) => (
            <button key={option.value} type="button" onClick={() => addQuestion(option.value)}>
              {option.label}
            </button>
          ))}
          <button type="button" onClick={addSection}>
            Section
          </button>
        </aside>

        <main className="survey-builder__canvas">
          <div className="survey-builder__meta">
            <input
              className="app__admin-input"
              value={draft.title}
              onChange={(event) => setDraftPatch({ title: event.target.value })}
              placeholder="Survey title"
            />
            <input
              className="app__admin-input"
              value={draft.slug}
              onChange={(event) => setDraftPatch({ slug: event.target.value })}
              placeholder="survey-slug"
            />
          </div>

          {sectionMap.map((section) => (
            <section key={section.id} className="survey-builder__section">
              <div className="survey-builder__sectionHeader">
                <input
                  className="app__admin-input"
                  value={section.title}
                  onChange={(event) => updateSection(section.id, event.target.value)}
                />
              </div>

              {section.questions.map((question) => (
                <article
                  key={question.id}
                  className={`survey-builder__questionCard ${selectedQuestion?.id === question.id ? "is-selected" : ""}`}
                  onClick={() => setSelectedQuestionId(question.id)}
                >
                  <div>
                    <strong>{question.position}. {question.title}</strong>
                    <span>{QUESTION_TYPE_OPTIONS.find((item) => item.value === question.type)?.label}</span>
                  </div>
                  <div className="survey-builder__questionActions">
                    <button type="button" onClick={(event) => { event.stopPropagation(); removeQuestion(question.id); }}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </section>
          ))}
        </main>

        <aside className="survey-builder__settings">
          <div className="survey-builder__settingsTabs">
            <span className="is-active">Question</span>
            <span>Logic</span>
          </div>

          {selectedQuestion ? (
            <div className="survey-builder__settingsBody">
              <label className="app__admin-field">
                <span>Question Type</span>
                <select
                  className="app__admin-select"
                  value={selectedQuestion.type}
                  onChange={(event) =>
                    updateQuestion(
                      selectedQuestion.id,
                      applyQuestionTypeDefaults(selectedQuestion, event.target.value as SurveyQuestionType),
                    )
                  }
                >
                  {QUESTION_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="app__admin-field">
                <span>Question</span>
                <input
                  className="app__admin-input"
                  value={selectedQuestion.title}
                  onChange={(event) => updateQuestion(selectedQuestion.id, { title: event.target.value })}
                />
              </label>

              <label className="app__admin-field">
                <span>Description (optional)</span>
                <textarea
                  className="app__admin-textarea"
                  rows={3}
                  value={selectedQuestion.description}
                  onChange={(event) => updateQuestion(selectedQuestion.id, { description: event.target.value })}
                />
              </label>

              {questionSupportsOptions(selectedQuestion.type) ? (
                <div className="survey-builder__optionEditor">
                  <span className="survey-builder__settingsLabel">Options</span>
                  {selectedQuestion.options.map((option) => (
                    <div key={option.id} className="survey-builder__optionRow">
                      <input
                        className="app__admin-input"
                        value={option.label}
                        onChange={(event) => updateOption(selectedQuestion.id, option.id, { label: event.target.value, value: event.target.value })}
                      />
                    </div>
                  ))}
                  <button type="button" className="app__admin-secondaryButton" onClick={() => addOption(selectedQuestion.id)}>
                    + Add Option
                  </button>
                </div>
              ) : null}

              <div className="survey-builder__toggleList">
                <label>
                  <span>Required</span>
                  <input
                    type="checkbox"
                    checked={selectedQuestion.required}
                    onChange={(event) => updateQuestion(selectedQuestion.id, { required: event.target.checked })}
                  />
                </label>
                <label>
                  <span>Allow Other</span>
                  <input
                    type="checkbox"
                    checked={selectedQuestion.config.allow_other}
                    onChange={(event) =>
                      updateQuestion(selectedQuestion.id, {
                        config: { ...selectedQuestion.config, allow_other: event.target.checked },
                      })
                    }
                  />
                </label>
              </div>
            </div>
          ) : (
            <p className="survey-builder__empty">Select a question to edit its settings.</p>
          )}

          {initialSurvey ? (
            <Link href={`/dashboard/${role}/surveys/${initialSurvey.id}` as Route} className="app__admin-link">
              Back to workspace
            </Link>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
