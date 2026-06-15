import {
  type EstimateFormValues,
  type GeneratedEstimate,
  type LineItem,
  type SafetyFlag,
  TRADE_LABELS,
} from "./schema";
import { formatCurrency, generateEstimateId } from "./utils";

// ---------------------------------------------------------------------------
// Keyword helpers
// ---------------------------------------------------------------------------

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function combineInputs(form: EstimateFormValues): string {
  return [
    form.jobNotes,
    form.voiceMemoTranscript ?? "",
    form.photoNotes ?? "",
    form.materialsNotes ?? "",
  ].join(" ");
}

// ---------------------------------------------------------------------------
// Trade-specific line item templates
// ---------------------------------------------------------------------------

type LineItemTemplate = {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  notes?: string;
};

function getTradeLineItems(form: EstimateFormValues): LineItemTemplate[] {
  const allText = combineInputs(form).toLowerCase();

  const templates: Record<string, LineItemTemplate[]> = {
    hvac: getHvacLineItems(allText),
    roofing: getRoofingLineItems(allText),
    plumbing: getPlumbingLineItems(allText),
    landscaping: getLandscapingLineItems(allText),
    general_contractor: getGcLineItems(allText),
  };

  return templates[form.tradeType] ?? getGcLineItems(allText);
}

function getHvacLineItems(text: string): LineItemTemplate[] {
  const items: LineItemTemplate[] = [];

  if (containsAny(text, ["install", "replace", "new unit", "system"])) {
    items.push({
      description: "HVAC System Installation / Replacement",
      quantity: 1,
      unit: "unit",
      unitPrice: 3800,
      notes: "Includes disconnect, set, and reconnect. Unit cost varies by capacity.",
    });
  }
  if (containsAny(text, ["duct", "ductwork", "vent"])) {
    items.push({
      description: "Ductwork — Inspection & Sealing",
      quantity: 1,
      unit: "system",
      unitPrice: 650,
      notes: "Contractor to verify duct condition on-site before finalizing.",
    });
  }
  if (containsAny(text, ["thermostat", "smart thermostat"])) {
    items.push({
      description: "Smart Thermostat — Supply & Install",
      quantity: 1,
      unit: "unit",
      unitPrice: 280,
    });
  }
  if (containsAny(text, ["refrigerant", "charge", "freon", "r-22", "r-410"])) {
    items.push({
      description: "Refrigerant Charge — Diagnostic & Top-Off",
      quantity: 1,
      unit: "service",
      unitPrice: 350,
      notes: "Final charge amount TBD after leak check.",
    });
  }
  if (containsAny(text, ["filter", "coil", "cleaning", "tune-up", "maintenance"])) {
    items.push({
      description: "Annual Maintenance / Tune-Up",
      quantity: 1,
      unit: "visit",
      unitPrice: 175,
    });
  }

  // Default labor if nothing matched
  if (items.length === 0) {
    items.push({
      description: "HVAC Service — Diagnostic & Labor",
      quantity: 2,
      unit: "hr",
      unitPrice: 120,
      notes: "Estimated hours. Final time on-site may vary.",
    });
    items.push({
      description: "Materials & Parts — Estimated",
      quantity: 1,
      unit: "allowance",
      unitPrice: 200,
      notes: "Actual materials TBD after diagnostic.",
    });
  }

  items.push({
    description: "Permit & Inspection (if required)",
    quantity: 1,
    unit: "allowance",
    unitPrice: 150,
    notes: "Permit requirements vary by jurisdiction. Contractor to verify.",
  });

  return items;
}

