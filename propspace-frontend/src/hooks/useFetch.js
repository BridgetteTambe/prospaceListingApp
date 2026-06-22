import { useState, useEffect, useCallback } from 'react';

/**
 * BP #1 — State Initialization:
 * Runs `fetcher` exactly once on mount (empty deps by default), or again when
 * `deps` change. Returns { data, loading, error, refetch, setData }.
 *
 * BP #2 — Memory Cleanup:
 * An `active` flag in the effect's cleanup prevents setting state after the
 * component has unmounted (avoids the "update on unmounted component" leak).
 */
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0); // bump to force a refetch

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fetcher, deps);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    run()
      .then((res) => active && setData(res))
      .catch((err) => active && setError(err.response?.data?.message || err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false; // teardown: ignore the in-flight response after unmount
    };
  }, [run, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { data, loading, error, refetch, setData };
}
