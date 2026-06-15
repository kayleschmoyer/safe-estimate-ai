"use client";

import { useState } from "react";
import Link from "next/link";
import { type GeneratedEstimate, type SafetyFlag } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertIcon } from "@/components/ui/alert";

// Number of columns in the line-items table; used for the subtotal colSpan.
const LINE_ITEM_COLUMNS = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ConfidenceBadge({ level }: { level: GeneratedEstimate["confidenceLevel"] }) {
  const config = {
    low: { variant: "destructive" as const, label: "Low Confidence" },
    medium: { variant: "warning" as const, label: "Medium Confidence" },
    high: { variant: "success" as const, label: "High Confidence" },
  };
  const { variant, label } = config[level];
  return <Badge variant={variant}>{label}</Badge>;
}

function SafetyFlagCard({ flag }: { flag: SafetyFlag }) {
  const isCritical = flag.severity === "critical";
  return (
    <div
      className={`flex gap-3 rounded-lg border p-3 text-sm ${
        isCritical
          ? "border-red-300 bg-red-50 text-red-900"
          : "border-yellow-300 bg-yellow-50 text-yellow-900"
      }`}
    >
      <span className="flex-shrink-0 font-bold">{isCritical ? "🚫" : "⚠️"}</span>
      <p>{flag.message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface EstimateOutputProps {
  estimate: GeneratedEstimate;
}

export function EstimateOutput({ estimate }: EstimateOutputProps) {
  const [approved, setApproved] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const issuedDate = new Date(estimate.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function handleApprove() {
    if (!checkboxChecked) return;
    setApproved(true);
  }

  function handleExport() {
    alert(
      "Export to PDF would be implemented here with a library like react-pdf. " +
        "This is the MVP demo — the export flow is simulated."
    );
  }

  return (
    <div className="space-y-6">
      {/* Draft banner */}
      {!approved && (
        <div className="rounded-xl border-2 border-dashed border-red-400 bg-red-50 px-6 py-4 text-center">
          <p className="text-2xl font-black text-red-700 tracking-wide uppercase mb-1">
            ⚠️ DRAFT — Not Approved
          </p>
          <p className="text-sm text-red-700">
            This estimate is AI-generated and has not yet been reviewed by a
            licensed professional. Do not share with customers until approved.
          </p>
        </div>
      )}

      {approved && (
        <div className="rounded-xl border-2 border-green-400 bg-green-50 px-6 py-4 text-center">
          <p className="text-2xl font-black text-green-700 tracking-wide uppercase mb-1">
            ✅ Approved by Contractor
          </p>
          <p className="text-sm text-green-700">
            This estimate has been reviewed and approved. Customer-ready copy
            can be exported below.
          </p>
        </div>
      )}

      {/* Estimate header */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Draft Estimate
              </p>
              <CardTitle className="text-2xl">
                {estimate.tradeLabel} Services
              </CardTitle>
              <p className="text-gray-500 mt-1">
                Prepared for: <strong>{estimate.customerName}</strong>
              </p>
              <p className="text-gray-500 text-sm">
                Location: {estimate.address}
              </p>
            </div>
            <div className="text-right text-sm text-gray-500 space-y-1">
              <p>
                Estimate ID: <strong>{estimate.estimateId}</strong>
              </p>
              <p>Generated: {issuedDate}</p>
              <div className="flex items-center justify-end gap-2 mt-2">
                <ConfidenceBadge level={estimate.confidenceLevel} />
                {!approved && (
                  <Badge variant="destructive">DRAFT</Badge>
                )}
                {approved && (
                  <Badge variant="success">APPROVED</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Safety flags */}
      {estimate.safetyFlags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🛡️ Safety & Risk Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert variant="warning">
              <AlertIcon variant="warning" />
              <p className="text-sm">
                The following flags were detected based on the job details
                provided. Review each item carefully before approving or
                presenting this estimate to a customer.
              </p>
            </Alert>
            <div className="space-y-2">
              {estimate.safetyFlags.map((flag, i) => (
                <SafetyFlagCard key={i} flag={flag} />
              ))}
            </div>
            <p className="text-xs text-gray-500 pt-2">
              Confidence level: <strong>{estimate.confidenceLevel}</strong> —{" "}
              {estimate.confidenceRationale}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Scope of work */}
      <Card>
        <CardHeader>
          <CardTitle>Scope of Work</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {estimate.scopeOfWork.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-brand-500 flex-shrink-0 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Line items */}
      <Card>
        <CardHeader>
          <CardTitle>Estimated Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700 whitespace-nowrap">
                    Qty
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">
                    Unit
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700 whitespace-nowrap">
                    Unit Price
                  </th>
                  <th className="text-right py-2 pl-3 font-semibold text-gray-700 whitespace-nowrap">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {estimate.lineItems.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 pr-4 text-gray-800">
                      <div>{item.description}</div>
                      {item.notes && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-gray-500">{item.unit}</td>
                    <td className="py-3 px-3 text-right text-gray-700 whitespace-nowrap">
                      {item.unitPrice}
                    </td>
                    <td className="py-3 pl-3 text-right font-medium text-gray-900 whitespace-nowrap">
                      {item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300">
                  <td
                    colSpan={LINE_ITEM_COLUMNS - 1}
                    className="pt-3 pr-3 text-right font-bold text-gray-900"
                  >
                    Estimated Subtotal
                  </td>
                  <td className="pt-3 pl-3 text-right font-bold text-xl text-brand-700 whitespace-nowrap">
                    {estimate.subtotal}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <Alert variant="warning" className="mt-4">
            <AlertIcon variant="warning" />
            <p className="text-xs">
              Prices shown are <strong>estimates only</strong>. Final pricing is
              subject to on-site verification, material costs at time of order,
              and confirmed scope. This is not a binding quote.
            </p>
          </Alert>
        </CardContent>
      </Card>

      {/* Assumptions */}
      <Card>
        <CardHeader>
          <CardTitle>Assumptions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {estimate.assumptions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 flex-shrink-0 mt-0.5">→</span>
                {a}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Exclusions */}
      <Card>
        <CardHeader>
          <CardTitle>Exclusions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {estimate.exclusions.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>
                {e}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Customer-facing notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes for Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {estimate.customerFacingNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-brand-400 flex-shrink-0 mt-0.5">ℹ</span>
                {note}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Human-in-the-loop approval gate */}
      {!approved && (
        <Card className="border-2 border-brand-200">
          <CardHeader>
            <CardTitle>🔐 Contractor Approval Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="info">
              <AlertIcon variant="info" />
              <div className="text-sm">
                <strong>AI-generated estimates require professional review.</strong>{" "}
                By approving this estimate, you confirm that you have reviewed
                all line items, scope, assumptions, exclusions, and safety
                flags, and that you take professional responsibility for the
                accuracy of this document.
              </div>
            </Alert>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                aria-label="I confirm I have reviewed this draft estimate"
              />
              <span className="text-sm text-gray-700">
                I have reviewed this AI-generated draft estimate. I confirm that
                the scope, pricing, assumptions, and exclusions are accurate to
                the best of my knowledge, and I take professional responsibility
                for this document before sharing it with the customer.
              </span>
            </label>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Approval is required before export or customer delivery.
            </p>
            <Button
              onClick={handleApprove}
              disabled={!checkboxChecked}
              size="lg"
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              ✓ Approve Estimate
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Export section (only shown after approval) */}
      {approved && (
        <Card className="border-2 border-green-300 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">
              ✅ Ready for Customer Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="success">
              <AlertIcon variant="success" />
              <p className="text-sm">
                This estimate has been approved. You may now export it as a PDF
                or copy it to share with your customer. The estimate is still
                not a legally binding contract — a formal signed agreement
                should be obtained before work begins.
              </p>
            </Alert>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleExport}
                size="lg"
                className="bg-brand-700 hover:bg-brand-800 text-white"
              >
                📄 Export as PDF
              </Button>
              <Link href="/estimate">
                <Button variant="outline" size="lg">
                  + Draft Another Estimate
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