function getRoofingLineItems(text: string): LineItemTemplate[] {
  const items: LineItemTemplate[] = [];

  if (containsAny(text, ["full replace", "full roof", "tear off", "new roof"])) {
    items.push({
      description: "Tear-Off & Haul Away — Existing Roofing",
      quantity: 1,
      unit: "roof",
      unitPrice: 1200,
      notes: "Estimated for standard single-story. Price scales with square footage.",
    });
    items.push({
      description: "Architectural Shingles — Supply & Install",
      quantity: 25,
      unit: "square",
      unitPrice: 220,
      notes: "25 squares estimated. Exact measurement required before final quote.",
    });
    items.push({
      description: "Underlayment & Ice/Water Shield",
      quantity: 25,
      unit: "square",
      unitPrice: 35,
    });
    items.push({
      description: "Ridge Cap, Flashing & Drip Edge",
      quantity: 1,
      unit: "system",
      unitPrice: 480,
    });
  } else if (containsAny(text, ["repair", "patch", "leak", "missing shingles"])) {
    items.push({
      description: "Roof Repair — Labor & Materials",
      quantity: 1,
      unit: "job",
      unitPrice: 650,
      notes: "Scope estimated from notes. On-site inspection required to confirm.",
    });
    items.push({
      description: "Flashing Repair / Replacement",
      quantity: 1,
      unit: "allowance",
      unitPrice: 280,
      notes: "Only if applicable. Confirmed on inspection.",
    });
  } else {
    items.push({
      description: "Roofing — Labor",
      quantity: 1,
      unit: "job",
      unitPrice: 900,
      notes: "Estimated. Requires on-site measurement for final pricing.",
    });
    items.push({
      description: "Materials — Allowance",
      quantity: 1,
      unit: "allowance",
      unitPrice: 800,
    });
  }

  items.push({
    description: "Permit & Inspection",
    quantity: 1,
    unit: "allowance",
    unitPrice: 200,
    notes: "Permit requirements vary by municipality. Contractor to verify.",
  });

  return items;
}

function getPlumbingLineItems(text: string): LineItemTemplate[] {
  const items: LineItemTemplate[] = [];

  if (containsAny(text, ["water heater", "hot water heater", "tank"])) {
    items.push({
      description: "Water Heater — Supply & Install (40-50 gal)",
      quantity: 1,
      unit: "unit",
      unitPrice: 1400,
      notes: "Final unit type and cost confirmed after customer selection.",
    });
    items.push({
      description: "Haul Away Old Unit",
      quantity: 1,
      unit: "unit",
      unitPrice: 75,
    });
  }
  if (containsAny(text, ["drain", "clog", "blockage", "slow drain"])) {
    items.push({
      description: "Drain Clearing — Auger / Hydro-Jet",
      quantity: 1,
      unit: "drain",
      unitPrice: 250,
      notes: "Hydro-jetting may be required at additional cost if auger is insufficient.",
    });
  }
  if (containsAny(text, ["faucet", "fixture", "replace faucet", "leak faucet"])) {
    items.push({
      description: "Faucet Replacement — Labor",
      quantity: 1,
      unit: "fixture",
      unitPrice: 180,
      notes: "Customer to supply fixture unless otherwise agreed.",
    });
  }
  if (containsAny(text, ["pipe", "repipe", "leak pipe", "burst"])) {
    items.push({
      description: "Pipe Repair / Section Replacement",
      quantity: 1,
      unit: "job",
      unitPrice: 750,
      notes: "Scope requires on-site inspection to confirm.",
    });
  }

  if (items.length === 0) {
    items.push({
      description: "Plumbing Service — Diagnostic & Labor",
      quantity: 1.5,
      unit: "hr",
      unitPrice: 135,
      notes: "Estimated hours. Final time on-site may vary.",
    });
    items.push({
      description: "Parts & Materials — Estimated Allowance",
      quantity: 1,
      unit: "allowance",
      unitPrice: 150,
    });
  }

  items.push({
    description: "Permit (if required by scope)",
    quantity: 1,
    unit: "allowance",
    unitPrice: 125,
    notes: "Permit requirements depend on scope and local code. Contractor to verify.",
  });

  return items;
}

function getLandscapingLineItems(text: string): LineItemTemplate[] {
  const items: LineItemTemplate[] = [];

  if (containsAny(text, ["mow", "mowing", "lawn", "grass"])) {
    items.push({
      description: "Lawn Mowing & Edge Trimming",
      quantity: 1,
      unit: "visit",
      unitPrice: 85,
      notes: "Pricing for standard residential lot up to 1/4 acre.",
    });
  }
  if (containsAny(text, ["mulch", "bed", "flower bed", "garden bed"])) {
    items.push({
      description: "Mulch Supply & Installation",
      quantity: 5,
      unit: "yard",
      unitPrice: 65,
      notes: "5 cubic yards estimated. Exact quantity depends on bed measurements.",
    });
  }
  if (containsAny(text, ["tree", "trim tree", "prune", "removal"])) {
    items.push({
      description: "Tree Trimming / Removal — Labor",
      quantity: 1,
      unit: "job",
      unitPrice: 450,
      notes: "Price estimate only. Requires visual inspection of tree(s) before finalizing.",
    });
    items.push({
      description: "Debris Haul-Away",
      quantity: 1,
      unit: "load",
      unitPrice: 150,
    });
  }
  if (containsAny(text, ["sod", "seed", "reseed", "new lawn"])) {
    items.push({
      description: "Sod / Seed Installation",
      quantity: 500,
      unit: "sqft",
      unitPrice: 0.75,
      notes: "500 sqft estimated. Measure required before final quote.",
    });
  }
  if (containsAny(text, ["irrigation", "sprinkler", "drip"])) {
    items.push({
      description: "Irrigation System — Service / Install",
      quantity: 1,
      unit: "job",
      unitPrice: 1200,
      notes: "Full scope and zoning TBD on-site.",
    });
  }

  if (items.length === 0) {
    items.push({
      description: "Landscaping Services — Labor",
      quantity: 4,
      unit: "hr",
      unitPrice: 75,
      notes: "Estimated hours. Final time on-site may vary.",
    });
    items.push({
      description: "Materials — Estimated Allowance",
      quantity: 1,
      unit: "allowance",
      unitPrice: 200,
    });
  }

  return items;
}

