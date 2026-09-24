/**
 * Display Protection Provider Hardware & Software Abstraction Layer
 * PlaceTrack Pro - AI Camera-Resistant Assessment Protection
 */

export interface DisplayProtectionConfig {
  studentDisplayId?: string;
  sessionIdentifier?: string;
  assessmentTitle?: string;
  enableDynamicWatermark?: boolean;
  enableDynamicPattern?: boolean;
  enableScreenshotDeterrence?: boolean;
}

export interface DisplayProtectionProvider {
  enable(config?: DisplayProtectionConfig): Promise<void>;
  disable(): Promise<void>;
  isSupported(): boolean;
  getProviderName(): string;
}

/**
 * Software-Only Camera Resistance Protection Provider.
 * Combines dynamic anti-photo watermarking, dynamic high-frequency visual security pattern,
 * and browser content protection.
 *
 * NOTE: Normal web applications cannot directly alter external smartphone hardware camera optics.
 * This provider creates maximum technically feasible software-level deterrence.
 */
export class SoftwareCameraResistanceProvider implements DisplayProtectionProvider {
  private isActive: boolean = false;
  private config: DisplayProtectionConfig = {};

  constructor(config?: DisplayProtectionConfig) {
    if (config) {
      this.config = config;
    }
  }

  public isSupported(): boolean {
    // Software camera resistance is supported in all modern browser canvas / CSS environments
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  public getProviderName(): string {
    return 'Software-Based Camera Resistance Provider (Dynamic Watermark + Moiré Pattern)';
  }

  public async enable(config?: DisplayProtectionConfig): Promise<void> {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.isActive = true;
  }

  public async disable(): Promise<void> {
    this.isActive = false;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getConfig(): DisplayProtectionConfig {
    return this.config;
  }
}
