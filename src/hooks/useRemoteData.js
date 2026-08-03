import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    fetchQuery,
    getQueryState,
    setQueryData,
    stableSerialize,
} from "../services/queryClient";

const sleep = (milliseconds) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export function useRemoteData(loader, dependencies = [], options = {}) {
    const {
        minimumLoadingMs = 120,
        keepPreviousData = false,
        queryKey = null,
        staleTime = 30000,
    } = options;
    const loaderRef = useRef(loader);
    loaderRef.current = loader;

    const dependencyKey = useMemo(
        () => stableSerialize(dependencies),
        [dependencies],
    );
    const resolvedQueryKey = useMemo(
        () => (queryKey ? `${queryKey}:${dependencyKey}` : null),
        [queryKey, dependencyKey],
    );
    const initial = resolvedQueryKey
        ? (getQueryState(resolvedQueryKey)?.data ?? null)
        : null;
    const [data, setDataState] = useState(initial);
    const [loading, setLoading] = useState(initial == null);
    const [error, setError] = useState(null);
    const requestId = useRef(0);

    const run = useCallback(
        async (force = false) => {
            const currentRequest = ++requestId.current;
            const startedAt = performance.now();
            setLoading(true);
            setError(null);
            if (!keepPreviousData && !resolvedQueryKey) setDataState(null);

            try {
                const result = resolvedQueryKey
                    ? await fetchQuery({
                          key: resolvedQueryKey,
                          loader: () => loaderRef.current(),
                          staleTime,
                          force,
                      })
                    : await loaderRef.current();
                const remaining =
                    minimumLoadingMs - (performance.now() - startedAt);
                if (remaining > 0) await sleep(remaining);
                if (currentRequest === requestId.current) setDataState(result);
                return result;
            } catch (requestError) {
                if (currentRequest === requestId.current)
                    setError(requestError);
                throw requestError;
            } finally {
                if (currentRequest === requestId.current) setLoading(false);
            }
        },
        [keepPreviousData, minimumLoadingMs, resolvedQueryKey, staleTime],
    );

    useEffect(() => {
        const cached = resolvedQueryKey
            ? getQueryState(resolvedQueryKey)?.data
            : null;
        if (cached != null) {
            setDataState(cached);
            setLoading(false);
        }
        run(false).catch(() => {});
        return () => {
            requestId.current += 1;
        };
    }, [resolvedQueryKey, run]);

    const reload = useCallback(() => run(true), [run]);
    const setData = useCallback(
        (updater) => {
            if (resolvedQueryKey) {
                const next = setQueryData(resolvedQueryKey, updater);
                setDataState(next);
                return next;
            }
            setDataState((current) =>
                typeof updater === "function" ? updater(current) : updater,
            );
            return undefined;
        },
        [resolvedQueryKey],
    );

    return {
        data,
        loading,
        error,
        reload,
        setData,
        queryKey: resolvedQueryKey,
    };
}
