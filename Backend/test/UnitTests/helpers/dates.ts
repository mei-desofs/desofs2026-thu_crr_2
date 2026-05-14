export function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 86_400_000);
}
