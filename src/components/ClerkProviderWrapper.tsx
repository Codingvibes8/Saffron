"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasValidClerkKey =
    Boolean(publishableKey) &&
    publishableKey!.startsWith("pk_") &&
    publishableKey!.length > 20;

  if (hasValidClerkKey) {
    return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
  }

  return <>{children}</>;
}
