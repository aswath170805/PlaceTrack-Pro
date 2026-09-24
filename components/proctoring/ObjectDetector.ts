import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { PROCTORING_CONFIG } from './proctoringConfig';
import { ViolationManager } from './ViolationManager';

export class ObjectDetector {
  private model: cocoSsd.ObjectDetection | null = null;
  private isInitializing: boolean = false;
  private isRunning: boolean = false;
  private intervalId: any = null;
  private phoneDetectedStartTime: number | null = null;
  private fallbackCanvas: HTMLCanvasElement | null = null;

  private violationManager: ViolationManager;

  constructor(violationManager: ViolationManager) {
    this.violationManager = violationManager;
  }

  public async initialize(): Promise<boolean> {
    if (this.model) return true;
    if (this.isInitializing) return false;

    this.isInitializing = true;
    try {
      await tf.ready();
      this.model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      this.isInitializing = false;
      return true;
    } catch (err) {
      console.warn('COCO-SSD object detector initialization fallback:', err);
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
        if (!this.model) {
          const loaded = await this.initialize();
          if (!loaded) return;
        }

        const predictions = await this.model!.detect(videoElement);
        const now = Date.now();

        // Search for cell phone or mobile phone detection in video frame
        const phonePrediction = predictions.find(
          (pred) =>
            (pred.class === 'cell phone' || pred.class === 'phone' || pred.class === 'mobile phone') &&
            pred.score >= PROCTORING_CONFIG.PHONE_DETECTION_CONFIDENCE
        );

        if (phonePrediction) {
          // Temporal confirmation: frame 1 -> ignore, continuous frames across 1.5s -> confirmed violation
          if (!this.phoneDetectedStartTime) {
            this.phoneDetectedStartTime = now;
          }

          const sustainedDuration = now - this.phoneDetectedStartTime;
          if (sustainedDuration >= PROCTORING_CONFIG.PHONE_CONFIRMATION_TIME) {
            const snapshot = this.captureSnapshot(videoElement, captureCanvas);
            const confidencePct = (phonePrediction.score * 100).toFixed(0);

            this.violationManager.reportSuspiciousActivity(
              'phone_detected',
              'high',
              `Mobile phone detected in webcam frame (${confidencePct}% confidence).`,
              {
                className: phonePrediction.class,
                confidence: Number(phonePrediction.score.toFixed(3)),
                bbox: phonePrediction.bbox,
                sustainedDurationMs: sustainedDuration,
              },
              snapshot,
              phonePrediction.score
            );

            this.phoneDetectedStartTime = null; // Reset after confirmed logging flag
          }
        } else {
          // Reset temporal confirmation if phone leaves frame
          this.phoneDetectedStartTime = null;
        }
      } catch (err) {
        console.warn('Error during COCO-SSD object detection:', err);
      }
    }, PROCTORING_CONFIG.OBJECT_DETECTION_INTERVAL_MS);
  }

  private captureSnapshot(video: HTMLVideoElement, canvas?: HTMLCanvasElement): string {
    const targetCanvas = canvas || this.getFallbackCanvas();
    if (!targetCanvas || !video) return '';
    try {
      const ctx = targetCanvas.getContext('2d');
      if (!ctx) return '';
      targetCanvas.width = video.videoWidth || 320;
      targetCanvas.height = video.videoHeight || 240;
      ctx.drawImage(video, 0, 0, targetCanvas.width, targetCanvas.height);
      return targetCanvas.toDataURL('image/jpeg', 0.6);
    } catch {
      return '';
    }
  }

  private getFallbackCanvas(): HTMLCanvasElement | null {
    if (typeof document === 'undefined') return null;
    if (!this.fallbackCanvas) {
      this.fallbackCanvas = document.createElement('canvas');
    }
    return this.fallbackCanvas;
  }

  public stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.phoneDetectedStartTime = null;
  }
}
