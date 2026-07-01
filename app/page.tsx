"use client";

import { useMemo, useState } from "react";
import FormField, { Select, TextArea, TextInput } from "@/components/FormField";
import SectionCard from "@/components/SectionCard";
import {
  EMPTY_PITCH,
  MONEY_MODEL_OPTIONS,
  PitchFormData,
  REQUIRED_FIELDS,
} from "@/lib/pitch";

type Errors = Partial<Record<keyof PitchFormData, string>>;

export default function Home() {
  const [form, setForm] = useState<PitchFormData>(EMPTY_PITCH);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const revenueHint = useMemo(() => {
    const price = Number(form.price_charged);
    const customers = Number(form.num_customers);
    if (price > 0 && customers > 0) {
      return `Hint: ${price} × ${customers} = $${price * customers}`;
    }
    return undefined;
  }, [form.price_charged, form.num_customers]);

  function update<K extends keyof PitchFormData>(field: K, value: PitchFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const nextErrors: Errors = {};
    for (const field of REQUIRED_FIELDS) {
      const value = form[field];
      if (value === undefined || value === null || String(value).trim() === "") {
        nextErrors[field] = "This field is required.";
      }
    }
    if (
      form.proof_count !== "" &&
      (Number(form.proof_count) < 0 || Number(form.proof_count) > 5)
    ) {
      nextErrors.proof_count = "Enter a number between 0 and 5.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      const firstError = document.querySelector("[data-error='true']");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(EMPTY_PITCH);
    setErrors({});
    setSubmitError(null);
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-6xl">🦈</p>
        <h1 className="mt-6 text-3xl font-extrabold text-foreground sm:text-4xl">
          Pitch submitted!
        </h1>
        <p className="mt-3 max-w-md text-muted">
          Good luck up there. The sharks are waiting — go get that deal.
        </p>
        <button
          onClick={resetForm}
          className="mt-8 rounded-full bg-gold px-6 py-3 text-sm font-bold text-black transition hover:bg-gold-dark"
        >
          Submit another team&rsquo;s pitch
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-money">
            Bossmoves
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Shark Tank <span className="text-gold">Finale Pitch</span>
          </h1>
          <p className="mt-3 text-muted">
            Fill out your team&rsquo;s pitch below. Every field with a{" "}
            <span className="text-gold">*</span> is required.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <SectionCard eyebrow="Team Info" title="Who's pitching?">
            <FormField label="Team Name" htmlFor="team_name" error={errors.team_name}>
              <TextInput
                id="team_name"
                data-error={!!errors.team_name}
                value={form.team_name}
                onChange={(e) => update("team_name", e.target.value)}
                placeholder="e.g. The Money Makers"
              />
            </FormField>
            <FormField
              label="Project Name"
              htmlFor="project_name"
              error={errors.project_name}
            >
              <TextInput
                id="project_name"
                data-error={!!errors.project_name}
                value={form.project_name}
                onChange={(e) => update("project_name", e.target.value)}
                placeholder="e.g. SnackTrack"
              />
            </FormField>
          </SectionCard>

          <SectionCard eyebrow="Slide 1" title="Hook + Problem">
            <FormField label="Your Hook" htmlFor="hook" error={errors.hook}>
              <TextArea
                id="hook"
                data-error={!!errors.hook}
                value={form.hook}
                onChange={(e) => update("hook", e.target.value)}
                placeholder="Grab their attention in the first 10 seconds..."
              />
            </FormField>
            <FormField
              label="The Problem (one sentence)"
              htmlFor="problem"
              error={errors.problem}
            >
              <TextInput
                id="problem"
                data-error={!!errors.problem}
                value={form.problem}
                onChange={(e) => update("problem", e.target.value)}
                placeholder="What problem are you solving?"
              />
            </FormField>
            <FormField
              label="Proof: how many of 5 people said this problem is real"
              htmlFor="proof_count"
              error={errors.proof_count}
            >
              <TextInput
                id="proof_count"
                data-error={!!errors.proof_count}
                type="number"
                min={0}
                max={5}
                value={form.proof_count}
                onChange={(e) => update("proof_count", e.target.value)}
              />
            </FormField>
            <FormField
              label="Quote"
              htmlFor="proof_quote"
              required={false}
            >
              <TextInput
                id="proof_quote"
                value={form.proof_quote}
                onChange={(e) => update("proof_quote", e.target.value)}
                placeholder="What did someone actually say?"
              />
            </FormField>
            <FormField
              label="Speaker for this slide"
              htmlFor="speaker_1"
              error={errors.speaker_1}
            >
              <TextInput
                id="speaker_1"
                data-error={!!errors.speaker_1}
                value={form.speaker_1}
                onChange={(e) => update("speaker_1", e.target.value)}
              />
            </FormField>
          </SectionCard>

          <SectionCard eyebrow="Slide 2" title="Solution + MVP">
            <FormField label="Our Solution" htmlFor="solution" error={errors.solution}>
              <TextArea
                id="solution"
                data-error={!!errors.solution}
                value={form.solution}
                onChange={(e) => update("solution", e.target.value)}
                placeholder="How does it solve the problem?"
              />
            </FormField>
            <FormField
              label="Our MVP (smallest first version)"
              htmlFor="mvp"
              error={errors.mvp}
            >
              <TextArea
                id="mvp"
                data-error={!!errors.mvp}
                value={form.mvp}
                onChange={(e) => update("mvp", e.target.value)}
                placeholder="What's the simplest version you could build first?"
              />
            </FormField>
            <FormField
              label="What We'll Show"
              htmlFor="what_we_show"
              hint="Describe your sketch/mockup."
              error={errors.what_we_show}
            >
              <TextArea
                id="what_we_show"
                data-error={!!errors.what_we_show}
                value={form.what_we_show}
                onChange={(e) => update("what_we_show", e.target.value)}
                placeholder="Describe what you'll show the judges..."
              />
            </FormField>
            <FormField
              label="Speaker for this slide"
              htmlFor="speaker_2"
              error={errors.speaker_2}
            >
              <TextInput
                id="speaker_2"
                data-error={!!errors.speaker_2}
                value={form.speaker_2}
                onChange={(e) => update("speaker_2", e.target.value)}
              />
            </FormField>
          </SectionCard>

          <SectionCard eyebrow="Slide 3" title="Who Pays + Numbers">
            <FormField label="Who Pays" htmlFor="who_pays" error={errors.who_pays}>
              <TextInput
                id="who_pays"
                data-error={!!errors.who_pays}
                value={form.who_pays}
                onChange={(e) => update("who_pays", e.target.value)}
                placeholder="Who's handing over the money?"
              />
            </FormField>
            <FormField
              label="How Money Comes In"
              htmlFor="money_model"
              error={errors.money_model}
            >
              <Select
                id="money_model"
                data-error={!!errors.money_model}
                value={form.money_model}
                onChange={(e) => update("money_model", e.target.value)}
              >
                <option value="" disabled>
                  Select one...
                </option>
                {MONEY_MODEL_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormField>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label="Cost to build first one ($)"
                htmlFor="cost_to_build"
                error={errors.cost_to_build}
              >
                <TextInput
                  id="cost_to_build"
                  data-error={!!errors.cost_to_build}
                  type="number"
                  min={0}
                  value={form.cost_to_build}
                  onChange={(e) => update("cost_to_build", e.target.value)}
                />
              </FormField>
              <FormField
                label="Price charged ($)"
                htmlFor="price_charged"
                error={errors.price_charged}
              >
                <TextInput
                  id="price_charged"
                  data-error={!!errors.price_charged}
                  type="number"
                  min={0}
                  value={form.price_charged}
                  onChange={(e) => update("price_charged", e.target.value)}
                />
              </FormField>
              <FormField
                label="Number of customers"
                htmlFor="num_customers"
                error={errors.num_customers}
              >
                <TextInput
                  id="num_customers"
                  data-error={!!errors.num_customers}
                  type="number"
                  min={0}
                  value={form.num_customers}
                  onChange={(e) => update("num_customers", e.target.value)}
                />
              </FormField>
              <FormField
                label="Revenue estimate ($)"
                htmlFor="revenue_estimate"
                hint={revenueHint}
                error={errors.revenue_estimate}
              >
                <TextInput
                  id="revenue_estimate"
                  data-error={!!errors.revenue_estimate}
                  type="number"
                  min={0}
                  value={form.revenue_estimate}
                  onChange={(e) => update("revenue_estimate", e.target.value)}
                />
              </FormField>
            </div>
            <FormField
              label="Speaker for this slide"
              htmlFor="speaker_3"
              error={errors.speaker_3}
            >
              <TextInput
                id="speaker_3"
                data-error={!!errors.speaker_3}
                value={form.speaker_3}
                onChange={(e) => update("speaker_3", e.target.value)}
              />
            </FormField>
          </SectionCard>

          <SectionCard eyebrow="Slide 4" title="How We Grow + The Ask">
            <FormField
              label="How We Grow (one line)"
              htmlFor="how_we_grow"
              error={errors.how_we_grow}
            >
              <TextInput
                id="how_we_grow"
                data-error={!!errors.how_we_grow}
                value={form.how_we_grow}
                onChange={(e) => update("how_we_grow", e.target.value)}
                placeholder="What's your growth plan?"
              />
            </FormField>
            <FormField
              label="Our Ask to the Judges"
              htmlFor="the_ask"
              error={errors.the_ask}
            >
              <TextArea
                id="the_ask"
                data-error={!!errors.the_ask}
                value={form.the_ask}
                onChange={(e) => update("the_ask", e.target.value)}
                placeholder="What do you want from the sharks?"
              />
            </FormField>
            <FormField
              label="Speaker for this slide"
              htmlFor="speaker_4"
              error={errors.speaker_4}
            >
              <TextInput
                id="speaker_4"
                data-error={!!errors.speaker_4}
                value={form.speaker_4}
                onChange={(e) => update("speaker_4", e.target.value)}
              />
            </FormField>
          </SectionCard>

          {submitError && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-gold px-6 py-4 text-lg font-extrabold text-black shadow-lg shadow-gold/20 transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Our Pitch 🦈"}
          </button>
        </form>
      </div>
    </main>
  );
}
