'use client';

import React from 'react';

interface AntiCameraWatermarkProps {
  studentId?: string;
  sessionId?: string;
  assessmentTitle?: string;
  isActive?: boolean;
}

export default function AntiCameraWatermark({}: AntiCameraWatermarkProps) {
  // Watermark disabled per user request
  return null;
}
