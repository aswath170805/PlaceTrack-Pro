declare module '@tensorflow-models/face-landmarks-detection' {
  export interface Keypoint {
    x: number;
    y: number;
    z?: number;
    score?: number;
  }

  export interface Face {
    keypoints: Keypoint[];
  }

  export interface MediaPipeFaceMeshTfjsModelConfig {
    runtime?: 'tfjs' | 'mediapipe';
    refineLandmarks?: boolean;
    maxFaces?: number;
  }

  export interface FaceLandmarksDetector {
    estimateFaces(
      video: HTMLVideoElement,
      config?: { flipHorizontal?: boolean }
    ): Promise<Face[]>;
  }

  export const SupportedModels: {
    MediaPipeFaceMesh: string;
  };

  export function createDetector(
    model: string,
    config: MediaPipeFaceMeshTfjsModelConfig
  ): Promise<FaceLandmarksDetector>;
}
