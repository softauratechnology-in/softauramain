/**
 * Joins class names, dropping falsy values.
 *
 * Deliberately dependency-free: this project has no conflicting-class problem
 * to solve (no `tailwind-merge`) because variant maps in the UI primitives own
 * their own properties rather than layering overrides.
 *
 * @example cn("p-4", isActive && "bg-brand", className)
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  let result = "";
  for (const value of values) {
    if (!value) continue;
    result = result ? `${result} ${value}` : String(value);
  }
  return result;
}
