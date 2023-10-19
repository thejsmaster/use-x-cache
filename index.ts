import { useCallback, useEffect } from "react";

type CacheValue = string | number | object; // Define the type for cache values

interface CacheInstance {
  cache: Map<string, CacheValue>;
  listenerCount: number;
}

const XCache: { [key: string]: CacheInstance } = {};

export const useXCache = (cacheName: string) => {
  if (!XCache[cacheName]) {
    XCache[cacheName] = {
      cache: new Map<string, CacheValue>(),
      listenerCount: 0,
    };
  }

  const cacheInstance = XCache[cacheName];

  const get = useCallback((key: object | any[]): CacheValue | undefined => {
    const serializedKey = JSON.stringify(key);
    return cacheInstance.cache.has(serializedKey)
      ? cacheInstance.cache.get(serializedKey)
      : undefined;
  }, []);

  const set = useCallback((key: object | any[], value: CacheValue) => {
    const serializedKey = JSON.stringify(key);
    cacheInstance.cache.set(serializedKey, JSON.parse(JSON.stringify(value)));
  }, []);

  const remove = useCallback((key: object | any[]) => {
    const serializedKey = JSON.stringify(key);
    cacheInstance.cache.delete(serializedKey);
  }, []);

  const addListener = useCallback(() => {
    cacheInstance.listenerCount += 1;
  }, []);

  const removeListener = useCallback(() => {
    cacheInstance.listenerCount -= 1;
    if (cacheInstance.listenerCount === 0) {
      // No listeners remaining, delete the cache to free up memory
      delete XCache[cacheName];
    }
  }, []);

  const clearAll = useCallback(() => {
    cacheInstance.cache = new Map<string, CacheValue>();
  }, [cacheName]);

  useEffect(() => {
    // When the component mounts, add itself as a listener
    addListener();

    // Clean up the listener when the component unmounts
    return () => {
      removeListener();
    };
  }, [addListener, removeListener, cacheName]);

  return { get, set, remove, addListener, removeListener, clearAll };
};
