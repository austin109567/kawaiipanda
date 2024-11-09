interface CacheData<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export class Cache {
  private static instance: Cache;
  private storage: Map<string, CacheData<any>>;

  private constructor() {
    this.storage = new Map();
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set<T>(key: string, data: T, duration: number): void {
    this.storage.set(key, {
      data,
      timestamp: Date.now(),
      expiry: duration,
    });
  }

  get<T>(key: string): T | null {
    const cached = this.storage.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.expiry) {
      this.storage.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.storage.clear();
  }
}