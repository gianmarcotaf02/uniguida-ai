export function saveToStorage<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error saving to localStorage with key "${key}":`, error);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  } catch (error) {
    console.error(`Error loading from localStorage with key "${key}":`, error);
    return null;
  }
}
