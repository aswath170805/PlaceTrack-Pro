import { PROCTORING_CONFIG, ViolationType, VIOLATION_RISK_WEIGHTS } from './proctoringConfig';
import { DatabaseService } from '@/lib/dbService';

export interface ViolationRecord {
  id: string;
  attemptId: string;
  violationType: ViolationType;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  details: string;
  confidence?: number;
  strikeNumber?: number;
  metadata?: Record<string, any>;
  snapshotUrl?: string;
}

export class ViolationManager {
  private attemptId: string;
  private studentName: string;
  private testTitle: string;
  private violationCount: number = 0;
  private riskScore: number = 0;
  private violationHistory: ViolationRecord[] = [];
  private lastViolationTimestamps: Map<ViolationType, number> = new Map();
  private isTerminated: boolean = false;

  private onViolationCallback?: (record: ViolationRecord, currentCount: number) => void;
  private onTerminateCallback?: (records: ViolationRecord[], count: number) => void;

  constructor(
    attemptId: string,
    studentName?: string,
    testTitle?: string,
    onViolation?: (record: ViolationRecord, currentCount: number) => void,
    onTerminate?: (records: ViolationRecord[], count: number) => void
  ) {
    this.attemptId = attemptId;
    this.studentName = studentName || 'Student';
    this.testTitle = testTitle || 'Assessment';
    this.onViolationCallback = onViolation;
    this.onTerminateCallback = onTerminate;
  }

  public reportSuspiciousActivity(
    type: ViolationType,
    severity: 'low' | 'medium' | 'high',
    details: string,
    metadata?: Record<string, any>,
    snapshotUrl?: string,
    confidence: number = 0.90
  ): boolean {
    if (this.isTerminated) return false;

    const now = Date.now();
    const lastTimestamp = this.lastViolationTimestamps.get(type) || 0;

    // Anti-duplicate protection: cooldown guard per violation category
    if (now - lastTimestamp < PROCTORING_CONFIG.VIOLATION_COOLDOWN_MS) {
      return false;
    }

    this.lastViolationTimestamps.set(type, now);
    this.violationCount += 1;
    this.riskScore += VIOLATION_RISK_WEIGHTS[type] || 1;

    const record: ViolationRecord = {
      id: 'pe-' + Math.random().toString(36).substring(2, 9),
      attemptId: this.attemptId,
      violationType: type,
      severity,
      timestamp: new Date().toISOString(),
      details,
      confidence,
      strikeNumber: this.violationCount,
      metadata: metadata || {},
      snapshotUrl: snapshotUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60'
    };

    this.violationHistory.unshift(record);

    // Save evidence snapshot to database
    DatabaseService.saveProctoringEvidence({
      attempt_id: this.attemptId,
      student_id: 's1111111-1111-1111-1111-111111111111',
      event_type: type,
      confidence,
      snapshot_url: record.snapshotUrl,
      metadata: { ...metadata, details }
    }).catch((err) => console.warn('Failed saving evidence snapshot:', err));

    // Trigger warning callback for UI notification
    if (this.onViolationCallback) {
      this.onViolationCallback(record, this.violationCount);
    }

    // Check 3-Strike Auto Termination
    if (this.violationCount >= PROCTORING_CONFIG.MAX_ALLOWED_VIOLATIONS) {
      this.isTerminated = true;
      if (this.onTerminateCallback) {
        this.onTerminateCallback(this.violationHistory, this.violationCount);
      }
    }

    return true;
  }

  public getViolationCount(): number {
    return this.violationCount;
  }

  public getRiskScore(): number {
    return this.riskScore;
  }

  public getRiskLevel(): 'Normal' | 'Low Risk' | 'High Risk' | 'Critical' {
    if (this.riskScore >= 7 || this.violationCount >= 3) return 'Critical';
    if (this.riskScore >= 5) return 'High Risk';
    if (this.riskScore >= 3) return 'Low Risk';
    return 'Normal';
  }

  public getViolationHistory(): ViolationRecord[] {
    return [...this.violationHistory];
  }

  public getIsTerminated(): boolean {
    return this.isTerminated;
  }

  public reset(): void {
    this.violationCount = 0;
    this.riskScore = 0;
    this.violationHistory = [];
    this.lastViolationTimestamps.clear();
    this.isTerminated = false;
  }
}