function getGcLineItems(text: string): LineItemTemplate[] {
  const items: LineItemTemplate[] = [];

  if (containsAny(text, ["demo", "demolition", "tear out"])) {
    items.push({
      description: "Demolition & Haul Away",
      quantity: 1,
      unit: "job",
      unitPrice: 850,
      notes: "Scope based on notes. Confirm on-site before proceeding.",
    });
  }
  if (containsAny(text, ["framing", "frame", "wall", "structural"])) {
    items.push({
      description: "Framing — Labor & Materials",
      quantity: 1,
      unit: "job",
      unitPrice: 2400,
      notes: "Requires structural review and measurements before finalizing.",
    });
  }
  if (containsAny(text, ["drywall", "sheetrock"])) {
    items.push({
      description: "Drywall — Supply, Hang & Finish",
      quantity: 400,
      unit: "sqft",
      unitPrice: 3.5,
      notes: "400 sqft estimated. Verify measurements on-site.",
    });
  }
  if (containsAny(text, ["paint", "painting", "prime"])) {
    items.push({
      description: "Interior Painting — Labor & Materials",
      quantity: 1,
      unit: "job",
      unitPrice: 1800,
      notes: "Rooms/surfaces and color selections TBD with customer.",
    });
  }
  if (containsAny(text, ["floor", "flooring", "tile", "hardwood", "lvp", "vinyl"])) {
    items.push({
      description: "Flooring — Supply & Install",
      quantity: 400,
      unit: "sqft",
      unitPrice: 6.5,
      notes: "Estimate based on 400 sqft. Material selection affects final price.",
    });
  }

  if (items.length === 0) {
    items.push({
      description: "General Construction — Labor",
      quantity: 8,
      unit: "hr",
      unitPrice: 95,
      notes: "Estimated hours. Scope requires on-site verification.",
    });
    items.push({
      description: "Materials — Estimated Allowance",
      quantity: 1,
      unit: "allowance",
      unitPrice: 500,
    });
  }

  items.push({
    description: "Permit & Inspection (if required)",
    quantity: 1,
    unit: "allowance",
    unitPrice: 250,
    notes: "Permit type and cost vary by project scope and municipality.",
  });

  return items;
}

// ---------------------------------------------------------------------------
// Safety flag detection
// ---------------------------------------------------------------------------

