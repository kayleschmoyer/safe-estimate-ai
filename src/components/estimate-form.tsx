"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  estimateFormSchema,
  type EstimateFormValues,
  TRADE_TYPES,
  TRADE_LABELS,
} from "@/lib/schema";
import { generateEstimate } from "@/lib/estimate-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert, AlertIcon } from "@/components/ui/alert";

const tradeOptions = TRADE_TYPES.map((t) => ({
  value: t,
  label: TRADE_LABELS[t],
}));

export function EstimateForm() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstimateFormValues>({
    resolver: zodResolver(estimateFormSchema),
    defaultValues: {
      tradeType: undefined,
      customerName: "",
      address: "",
      jobNotes: "",
      voiceMemoTranscript: "",
      photoNotes: "",
      materialsNotes: "",
    },
  });

  function onSubmit(data: EstimateFormValues) {
    setIsGenerating(true);

    // Generate estimate synchronously (deterministic mock)
    const estimate = generateEstimate(data);

    // Store in sessionStorage for the result page to read
    sessionStorage.setItem("currentEstimate", JSON.stringify(estimate));

    // Small delay to give "generating" feel
    setTimeout(() => {
      router.push("/estimate/result");
    }, 800);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Safety notice */}
      <Alert variant="info">
        <AlertIcon variant="info" />
        <div>
          <strong>AI-Assisted Draft Tool</strong> — This tool generates a
          structured draft estimate from your job notes. All output is a{" "}
          <strong>draft only</strong> and requires your review and approval
          before sharing with customers.
        </div>
      </Alert>

      {/* Section: Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            id="tradeType"
            label="Trade / Service Type"
            required
            options={tradeOptions}
            placeholder="Select your trade..."
            error={errors.tradeType?.message}
            {...register("tradeType")}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="customerName"
              label="Customer Name"
              required
              placeholder="Jane Smith"
              error={errors.customerName?.message}
              {...register("customerName")}
            />
            <Input
              id="address"
              label="Property / Service Address"
              required
              placeholder="123 Main St, Anytown, ST 12345"
              error={errors.address?.message}
              {...register("address")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section: Job Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Job Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="jobNotes"
            label="Job Notes"
            required
            rows={5}
            placeholder="Describe the work to be done. Include measurements if available (e.g., '1,200 sq ft roof', '3-ton unit'). More detail = better estimate."
            hint="Be as specific as possible. Include dimensions, existing conditions, customer requests, and any site observations."
            error={errors.jobNotes?.message}
            {...register("jobNotes")}
          />

          <Textarea
            id="voiceMemoTranscript"
            label="Voice Memo Transcript (optional)"
            rows={3}
            placeholder="Paste or type your voice memo transcript here..."
            hint="Transcribed voice memos from your phone or dictation app. Will be analyzed along with job notes."
            error={errors.voiceMemoTranscript?.message}
            {...register("voiceMemoTranscript")}
          />

          <Textarea
            id="photoNotes"
            label="Photo Observations (optional)"
            rows={3}
            placeholder="Describe what you saw in your site photos: 'Photo 1: cracked ridge cap on north slope, approximately 8 feet. Photo 2: water stain on ceiling below...'"
            hint="Describe your photo findings here. Photo upload is not required for this MVP — text descriptions are used."
            error={errors.photoNotes?.message}
            {...register("photoNotes")}
          />
        </CardContent>
      </Card>

      {/* Section: Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Materials & Labor Notes (optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="materialsNotes"
            label="Materials / Labor Notes"
            rows={3}
            placeholder="Any specific materials, brands, quantities, or labor requirements the customer requested or that you noted on-site."
            hint="e.g., 'Customer wants Owens Corning Duration shingles in charcoal' or 'Requires 2-man crew for 2 days'"
            error={errors.materialsNotes?.message}
            {...register("materialsNotes")}
          />
        </CardContent>
      </Card>

      {/* Disclaimer before submit */}
      <Alert variant="warning">
        <AlertIcon variant="warning" />
        <p className="text-sm">
          <strong>Reminder:</strong> The draft estimate generated is{" "}
          <strong>not final</strong> and must be reviewed by a licensed
          professional. Do not share with customers without approval. Pricing
          shown is an estimate only and is not guaranteed.
        </p>
      </Alert>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isGenerating}
          className="min-w-[200px]"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating Draft...
            </span>
          ) : (
            "Generate Draft Estimate →"
          )}
        </Button>
      </div>
    </form>
  );
}
