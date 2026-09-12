import { ViolationManager } from './ViolationManager';

export class BrowserMonitor {
  private isListening: boolean = false;
  private violationManager: ViolationManager;

  // Event handlers saved for clean removal
  private handleVisibilityChangeBound: any;
  private handleBlurBound: any;
  private handleFullscreenChangeBound: any;
  private handleCopyBound: any;
  private handlePasteBound: any;
  private handleContextMenuBound: any;
  private handleKeydownBound: any;

  constructor(violationManager: ViolationManager) {
    this.violationManager = violationManager;

    this.handleVisibilityChangeBound = this.handleVisibilityChange.bind(this);
    this.handleBlurBound = this.handleBlur.bind(this);
    this.handleFullscreenChangeBound = this.handleFullscreenChange.bind(this);
    this.handleCopyBound = this.handleCopy.bind(this);
    this.handlePasteBound = this.handlePaste.bind(this);
    this.handleContextMenuBound = this.handleContextMenu.bind(this);
    this.handleKeydownBound = this.handleKeydown.bind(this);
  }

  public start(): void {
    if (this.isListening || typeof window === 'undefined') return;
    this.isListening = true;

    document.addEventListener('visibilitychange', this.handleVisibilityChangeBound);
    window.addEventListener('blur', this.handleBlurBound);
    document.addEventListener('fullscreenchange', this.handleFullscreenChangeBound);
    document.addEventListener('copy', this.handleCopyBound);
    document.addEventListener('cut', this.handleCopyBound);
    document.addEventListener('paste', this.handlePasteBound);
    document.addEventListener('contextmenu', this.handleContextMenuBound);
    document.addEventListener('keydown', this.handleKeydownBound);
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.violationManager.reportSuspiciousActivity(
        'tab_switch',
        'high',
        'Student switched browser tab or minimized assessment window.'
      );
    }
  }

  private handleBlur(): void {
    if (document.hidden) return; // Handled by visibilitychange
    this.violationManager.reportSuspiciousActivity(
      'window_blur',
      'medium',
      'Assessment window lost active screen focus.'
    );
  }

  private handleFullscreenChange(): void {
    const isFullscreenNow = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement
    );

    if (!isFullscreenNow) {
      this.violationManager.reportSuspiciousActivity(
        'fullscreen_exit',
        'high',
        'Student exited locked full-screen examination mode.'
      );
    }
  }

  private handleCopy(e: Event): void {
    e.preventDefault();
    this.violationManager.reportSuspiciousActivity(
      'copy_paste',
      'high',
      'Clipboard text copy/cut attempt blocked.'
    );
  }

  private handlePaste(e: Event): void {
    e.preventDefault();
    this.violationManager.reportSuspiciousActivity(
      'copy_paste',
      'high',
      'Clipboard text paste attempt blocked.'
    );
  }

  private handleContextMenu(e: MouseEvent): void {
    e.preventDefault();
    this.violationManager.reportSuspiciousActivity(
      'context_menu',
      'medium',
      'Right-click context menu attempt blocked.'
    );
  }

  private handleKeydown(e: KeyboardEvent): void {
    // 1. Screenshot key deterrents (PrintScreen, Meta+Shift+S, Cmd+Shift+3/4/5)
    if (
      e.key === 'PrintScreen' ||
      (e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S' || e.key === '3' || e.key === '4' || e.key === '5'))
    ) {
      e.preventDefault();
      this.violationManager.reportSuspiciousActivity(
        'screenshot_attempt',
        'high',
        'System screenshot shortcut attempt detected and blocked.'
      );
    }
    // 2. Clipboard shortcut deterrents (Ctrl/Cmd + C, V, X, U, P)
    else if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'u' || e.key === 'p')
    ) {
      e.preventDefault();
      this.violationManager.reportSuspiciousActivity(
        'copy_paste',
        'medium',
        `Keyboard shortcut (Ctrl+${e.key.toUpperCase()}) blocked.`
      );
    }
    // 3. Developer tools key shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
    else if (
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
    ) {
      e.preventDefault();
      this.violationManager.reportSuspiciousActivity(
        'context_menu',
        'medium',
        'Developer tools key shortcut attempt blocked.'
      );
    }
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;

    document.removeEventListener('visibilitychange', this.handleVisibilityChangeBound);
    window.removeEventListener('blur', this.handleBlurBound);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChangeBound);
    document.removeEventListener('copy', this.handleCopyBound);
    document.removeEventListener('cut', this.handleCopyBound);
    document.removeEventListener('paste', this.handlePasteBound);
    document.removeEventListener('contextmenu', this.handleContextMenuBound);
    document.removeEventListener('keydown', this.handleKeydownBound);
  }
}
