export interface DemoAccess {
  access_token: string;
  attempts_remaining: number;
  expires_at: string;
  can_attempt: boolean;
  pre_ordered: boolean;
  email: string;
}

export interface PronunciationResult {
  score: number;
  canProgress: boolean;
  feedback: string[];
  attemptsRemaining: number;
  pronunciation_report: Record<string, {
    score: number;
    issue: string | null;
  }>;
}

export class DemoAccessManager {
  private token: string | null = null;
  private access: DemoAccess | null = null;

  constructor() {
    this.token = localStorage.getItem('demo_token');
  }

  async requestAccess(email: string): Promise<DemoAccess> {
    const response = await fetch('/api/demo/access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': this.getCSRFToken(),
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to request access');
    }

    const data = await response.json();
    this.token = data.access_token;
    this.access = data;
    
    localStorage.setItem('demo_token', this.token);
    
    return data;
  }

  async checkAccess(): Promise<DemoAccess | null> {
    if (!this.token) return null;

    try {
      const response = await fetch('/api/demo/access/check', {
        method: 'GET',
        headers: {
          'X-Demo-Token': this.token,
        },
      });

      if (!response.ok) {
        this.clearAccess();
        return null;
      }

      this.access = await response.json();
      return this.access;
    } catch (error) {
      console.error('Failed to check access:', error);
      this.clearAccess();
      return null;
    }
  }

  async markPreOrdered(): Promise<void> {
    if (!this.token) throw new Error('No access token');

    const response = await fetch('/api/demo/access/pre-order', {
      method: 'POST',
      headers: {
        'X-Demo-Token': this.token,
        'X-CSRF-TOKEN': this.getCSRFToken(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark pre-order');
    }

    if (this.access) {
      this.access.pre_ordered = true;
    }
  }

  async recordPronunciation(audioBlob: Blob, phrase: string): Promise<PronunciationResult> {
    if (!this.token) throw new Error('No access token');
    if (!this.canAttempt()) throw new Error('No attempts remaining');

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('phrase', phrase);

    const response = await fetch('/api/pronunciation/analyze', {
      method: 'POST',
      headers: {
        'X-Demo-Token': this.token,
        'X-CSRF-TOKEN': this.getCSRFToken(),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    const result = await response.json();
    
    // Update local attempts count
    if (this.access) {
      this.access.attempts_remaining = result.attemptsRemaining;
    }

    return result;
  }

  canAttempt(): boolean {
    return this.access?.can_attempt && (this.access?.attempts_remaining || 0) > 0;
  }

  getAttemptsRemaining(): number {
    return this.access?.attempts_remaining || 0;
  }

  hasAccess(): boolean {
    return !!this.token && !!this.access;
  }

  isPreOrdered(): boolean {
    return this.access?.pre_ordered || false;
  }

  clearAccess(): void {
    this.token = null;
    this.access = null;
    localStorage.removeItem('demo_token');
  }

  private getCSRFToken(): string {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) throw new Error('CSRF token not found');
    return token;
  }
}