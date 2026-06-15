import type { Metadata } from "next";
import { EstimateForm } from "@/components/estimate-form";

export const metadata: Metadata = {
  title: "Draft an Estimate — Safe Estimate AI",
  description:
    "Enter your job notes, voice memo transcript, and photo observations to generate a structured draft estimate.",
};

export default function EstimatePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">
          Estimate Workflow
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Draft a New Estimate
        </h1>
        <p className="text-gray-600">
          Enter your job details below. The more information you provide, the
          more accurate and complete your draft estimate will be. All fields
          marked with <span className="text-red-500">*</span> are required.
        </p>
      </div>

      <EstimateForm />
    </div>
  );
}
