/**
 * UILD (Unique Identifier for Launch Data)
 * Format: prefix_timestamp_random
 * Example: tenant_1649836800000_a1b2c3
 */
export class UILD {
  private static readonly PREFIXES = {
    page: 'pg',
    component: 'cp',
    action: 'ac',
    tenant: 'tn',
    user: 'us',
    session: 'ss'
  } as const;

  static generate(type: keyof typeof this.PREFIXES, metadata: Record<string, any> = {}): string {
    const prefix = this.PREFIXES[type];
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    
    return `${prefix}_${timestamp}_${random}`;
  }

  static isValid(uild: string): boolean {
    const parts = uild.split('_');
    if (parts.length !== 3) return false;

    const [prefix, timestamp, random] = parts;
    const validPrefix = Object.values(this.PREFIXES).includes(prefix);
    const validTimestamp = !isNaN(Number(timestamp));
    const validRandom = /^[a-z0-9]{6}$/.test(random);

    return validPrefix && validTimestamp && validRandom;
  }

  static getPrefix(uild: string): string | null {
    if (!this.isValid(uild)) return null;
    return uild.split('_')[0];
  }

  static getTimestamp(uild: string): number | null {
    if (!this.isValid(uild)) return null;
    return Number(uild.split('_')[1]);
  }

  static compare(a: string, b: string): number {
    if (!this.isValid(a) || !this.isValid(b)) throw new Error('Invalid UILD');
    return this.getTimestamp(a)! - this.getTimestamp(b)!;
  }
} 