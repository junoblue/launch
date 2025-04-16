/**
 * UILD (Unique Identifier with Logging and Discovery) implementation for frontend.
 */

export class UILD {
  private static PREFIX_MAP = {
    page: 'pg',
    form: 'frm',
    component: 'cmp',
    element: 'elm',
    modal: 'mdl',
    widget: 'wgt',
    section: 'sec',
    layout: 'lyt'
  } as const;

  static generate(
    prefixType: keyof typeof UILD.PREFIX_MAP,
    metadata?: Record<string, unknown>
  ): string {
    if (!(prefixType in UILD.PREFIX_MAP)) {
      throw new Error(`Invalid prefix type. Must be one of: ${Object.keys(UILD.PREFIX_MAP).join(', ')}`);
    }

    const prefix = UILD.PREFIX_MAP[prefixType];
    const timestamp = Date.now().toString(16);
    const random = Math.random().toString(16).slice(2, 10);
    const base = `${prefix}-${timestamp}-${random}`;
    
    // Generate checksum
    const checksum = UILD.generateChecksum(base + (metadata ? JSON.stringify(metadata) : ''));
    
    return `${base}-${checksum}`;
  }

  static validate(uild: string): boolean {
    try {
      const [prefix, timestamp, random, checksum] = uild.split('-');
      
      // Validate prefix
      if (!Object.values(UILD.PREFIX_MAP).includes(prefix as any)) {
        return false;
      }
      
      // Validate timestamp (hexadecimal)
      if (!/^[0-9a-f]+$/.test(timestamp)) {
        return false;
      }
      
      // Validate random component (8 hex characters)
      if (!/^[0-9a-f]{8}$/.test(random)) {
        return false;
      }
      
      // Validate checksum length
      if (!/^[0-9a-f]{4}$/.test(checksum)) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  static getType(uild: string): keyof typeof UILD.PREFIX_MAP | null {
    try {
      const prefix = uild.split('-')[0];
      const type = Object.entries(UILD.PREFIX_MAP).find(([_, value]) => value === prefix)?.[0];
      return type as keyof typeof UILD.PREFIX_MAP || null;
    } catch {
      return null;
    }
  }

  static getTimestamp(uild: string): number | null {
    try {
      const timestamp = uild.split('-')[1];
      return parseInt(timestamp, 16);
    } catch {
      return null;
    }
  }

  private static generateChecksum(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).slice(0, 4).padStart(4, '0');
  }
} 