const cache = new Map();
const inFlight = new Map();

export function stableSerialize(value) {
    if (value === null || typeof value !== "object")
        return JSON.stringify(value);
    if (Array.isArray(value))
        return `[${value.map(stableSerialize).join(",")}]`;
    return `{${Object.keys(value)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`)
        .join(",")}}`;
}

export function getQueryState(key) {
    return cache.get(key) || null;
}

export async function fetchQuery({
    key,
    loader,
    staleTime = 30000,
    force = false,
}) {
    const cached = cache.get(key);
    const now = Date.now();
    if (!force && cached && now - cached.updatedAt < staleTime)
        return cached.data;
    if (!force && inFlight.has(key)) return inFlight.get(key);

    const promise = Promise.resolve()
        .then(loader)
        .then((data) => {
            cache.set(key, { data, updatedAt: Date.now() });
            return data;
        })
        .finally(() => inFlight.delete(key));

    inFlight.set(key, promise);
    return promise;
}

export function setQueryData(key, updater) {
    const current = cache.get(key)?.data;
    const next = typeof updater === "function" ? updater(current) : updater;
    cache.set(key, { data: next, updatedAt: Date.now() });
    return next;
}

export function invalidateQueries(prefix = "") {
    for (const key of cache.keys()) {
        if (!prefix || key.startsWith(prefix)) cache.delete(key);
    }
}

export function clearQueryCache() {
    cache.clear();
    inFlight.clear();
}
