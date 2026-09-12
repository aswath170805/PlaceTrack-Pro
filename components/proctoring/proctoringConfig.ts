/**
 * Real-Time AI Proctoring System Configuration
 * All detection thresholds, temporal confirmation windows, and cooldown durations.
 */

export const PROCTORING_CONFIG = {
  // Maximum allowed violations before auto-termination
  MAX_ALLOWED_VIOLATIONS: 3,

  // Global violation cooldown (ms): minimum time between any violations of the same category
  VIOLATION_COOLDOWN_MS: 6000,

  // 1. Head Turn Detection Thresholds
  HEAD_TURN_YAW_THRESHOLD: 0.38,     // Yaw angle threshold in radians (~22 degrees)
  HEAD_TURN_PITCH_THRESHOLD: 0.30,   // Pitch angle threshold in radians (~17 degrees)
  HEAD_TURN_CONFIRMATION_TIME: 1500, // Sustained turn duration in ms to confirm violation

  // 2. Eye Gaze / Downward Look Detection Thresholds
  GAZE_DOWN_PITCH_THRESHOLD: 0.16,   // Downward tilt angle threshold in radians
  GAZE_CONFIRMATION_TIME: 1800,      // Sustained downward gaze duration in ms to confirm

  // 3. Face Visibility & Count Thresholds
  NO_FACE_CONFIRMATION_TIME: 2500,       // Sustained missing face duration in ms
  MULTIPLE_FACE_CONFIRMATION_TIME: 1500, // Sustained multiple faces duration in ms

  // 4. Forbidden Object (Phone) Detection Thresholds
  PHONE_DETECTION_CONFIDENCE: 0.50, // COCO-SSD confidence score cutoff
  PHONE_CONFIRMATION_TIME: 1500,    // Sustained phone presence duration in ms

  // 5. Audio / Voice Detection Thresholds
  VOICE_AUDIO_VOLUME_THRESHOLD: 0.045, // RMS Audio Volume threshold for human speech
  VOICE_CONFIRMATION_TIME: 1500,       // Sustained audio duration in ms

  // 6. Processing Intervals (ms)
  FACE_DETECTION_INTERVAL_MS: 300,   // ~3 FPS for face landmarks
  OBJECT_DETECTION_INTERVAL_MS: 600, // ~1.6 FPS for COCO-SSD object detection
  AUDIO_DETECTION_INTERVAL_MS: 200,  // Audio analyzer interval
} as const;

export type ViolationType =
  | 'no_face'
  | 'multiple_faces'
  | 'head_turn'
  | 'gaze_away'
  | 'downward_gaze'
  | 'phone_detected'
  | 'suspicious_audio'
  | 'tab_switch'
  | 'window_blur'
  | 'fullscreen_exit'
  | 'copy_paste'
  | 'context_menu'
  | 'screenshot_attempt';

export const VIOLATION_RISK_WEIGHTS: Record<ViolationType, number> = {
  no_face: 1,
  multiple_faces: 2,
  head_turn: 1,
  gaze_away: 1,
  downward_gaze: 1,
  phone_detected: 2,
  suspicious_audio: 1,
  tab_switch: 1,
  window_blur: 1,
  fullscreen_exit: 1,
  copy_paste: 1,
  context_menu: 1,
  screenshot_attempt: 1,
};
