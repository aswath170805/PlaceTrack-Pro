import { PROCTORING_CONFIG } from './proctoringConfig';
import { ViolationManager } from './ViolationManager';

export class AudioMonitor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private isRunning: boolean = false;
  private intervalId: any = null;
  private voiceDetectedStartTime: number | null = null;

  private violationManager: ViolationManager;

  constructor(violationManager: ViolationManager) {
    this.violationManager = violationManager;
  }

  public async start(stream: MediaStream): Promise<boolean> {
    if (this.isRunning) return true;
    if (!stream || stream.getAudioTracks().length === 0) {
      console.warn('No audio track available in media stream for AudioMonitor.');
      return false;
    }

    try {
      this.mediaStream = stream;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.8;
      source.connect(this.analyser);

      this.isRunning = true;
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.intervalId = setInterval(() => {
        if (!this.isRunning || !this.analyser) return;

        this.analyser.getByteFrequencyData(dataArray);

        // Compute RMS volume over frequency bins
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = dataArray[i] / 255;
          sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / dataArray.length);

        const now = Date.now();

        // Check if audio level exceeds voice activity threshold
        if (rms >= PROCTORING_CONFIG.VOICE_AUDIO_VOLUME_THRESHOLD) {
          if (!this.voiceDetectedStartTime) this.voiceDetectedStartTime = now;
          if (now - this.voiceDetectedStartTime >= PROCTORING_CONFIG.VOICE_CONFIRMATION_TIME) {
            this.violationManager.reportSuspiciousActivity(
              'suspicious_audio',
              'medium',
              `Sustained suspicious voice/audio activity detected (Volume RMS: ${rms.toFixed(3)}).`,
              { volumeRms: Number(rms.toFixed(4)), durationMs: now - this.voiceDetectedStartTime }
            );
            this.voiceDetectedStartTime = null; // reset after flag
          }
        } else {
          this.voiceDetectedStartTime = null;
        }

      }, PROCTORING_CONFIG.AUDIO_DETECTION_INTERVAL_MS);

      return true;
    } catch (err) {
      console.warn('Web Audio API monitoring initialization error:', err);
      return false;
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {
        // ignore
      }
      this.audioContext = null;
    }
    this.analyser = null;
    this.voiceDetectedStartTime = null;
  }
}
