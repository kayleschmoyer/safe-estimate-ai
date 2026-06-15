import { z } from "zod";

export const TRADE_TYPES = [
  "hvac",
  "roofing",
  "plumbing",
  "landscaping",
  "general_contractor",
] as const;

export type TradeType = (typeof TRADE_TYPES)[number];

export const TRADE_LABELS: Record<TradeType, string> = {
  hvac: "HVAC",
  roofing: "Roofing",
  plumbing: "Plumbing",
  landscaping: "Landscaping",
  general_contractor: "General Contractor",
};

export const estimateFormSchema = z.object({
  tradeType: z.enum(TRADE_TYPES, {
    required_error: "Please select a trade type.",
    invalid_type_error: "Invalid trade type selected.",
  }),
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters.")
    .max(100, "Customer name must be 100 characters or fewer."),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters.")
    .max(200, "Address must be 200 characters or fewer."),
  jobNotes: z
    .string()
    .min(10, "Job notes must be at least 10 characters.")
    .max(3000, "Job notes must be 3,000 characters or fewer."),
  voiceMemoTranscript: z
    .string()
    .max(3000, "Voice memo transcript must be 3,000 characters or fewer.")
    .optional(),
  photoNotes: z
    .string()
    .max(3000, "Photo observations must be 3,000 characters or fewer.")
    .optional(),
  materialsNotes: z
    .string()
    .max(2000, "Materials notes must be 2,000 characters or fewer.")
    .optional(),
});

export type EstimateFormValues = z.infer<typeof estimateFormSchema>;

export type SafetyFlag = {
  type:
    | "missing_measurement"
    | "vague_scope"
    | "permit_uncertainty"
    | "low_price_confidence"
    | "safety_critical"
    | "exclusion_needed";
  severity: "warning" | "critical";
  message: string;
};

export type LineItem = {
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  total: string;
  notes?: string;
};

export type GeneratedEstimate = {
  estimateId: string;
  generatedAt: string;
  tradeLabel: string;
  customerName: string;
  address: string;
  scopeOfWork: string[];
  lineItems: LineItem[];
  subtotal: string;
  assumptions: string[];
  exclusions: string[];
  customerFacingNotes: string[];
  safetyFlags: SafetyFlag[];
  confidenceLevel: "low" | "medium" | "high";
  confidenceRationale: string;
  approved: boolean;
};
