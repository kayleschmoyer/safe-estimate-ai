"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { type GeneratedEstimate } from "@/lib/schema";
import { EstimateOutput } from "@/components/estimate-output";
import { Button } from "@/components/ui/button";
import { Alert, AlertIcon } from "@/components/ui/alert";

// ---------------------------------------------------------------------------
// useSyncExternalStore wires up sessionStorage without triggering
// the react-hooks/set-state-in-effect lint rule (React Hooks plugin v7+)
// ---------------------------------------------------------------------------

function subscribe() {
  // sessionStorage doesn't emit events; return a no-op unsubscribe
  return () => {};
}

function getSnapshot(): string | null {
  return sessionStorage.getItem("currentEstimate");
}

function getServerSnapshot(): string | null {
  return null; // sessionStorage is unavailable on the server
}

function parseEstimate(
  raw: string | null
): { estimate: GeneratedEstimate | null; error: string | null } {
  if (raw === null) {
    return {
      estimate: null,
      error:
        "No estimate data found. Please complete the estimate form first.",
    };
  }
  try {
    return { estimate: JSON.parse(raw) as GeneratedEstimate, error: null };
  } catch {
    return {
      estimate: null,
      error: "Failed to load estimate data. Please try again.",
    };
  }
}

export default function EstimateResultPage() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // raw is null on the server (getServerSnapshot) and initially on the client
  // before the first synchronous read — both cases render the loading state.
  if (raw === null) {
    // On first client render before hydration finishes we may get null briefly;
    // after hydration useSyncExternalStore calls getSnapshot() synchronously.
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-gray-500">
        <div className="animate-pulse">Loading estimate…</div>
      </div>
    );
  }

  const { estimate, error } = parseEstimate(raw);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Alert variant="destructive">
          <AlertIcon variant="destructive" />
          <div>
            <p className="font-medium">{error}</p>
            <Link href="/estimate" className="mt-2 inline-block">
              <Button variant="outline" size="sm" className="mt-2">
                ← Go Back to Estimate Form
              </Button>
            </Link>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">
            Estimate Review
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Draft Estimate — Review Required
          </h1>
          <p className="text-gray-600 mt-2">
            Your draft has been generated. Review all sections carefully,
            address any safety flags, then approve before sharing.
          </p>
        </div>
        <Link href="/estimate">
          <Button variant="outline">← New Estimate</Button>
        </Link>
      </div>

      <EstimateOutput estimate={estimate!} />
    </div>
  );
}
