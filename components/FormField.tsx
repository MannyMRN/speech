import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  required = true,
  hint,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label}
        {required ? (
          <span className="ml-1 text-gold">*</span>
        ) : (
          <span className="ml-1 text-muted font-normal">(optional)</span>
        )}
      </label>
      {hint && <p className="text-xs text-muted -mt-1">{hint}</p>}
      {children}
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}

const baseInputClasses =
  "w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-foreground placeholder:text-muted/70 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input {...props} className={`${baseInputClasses} ${props.className ?? ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      rows={props.rows ?? 3}
      className={`${baseInputClasses} resize-y ${props.className ?? ""}`}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select {...props} className={`${baseInputClasses} ${props.className ?? ""}`} />
  );
}
