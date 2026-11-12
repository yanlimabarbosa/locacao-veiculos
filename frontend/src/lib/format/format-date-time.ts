const formatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export function formatDateTime(value: string | Date) {
  return formatter.format(new Date(value));
}