function detectSafetyFlags(form: EstimateFormValues): SafetyFlag[] {
  const flags: SafetyFlag[] = [];
  const allText = combineInputs(form).toLowerCase();

  // Missing measurements
  const hasMeasurements = containsAny(allText, [
    "sqft", "sq ft", "square feet", "linear feet", "lf", "sq. ft",
    "square foot", "acres", "yard", "foot", "feet", "inch", "inches",
    "ton", "btu", "gallon",
  ]);
  if (!hasMeasurements) {
    flags.push({
      type: "missing_measurement",
      severity: "warning",
      message:
        "No measurements detected in job notes. Line item quantities are estimates only. Verify all dimensions on-site before finalizing pricing.",
    });
  }

  // Vague scope
  const vagueTerms = ["fix it", "repair stuff", "look at it", "check it", "general work", "misc", "some work"];
  if (containsAny(allText, vagueTerms) || form.jobNotes.split(" ").length < 8) {
    flags.push({
      type: "vague_scope",
      severity: "warning",
      message:
        "Scope of work may be too vague to produce an accurate estimate. Review and clarify the scope before presenting to the customer.",
    });
  }

  // Permit / code uncertainty
  const permitKeywords = [
    "electrical", "gas line", "gas", "load bearing", "structural",
    "permit", "code", "hvac install", "water heater", "repipe", "addition",
    "roof replace", "solar",
  ];
  if (containsAny(allText, permitKeywords)) {
    flags.push({
      type: "permit_uncertainty",
      severity: "critical",
      message:
        "This job may require permits or inspections. Permit requirements, fees, and timelines vary by jurisdiction. Contractor must verify with local authorities before committing to a start date or price.",
    });
  }

  // Safety-critical claims
  const safetyCritical = [
    "guaranteed", "guarantee", "warranty", "code-compliant", "insured",
    "approved", "safe for use", "structurally sound", "no permit needed",
  ];
  if (containsAny(allText, safetyCritical)) {
    flags.push({
      type: "safety_critical",
      severity: "critical",
      message:
        "The job notes contain language that could imply a guarantee, warranty, or code/legal conclusion. Remove or qualify such claims in the final customer-facing estimate.",
    });
  }

  // Low price confidence — short notes
  const noteWords = allText.split(/\s+/).filter(Boolean).length;
  if (noteWords < 20) {
    flags.push({
      type: "low_price_confidence",
      severity: "warning",
      message:
        "Limited job details were provided. Pricing confidence is low. Add more detail to improve estimate accuracy.",
    });
  }

  // Exclusion needed
  if (
    containsAny(allText, ["mold", "asbestos", "hazmat", "lead", "buried", "unknown"]) ||
    (form.tradeType === "roofing" && !containsAny(allText, ["deck", "sheathing"]))
  ) {
    flags.push({
      type: "exclusion_needed",
      severity: "warning",
      message:
        "Potential hidden conditions (mold, asbestos, structural issues, unknown site conditions) should be explicitly excluded from the estimate scope.",
    });
  }

  return flags;
}

// ---------------------------------------------------------------------------
// Scope of work text
// ---------------------------------------------------------------------------

function buildScopeOfWork(form: EstimateFormValues, items: LineItemTemplate[]): string[] {
  const allText = combineInputs(form);
  const scopeLines: string[] = [];

  const tradeLabel = TRADE_LABELS[form.tradeType];
  scopeLines.push(
    `Provide ${tradeLabel.toLowerCase()} services at the property located at ${form.address}.`
  );

  items
    .filter((item) => !item.description.toLowerCase().includes("permit"))
    .forEach((item) => {
      scopeLines.push(`${item.description}: ${item.quantity} ${item.unit}.`);
    });

  if (allText.trim().length > 20) {
    scopeLines.push(
      "Additional scope details to be confirmed on-site prior to commencement of work."
    );
  }

  return scopeLines;
}

// ---------------------------------------------------------------------------
// Assumptions
// ---------------------------------------------------------------------------

function buildAssumptions(form: EstimateFormValues): string[] {
  const base: string[] = [
    "Work will be performed during standard business hours (Mon–Fri, 7am–5pm) unless otherwise agreed.",
    "Customer will provide reasonable site access for crew and equipment.",
    "Pricing is based on the job details provided. Actual costs may vary after on-site inspection.",
    "Estimate is valid for 30 days from the date of issue.",
  ];

  const allText = combineInputs(form).toLowerCase();

  if (form.tradeType === "roofing") {
    base.push(
      "Estimate assumes one layer of existing roofing material. Additional layers will incur extra tear-off charges.",
      "Roof decking/sheathing is assumed to be sound. Damaged decking replacement is not included.",
    );
  }
  if (form.tradeType === "hvac") {
    base.push(
      "Existing electrical service and disconnect are assumed to be adequate for new equipment.",
      "Equipment selection and exact model to be confirmed prior to ordering.",
    );
  }
  if (form.tradeType === "plumbing") {
    base.push(
      "Walls and surfaces will be left in a 'rough' condition unless drywall repair is explicitly included.",
      "Existing shut-off valves are assumed to be functional.",
    );
  }
  if (form.tradeType === "landscaping") {
    base.push(
      "Customer is responsible for marking irrigation lines and utility flags before work begins.",
    );
  }
  if (form.tradeType === "general_contractor") {
    base.push(
      "Sub-trade work (electrical, plumbing, HVAC) is not included unless explicitly listed.",
    );
  }

  if (!containsAny(allText, ["haul", "dispose", "remove debris"])) {
    base.push("Debris and material removal is included unless otherwise noted.");
  }

  return base;
}

// ---------------------------------------------------------------------------
// Exclusions
// ---------------------------------------------------------------------------

