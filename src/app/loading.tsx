import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2
        className="w-10 h-10 animate-spin"
        style={{ color: "var(--color-primary)" }}
      />
      <p className="text-[var(--color-text-muted)] text-sm font-medium">
        Loading...
      </p>
    </div>
  );
}
