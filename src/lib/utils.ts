/**
 * Utility functions for ArchLab: formatting, URL state encoding, and safe localStorage
 */

export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return defaultValue;
  }
}

export function safeLocalStorageSet<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`Error writing localStorage key "${key}":`, err);
    return false;
  }
}

export function encodeStateToQuery(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        searchParams.set(key, JSON.stringify(value));
      } else {
        searchParams.set(key, String(value));
      }
    }
  }
  return searchParams.toString();
}

export function decodeStateFromQuery<T>(search: string): Partial<T> {
  const searchParams = new URLSearchParams(search);
  const result: any = {};
  searchParams.forEach((val, key) => {
    try {
      result[key] = JSON.parse(val);
    } catch {
      result[key] = val;
    }
  });
  return result;
}

export function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  } else {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve) => {
      const successful = document.execCommand('copy');
      textArea.remove();
      resolve(successful);
    });
  }
}
