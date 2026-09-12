import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { PROCTORING_CONFIG } from './proctoringConfig';
import { ViolationManager } from './ViolationManager';

export type GazeState =
  | 'LOOKING_AT_SCREEN'
  | 'LOOKING_LEFT'
  | 'LOOKING_RIGHT'
  | 'LOOKING_UP'
  | 'LOOKING_DOWN'
  | 'FACE_NOT_VISIBLE';

export class GazeMonitor {
  private isRunning: boolean = false;
  private gazeDownStartTime: number | null = null;
  private currentGazeState: GazeState = 'LOOKING_AT_SCREEN';
  private violationManager: ViolationManager;

  constructor(violationManager: ViolationManager) {
    this.violationManager = violationManager;
  }

  public evaluateGazeFromLandmarks(
    faces: faceLandmarksDetection.Face[],
    videoElement?: HTMLVideoElement,
    canvasElement?: HTMLCanvasElement
  ): GazeState {
    if (faces.length === 0) {
      this.currentGazeState = 'FACE_NOT_VISIBLE';
      this.gazeDownStartTime = null;
      return this.currentGazeState;
    }

    const keypoints = faces[0].keypoints;
    // Eye landmarks:
    // Left eye top (159), bottom (145), inner (133), outer (33)
    // Right eye top (386), bottom (374), inner (362), outer (263)
    // Nose tip (1), Chin (152)
    const nose = keypoints[1] || keypoints[0];
    const leftEyeUpper = keypoints[159] || keypoints[33];
    const leftEyeLower = keypoints[145] || keypoints[33];
    const rightEyeUpper = keypoints[386] || keypoints[263];
    const rightEyeLower = keypoints[374] || keypoints[263];
    const chin = keypoints[152] || keypoints[1];

    // Compute eye openness (vertical distance) vs face height
    const leftHeight = Math.abs(leftEyeLower.y - leftEyeUpper.y);
    const rightHeight = Math.abs(rightEyeLower.y - rightEyeUpper.y);
    const avgEyeHeight = (leftHeight + rightHeight) / 2;
    const faceHeight = Math.abs(chin.y - (leftEyeUpper.y + rightEyeUpper.y) / 2) || 1;
    const gazeRatio = (nose.y - (leftEyeUpper.y + rightEyeUpper.y) / 2) / faceHeight;

    // Normal blinking has avgEyeHeight < 1.5px, skip blink frames to avoid false positives
    const isBlinking = avgEyeHeight < 1.2;

    let newState: GazeState = 'LOOKING_AT_SCREEN';
    if (!isBlinking) {
      if (gazeRatio > PROCTORING_CONFIG.GAZE_DOWN_PITCH_THRESHOLD) {
        newState = 'LOOKING_DOWN';
      }
    }

    this.currentGazeState = newState;
    const now = Date.now();

    if (newState === 'LOOKING_DOWN') {
      if (!this.gazeDownStartTime) this.gazeDownStartTime = now;
      if (now - this.gazeDownStartTime >= PROCTORING_CONFIG.GAZE_CONFIRMATION_TIME) {
        const snapshot = this.captureSnapshot(videoElement, canvasElement);
        this.violationManager.reportSuspiciousActivity(
          'downward_gaze',
          'medium',
          'Sustained downward gaze away from assessment screen detected.',
          { gazeRatio: gazeRatio.toFixed(3), durationMs: now - this.gazeDownStartTime },
          snapshot
        );
        this.gazeDownStartTime = null; // Reset after flag to require new confirmation
      }
    } else {
      this.gazeDownStartTime = null;
    }

    return this.currentGazeState;
  }

  private captureSnapshot(video?: HTMLVideoElement, canvas?: HTMLCanvasElement): string {
    if (!canvas || !video) return '';
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.5);
    } catch {
      return '';
    }
  }

  public getCurrentState(): GazeState {
    return this.currentGazeState;
  }

  public reset(): void {
    this.gazeDownStartTime = null;
    this.currentGazeState = 'LOOKING_AT_SCREEN';
  }
}
