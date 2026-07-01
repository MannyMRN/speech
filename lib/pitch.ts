export interface PitchFormData {
  team_name: string;
  project_name: string;
  hook: string;
  problem: string;
  proof_count: number | string;
  proof_quote: string;
  speaker_1: string;
  solution: string;
  mvp: string;
  what_we_show: string;
  speaker_2: string;
  who_pays: string;
  money_model: string;
  cost_to_build: number | string;
  price_charged: number | string;
  num_customers: number | string;
  revenue_estimate: number | string;
  speaker_3: string;
  how_we_grow: string;
  the_ask: string;
  speaker_4: string;
}

export const EMPTY_PITCH: PitchFormData = {
  team_name: "",
  project_name: "",
  hook: "",
  problem: "",
  proof_count: "",
  proof_quote: "",
  speaker_1: "",
  solution: "",
  mvp: "",
  what_we_show: "",
  speaker_2: "",
  who_pays: "",
  money_model: "",
  cost_to_build: "",
  price_charged: "",
  num_customers: "",
  revenue_estimate: "",
  speaker_3: "",
  how_we_grow: "",
  the_ask: "",
  speaker_4: "",
};

// Every field except proof_quote is required.
export const REQUIRED_FIELDS: (keyof PitchFormData)[] = [
  "team_name",
  "project_name",
  "hook",
  "problem",
  "proof_count",
  "speaker_1",
  "solution",
  "mvp",
  "what_we_show",
  "speaker_2",
  "who_pays",
  "money_model",
  "cost_to_build",
  "price_charged",
  "num_customers",
  "revenue_estimate",
  "speaker_3",
  "how_we_grow",
  "the_ask",
  "speaker_4",
];

export const MONEY_MODEL_OPTIONS = [
  "One-time fee",
  "Monthly",
  "Per use",
  "Sponsorship",
  "Other",
];

export function buildSheetRow(data: PitchFormData): (string | number)[] {
  return [
    new Date().toISOString(),
    data.team_name,
    data.project_name,
    data.hook,
    data.problem,
    data.proof_count,
    data.proof_quote,
    data.speaker_1,
    data.solution,
    data.mvp,
    data.what_we_show,
    data.speaker_2,
    data.who_pays,
    data.money_model,
    data.cost_to_build,
    data.price_charged,
    data.num_customers,
    data.revenue_estimate,
    data.speaker_3,
    data.how_we_grow,
    data.the_ask,
    data.speaker_4,
  ];
}
