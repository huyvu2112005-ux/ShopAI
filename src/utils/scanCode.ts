export function productCodeFromScan(value: string): string {
  const raw = value.trim().replace(/^shopai:\/\/product\//i, '').split(/[?#]/)[0];
  try {return decodeURIComponent(raw);} catch {return raw;}
}