function buildExclusions(form: EstimateFormValues): string[] {
  const base: string[] = [
    "Any work not explicitly listed in the scope above.",
    "Hidden, concealed, or unknown conditions discovered during work.",
    "Hazardous materials (asbestos, mold, lead paint) remediation.",
    "Permit fees (a permit allowance is included as a separate line item where applicable).",
    "Engineering, architectural drawings, or specialty inspections.",
    "Work to bring existing conditions up to current code (unless explicitly scoped).",
  ];

  if (form.tradeType === "roofing") {
    base.push(
      "Structural or framing repairs.",
      "Fascia, soffit, and gutter work (unless explicitly scoped).",
      "Interior water damage repair.",
    );
  }
  if (form.tradeType === "hvac") {
    base.push(
      "Electrical panel upgrades.",
      "Gas line installation or extension.",
      "Duct replacement beyond what is listed.",
    );
  }
  if (form.tradeType === "plumbing") {
    base.push(
      "Water damage remediation or drywall restoration.",
      "Sewer line or main line work (unless explicitly scoped).",
    );
  }
  if (form.tradeType === "general_contractor") {
    base.push(
      "Furnishings, appliances, or finish hardware (unless explicitly listed).",
      "Landscaping or exterior site work.",
    );
  }

  return base;
}

// ---------------------------------------------------------------------------
// Customer-facing notes
// ---------------------------------------------------------------------------

function buildCustomerNotes(): string[] {
  return [
    "This is a draft estimate prepared by your contractor with AI drafting assistance. It has been reviewed and approved by a licensed professional before being shared with you.",
    "Prices shown are estimates based on the information available at the time of drafting. Final pricing may differ after on-site inspection.",
    "This estimate does not constitute a final contract. A formal written agreement will be provided before work begins.",
    "Permit requirements, timelines, and availability are subject to change. Your contractor will confirm these details.",
    "Questions? Contact your contractor directly. Do not rely solely on this document for project planning.",
  ];
}

// ---------------------------------------------------------------------------
// Confidence calculation
// ---------------------------------------------------------------------------

function calculateConfidence(
  form: EstimateFormValues,
  flags: SafetyFlag[]
): { level: "low" | "medium" | "high"; rationale: string } {
  const allText = combineInputs(form);
  const wordCount = allText.split(/\s+/).filter(Boolean).length;
  const criticalFlags = flags.filter((f) => f.severity === "critical").length;
  const warningFlags = flags.filter((f) => f.severity === "warning").length;
  const hasMeasurements = flags.find((f) => f.type === "missing_measurement") == null;

  let score = 0;

  if (wordCount >= 50) score += 2;
  else if (wordCount >= 20) score += 1;

  if (hasMeasurements) score += 2;

  score -= criticalFlags * 2;
  score -= warningFlags;

  if (score >= 3) {
    return {
      level: "high",
      rationale:
        "Sufficient job detail and measurements were provided to support a reasonably accurate draft estimate.",
    };
  } else if (score >= 1) {
    return {
      level: "medium",
      rationale:
        "Moderate detail provided. Some assumptions were required. Recommend on-site verification before finalizing.",
    };
  } else {
    return {
      level: "low",
      rationale:
        "Limited detail or significant unknowns detected. This estimate requires significant verification before it can be treated as accurate.",
    };
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function generateEstimate(form: EstimateFormValues): GeneratedEstimate {
  const tradeItems = getTradeLineItems(form);
  const safetyFlags = detectSafetyFlags(form);
  const confidence = calculateConfidence(form, safetyFlags);

  // Build line items with formatted prices
  const lineItems: LineItem[] = tradeItems.map((item) => ({
    description: item.description,
    quantity: item.quantity % 1 === 0 ? String(item.quantity) : item.quantity.toFixed(1),
    unit: item.unit,
    unitPrice: formatCurrency(item.unitPrice),
    total: formatCurrency(item.quantity * item.unitPrice),
    notes: item.notes,
  }));

  // Compute subtotal
  const subtotalRaw = tradeItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return {
    estimateId: generateEstimateId(),
    generatedAt: new Date().toISOString(),
    tradeLabel: TRADE_LABELS[form.tradeType],
    customerName: form.customerName,
    address: form.address,
    scopeOfWork: buildScopeOfWork(form, tradeItems),
    lineItems,
    subtotal: formatCurrency(subtotalRaw),
    assumptions: buildAssumptions(form),
    exclusions: buildExclusions(form),
    customerFacingNotes: buildCustomerNotes(),
    safetyFlags,
    confidenceLevel: confidence.level,
    confidenceRationale: confidence.rationale,
    approved: false,
  };
}
