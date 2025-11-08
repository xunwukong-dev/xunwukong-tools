import crypto from 'crypto';
import qs from 'qs';

export function generateSignature(queryString: string, secretKey: string): string {
  return crypto.createHmac('sha256', secretKey).update(queryString).digest('hex');
}

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>,
): string {
  // Filter out undefined, null, and empty string values
  const filtered = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== '',
    ),
  );

  // Use qs.stringify with sort option to ensure alphabetical order
  return qs.stringify(filtered, {
    sort: (a: string, b: string) => a.localeCompare(b),
    encode: true,
    skipNulls: true,
  });
}
