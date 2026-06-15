import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertIcon } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Safety Center — Safe Estimate AI",
  description:
    "Learn how Safe Estimate AI puts safety and professional accountability first in every AI-assisted draft estimate.",
};

const principles = [
  {
    icon: "🚫",
    title: "No Automatic Sending",
    description:
      "AI-generated estimates are never sent to customers automatically. Every estimate must be explicitly approved by a licensed contractor before it leaves the building.",
    detail:
      "We believe automatic AI-to-customer communication is dangerous in the trades. A single wrong number, misunderstood scope, or missing exclusion can cost thousands of dollars or damage a professional relationship. We prevent that by requiring a human in the loop, always.",
  },
  {
    icon: "📝",
    title: "No Guaranteed Prices",
    description:
      "Prices shown in AI-generated estimates are approximations based on the information provided. They are not binding quotes, final bids, or guarantees.",
    detail:
      "Accurate pricing in the trades depends on site conditions, material availability, labor market rates, subcontractor costs, and dozens of other factors that cannot be captured in a form. We make this explicit in every estimate and require contractors to verify pricing before approval.",
  },
  {
    icon: "⚖️",
    title: "No Permit, Code, or Legal Conclusions",
    description:
      "Safe Estimate AI does not determine permit requirements, confirm code compliance, or provide legal advice. These determinations require licensed professionals and local authorities.",
    detail:
      "Permit requirements vary by municipality, project scope, and jurisdiction. Code compliance depends on the specific version of codes adopted by a local authority and the conditions of the project. We flag jobs that likely require permits and tell contractors to verify — we never make the determination ourselves.",
  },
  {
    icon: "🔒",
    title: "Privacy-Minded Data Handling",
    description:
      "Job data entered into this tool is used only to generate the draft estimate. We are designed to minimize data retention and exposure.",
    detail:
      "In this MVP, all estimate data is processed locally in your browser using sessionStorage — no job data is sent to a server or third-party AI provider. In a production implementation, we would use server-side encryption, row-level access controls, and clearly communicated data retention policies.",
  },
  {
    icon: "📋",
    title: "Audit Trail Mindset",
    description:
      "Every estimate includes metadata: when it was generated, a unique estimate ID, and a confidence level. These exist to support auditability.",
    detail:
      "Good estimating practice means being able to explain where a number came from. Our estimates surface assumptions, exclusions, and risk flags alongside pricing — so contractors can explain every line item to a customer or, if necessary, defend it in a dispute.",
  },
  {
    icon: "👷",
    title: "Professional Verification Required",
    description:
      "AI is an assistant. The licensed professional reviewing and approving the estimate is the expert. We reinforce this at every step.",
    detail:
      "The contractor approval step is not a formality — it is a deliberate friction point. By requiring a checkbox and acknowledgment of professional responsibility, we make it clear that the contractor is the decision maker and accountable party, not the AI.",
  },
  {
    icon: "⚠️",
    title: "Safety Flags Are Mandatory, Not Optional",
    description:
      "When the AI detects potentially risky conditions (vague scope, missing measurements, permit uncertainty), it surfaces those flags prominently — not buried in fine print.",
    detail:
      "We show safety flags before the line items, not after. A contractor should see the risks before they review pricing. Hiding or minimizing safety concerns would be a failure of our core mission.",
  },
  {
    icon: "🤝",
    title: "Safety-Critical Claims Are Off-Limits",
    description:
      "The AI will never generate language claiming structural soundness, safety certification, insurance approval, or code compliance.",
    detail:
      "These claims expose contractors and customers to serious liability. If AI-generated language were to include 'this meets code' or 'structurally sound,' a homeowner might rely on that language when making critical decisions. We block these claims at the generation level.",
  },
];

const neverList = [
  "Claim that an estimate is a final or binding quote",
  "State that a job meets code or passes inspection",
  "Confirm that a permit is or is not required",
  "Guarantee pricing, timelines, or outcomes",
  "Recommend a specific insurance coverage decision",
  "State that a structure, system, or material is 'safe'",
  "Send an estimate to a customer without contractor approval",
  "Retain personally identifiable job data without user consent",
];

const alwaysList = [
  "Label AI-generated estimates as drafts until approved",
  "Surface safety flags prominently before line items",
  "Include assumptions and exclusions in every estimate",
  "Require a contractor to explicitly acknowledge professional responsibility",
  "Provide a confidence level and rationale for every estimate",
  "Include customer-facing notes clarifying the estimate's limitations",
  "Flag jobs that likely require permits for contractor verification",
];

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4">Safety Center</Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🛡️ Safety-First by Design
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Safe Estimate AI was built around a single belief: AI should make
          contractors more capable and confident — never replace their
          professional judgment or expose customers to unreviewed AI output.
        </p>
      </div>

      {/* Core promise */}
      <Alert variant="info" className="mb-10">
        <AlertIcon variant="info" />
        <div>
          <strong>Our core promise:</strong> No estimate generated by Safe
          Estimate AI will ever reach a customer without being reviewed and
          explicitly approved by a licensed professional. This is not a
          configurable setting — it is the product.
        </div>
      </Alert>

      {/* Safety principles */}
      <div className="grid gap-6 mb-12">
        {principles.map((p) => (
          <Card key={p.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {p.icon}
                </span>
                {p.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-800 font-medium">{p.description}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{p.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Never / Always lists */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-700">
              🚫 Safe Estimate AI will NEVER
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {neverList.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="text-red-500 flex-shrink-0 mt-0.5 font-bold">
                    ✗
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">
              ✅ Safe Estimate AI will ALWAYS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {alwaysList.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="text-green-500 flex-shrink-0 mt-0.5 font-bold">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* MVP disclaimer */}
      <Card className="bg-gray-50 border-gray-200 mb-10">
        <CardHeader>
          <CardTitle className="text-gray-700">
            📌 About This MVP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <p>
            This is an early prototype demonstrating the core workflow and
            safety principles of Safe Estimate AI. In this version:
          </p>
          <ul className="space-y-1 ml-4">
            <li>
              • All estimate generation is local and deterministic (no AI API
              required)
            </li>
            <li>
              • No estimate data is sent to a server or third-party service
            </li>
            <li>
              • Estimate data is stored temporarily in your browser&apos;s
              sessionStorage
            </li>
            <li>
              • Photo uploads and voice transcription are simulated via text
              input
            </li>
            <li>
              • PDF export, user accounts, and persistent storage are not yet
              implemented
            </li>
          </ul>
          <p className="pt-2">
            These are intentional MVP limitations, not workarounds. A
            production version would include server-side AI (with structured
            outputs and guardrails), proper auth, encrypted storage, audit
            logs, and a PDF export pipeline.
          </p>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <p className="text-gray-600 mb-6">
          Ready to try the safety-first estimating workflow?
        </p>
        <Link href="/estimate">
          <Button
            size="lg"
            className="bg-brand-700 hover:bg-brand-800 text-white font-semibold"
          >
            Draft an Estimate →
          </Button>
        </Link>
      </div>
    </div>
  );
}
