import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

const features = [
  {
    icon: "🛡️",
    title: "Safety-First by Design",
    description:
      "No estimate is ever sent automatically. Every draft requires explicit contractor approval before reaching a customer.",
  },
  {
    icon: "🔍",
    title: "Human Review Required",
    description:
      "AI surfaces structure and line items. You verify, adjust, and approve. The final call is always yours.",
  },
  {
    icon: "⚠️",
    title: "Risk Flag Detection",
    description:
      "Automatically flags missing measurements, vague scope, permit uncertainties, and low-confidence pricing.",
  },
  {
    icon: "📋",
    title: "Structured Drafts",
    description:
      "Messy job notes become organized scope of work, line items, assumptions, and exclusions — ready to review.",
  },
  {
    icon: "🎙️",
    title: "Multiple Input Types",
    description:
      "Enter job notes, paste voice memo transcripts, or describe photo observations — all in one place.",
  },
  {
    icon: "🏗️",
    title: "Built for the Trades",
    description:
      "Designed for HVAC, roofing, plumbing, landscaping, and general contractors. Trade-specific logic baked in.",
  },
];

const trades = [
  { name: "HVAC", emoji: "❄️" },
  { name: "Roofing", emoji: "🏠" },
  { name: "Plumbing", emoji: "🔧" },
  { name: "Landscaping", emoji: "🌿" },
  { name: "General Contractor", emoji: "🏗️" },
];

const safetyPrinciples = [
  "AI never sends estimates to customers",
  "Every estimate labeled DRAFT until approved",
  "Pricing flagged as estimates, not guarantees",
  "Permit/code questions always escalated to professionals",
  "No legally binding language generated",
  "Privacy-first data handling",
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              🛡️ Safety-First AI Estimating
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Estimate drafting for the trades.{" "}
              <span className="text-brand-300">With a human in the loop.</span>
            </h1>
            <p className="text-xl md:text-2xl text-brand-100 mb-8 leading-relaxed">
              Turn messy job notes, voice memos, and photo observations into
              structured draft estimates — then review, approve, and send with
              confidence. AI assists. You decide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/estimate">
                <Button
                  size="lg"
                  className="bg-white text-brand-900 hover:bg-brand-50 font-semibold text-lg px-8"
                >
                  Draft an Estimate →
                </Button>
              </Link>
              <Link href="/safety">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 font-semibold text-lg px-8"
                >
                  Our Safety Principles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Safety banner */}
      <div className="bg-safety-50 border-b border-safety-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-safety-800 text-center font-medium">
            ⚠️ All AI-generated estimates are drafts. Professional review and
            approval are required before any estimate is shared with a customer.
          </p>
        </div>
      </div>

      {/* Trades */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Built for the trades
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {trades.map((trade) => (
            <span
              key={trade.name}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium text-sm"
            >
              {trade.emoji} {trade.name}
            </span>
          ))}
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                The problem with estimating today
              </h2>
              <ul className="space-y-3 text-gray-600">
                {[
                  "Job notes are scattered across texts, voice memos, and napkin sketches",
                  "Writing estimates from scratch takes 30–60 minutes per job",
                  "Vague scope leads to change orders and angry customers",
                  "Rushed estimates miss assumptions, exclusions, and risk disclaimers",
                  "Errors in estimates create legal and financial exposure",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                The Safe Estimate AI approach
              </h2>
              <ul className="space-y-3 text-gray-600">
                {[
                  "Consolidate notes, voice memos, and photos into a single form",
                  "Generate a structured draft in seconds — not minutes",
                  "Automatically flag vague scope, missing measurements, and risk",
                  "Require explicit contractor approval before any estimate is finalized",
                  "Estimates are clearly labeled as drafts with safety disclaimers",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to estimate safely
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Designed from the ground up with safety and professional
            accountability in mind.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Safety principles */}
      <section className="bg-brand-950 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              🛡️ Safety is not a feature — it is the foundation
            </h2>
            <p className="text-brand-200 text-lg">
              We built Safe Estimate AI around a simple principle: AI should
              assist professionals, never replace their judgment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto mb-10">
            {safetyPrinciples.map((principle) => (
              <div
                key={principle}
                className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3"
              >
                <span className="text-green-400 flex-shrink-0">✓</span>
                <span className="text-sm text-brand-100">{principle}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/safety">
              <Button
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 font-semibold"
              >
                Read our full Safety Principles →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Alert variant="warning" className="mb-8 text-left">
            <strong>Important:</strong> Safe Estimate AI generates draft
            estimates only. No estimate produced by this tool is final, legally
            binding, code-compliant, or price-guaranteed. Always review and
            approve before sharing with customers.
          </Alert>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to draft your first estimate?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Try the demo — enter your job notes and see a structured draft
            estimate in seconds.
          </p>
          <Link href="/estimate">
            <Button
              size="lg"
              className="bg-brand-700 hover:bg-brand-800 text-white font-semibold text-lg px-10"
            >
              Start a Draft Estimate →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
