export function formatHeight(inches: number): string {
  const ft = Math.floor(inches / 12);
  const inn = inches % 12;
  return `${ft}'${inn}"`;
}

export function parseFeetInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}
