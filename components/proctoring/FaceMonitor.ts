import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { PROCTORING_CONFIG } from './proctoringConfig';
import { ViolationManager } from './ViolationManager';

export class FaceMonitor {
  private detector: faceLandmarksDetection.FaceLandmarksDetector | null = null;
  private isInitializing: boolean = false;
  private isRunning: boolean = false;
  private intervalId: any = null;

  // Temporal confirmation counters (ms)
  private headTurnStartTime: number | null = null;
  private noFaceStartTime: number | null = null;
  private multipleFaceStartTime: number | null = null;

  private violationManager: ViolationManager;

  constructor(violationManager: ViolationManager) {
    this.violationManager = violationManager;
  }

  public async initialize(): Promise<boolean> {
    if (this.detector) return true;
    if (this.isInitializing) return false;

    this.isInitializing = true;
    try {
      await tf.ready();

      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig = {
        runtime: 'tfjs',
        refineLandmarks: false,
        maxFaces: 4,
      };

      this.detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
      this.isInitializing = false;
      return true;
    } catch (err) {
      console.warn('Face landmarks detector initialization fallback:', err);
      this.isInitializing = false;
      return false;
    }
  }

  public start(videoElement: HTMLVideoElement, captureCanvas?: HTMLCanvasElement): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.intervalId = setInterval(async () => {
      if (!this.isRunning || !videoElement || videoElement.readyState < 2) return;

      try {
        if (!this.detector) {
          const loaded = await this.initialize();
          if (!loaded) return;
        }

        const faces = await this.detector!.estimateFaces(videoElement, { flipHorizontal: false });
        const now = Date.now();

        // 1. FACE MISSING MONITORING
        if (faces.length === 0) {
          if (!this.noFaceStartTime) this.noFaceStartTime = now;
          if (now - this.noFaceStartTime >= PROCTORING_CONFIG.NO_FACE_CONFIRMATION_TIME) {
            const snapshot = this.captureSnapshot(videoElement, captureCanvas);
            this.violationManager.reportSuspiciousActivity(
              'no_face',
              'high',
              'Student face disappeared from webcam frame for a sustained duration.',
              { missingDurationMs: now - this.noFaceStartTime },
              snapshot
            );
            this.noFaceStartTime = null; // reset after flag
          }
        } else {
          this.noFaceStartTime = null;
        }

        // 2. MULTIPLE FACES MONITORING
        if (faces.length > 1) {
          if (!this.multipleFaceStartTime) this.multipleFaceStartTime = now;
          if (now - this.multipleFaceStartTime >= PROCTORING_CONFIG.MULTIPLE_FACE_CONFIRMATION_TIME) {
            const snapshot = this.captureSnapshot(videoElement, captureCanvas);
            this.violationManager.reportSuspiciousActivity(
              'multiple_faces',
              'high',
              `Multiple persons (${faces.length}) detected inside webcam frame.`,
              { faceCount: faces.length },
              snapshot
            );
            this.multipleFaceStartTime = null;
          }
        } else {
          this.multipleFaceStartTime = null;
        }

        // 3. HEAD TURN & POSE ESTIMATION (Single Face Present)
        if (faces.length === 1) {
          const keypoints = faces[0].keypoints;
          const pose = this.estimateHeadPose(keypoints);

          const isTurned =
            Math.abs(pose.yaw) > PROCTORING_CONFIG.HEAD_TURN_YAW_THRESHOLD ||
            Math.abs(pose.pitch) > PROCTORING_CONFIG.HEAD_TURN_PITCH_THRESHOLD;

          if (isTurned) {
            if (!this.headTurnStartTime) this.headTurnStartTime = now;
            if (now - this.headTurnStartTime >= PROCTORING_CONFIG.HEAD_TURN_CONFIRMATION_TIME) {
              const snapshot = this.captureSnapshot(videoElement, captureCanvas);
              this.violationManager.reportSuspiciousActivity(
                'head_turn',
                'medium',
                `Head turned away from assessment screen (Yaw: ${pose.yaw.toFixed(2)}, Pitch: ${pose.pitch.toFixed(2)}).`,
                { yaw: pose.yaw, pitch: pose.pitch, roll: pose.roll },
                snapshot
              );
              this.headTurnStartTime = null;
            }
          } else {
            this.headTurnStartTime = null;
          }
        }

      } catch (err) {
        console.warn('Error during face landmark estimation:', err);
      }
    }, PROCTORING_CONFIG.FACE_DETECTION_INTERVAL_MS);
  }

  private estimateHeadPose(keypoints: faceLandmarksDetection.Keypoint[]) {
    // MediaPipe 468 landmark indices:
    // 1: Nose tip, 33: Left eye outer, 263: Right eye outer, 152: Chin, 61: Left mouth, 291: Right mouth
    const nose = keypoints[1] || keypoints[0];
    const leftEye = keypoints[33] || keypoints[1];
    const rightEye = keypoints[263] || keypoints[2];
    const chin = keypoints[152] || keypoints[3];

    const eyeMidX = (leftEye.x + rightEye.x) / 2;
    const eyeMidY = (leftEye.y + rightEye.y) / 2;
    const eyeDist = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y) || 1;

    // Yaw: horizontal offset of nose from eye midpoint normalized by eye distance
    const yaw = (nose.x - eyeMidX) / eyeDist;

    // Pitch: vertical offset of nose from eye midpoint relative to chin
    const faceHeight = Math.abs(chin.y - eyeMidY) || 1;
    const pitch = (nose.y - (eyeMidY + faceHeight * 0.35)) / faceHeight;

    // Roll: angle between left and right eye
    const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

    return { yaw, pitch, roll };
  }

  private captureSnapshot(video: HTMLVideoElement, canvas?: HTMLCanvasElement): string {
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

  public stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.headTurnStartTime = null;
    this.noFaceStartTime = null;
    this.multipleFaceStartTime = null;
  }
}
