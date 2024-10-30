/**
 * Utility functions for handling asynchronous operations
 */

/**
 * Wraps an async operation with error handling and loading state
 */
export const withAsyncHandler = async <T>(
  operation: () => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void
): Promise<{ data: T | null; error: Error | null; isLoading: boolean }> => {
  try {
    const data = await operation();
    onSuccess?.(data);
    return { data, error: null, isLoading: false };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error occurred');
    onError?.(error);
    return { data: null, error, isLoading: false };
  }
};

/**
 * Debounces an async function
 */
export const debounceAsync = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

/**
 * Retries an async operation with exponential backoff
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let retries = 0;
  
  while (true) {
    try {
      return await operation();
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, retries - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Creates a cancelable promise
 */
export const createCancelablePromise = <T>(promise: Promise<T>) => {
  let isCanceled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then(
      value => isCanceled ? reject({ isCanceled: true }) : resolve(value),
      error => isCanceled ? reject({ isCanceled: true }) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel: () => { isCanceled = true; }
  };
};

/**
 * Runs multiple async operations in parallel with a concurrency limit
 */
export const parallelWithLimit = async <T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> => {
  const results: T[] = [];
  let currentIndex = 0;

  const runTask = async (): Promise<void> => {
    while (currentIndex < tasks.length) {
      const taskIndex = currentIndex++;
      results[taskIndex] = await tasks[taskIndex]();
    }
  };

  const workers = Array(Math.min(limit, tasks.length))
    .fill(null)
    .map(() => runTask());

  await Promise.all(workers);
  return results;
};

/**
 * Creates a memoized version of an async function
 */
export const memoizeAsync = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
) => {
  const cache = new Map<string, ReturnType<T>>();

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
};