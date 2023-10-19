"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useXCache = void 0;
var react_1 = require("react");
var XCache = {};
var useXCache = function (cacheName) {
    if (!XCache[cacheName]) {
        XCache[cacheName] = {
            cache: new Map(),
            listenerCount: 0,
        };
    }
    var cacheInstance = XCache[cacheName];
    var get = (0, react_1.useCallback)(function (key) {
        var serializedKey = JSON.stringify(key);
        return cacheInstance.cache.has(serializedKey)
            ? cacheInstance.cache.get(serializedKey)
            : undefined;
    }, []);
    var set = (0, react_1.useCallback)(function (key, value) {
        var serializedKey = JSON.stringify(key);
        cacheInstance.cache.set(serializedKey, JSON.parse(JSON.stringify(value)));
    }, []);
    var remove = (0, react_1.useCallback)(function (key) {
        var serializedKey = JSON.stringify(key);
        cacheInstance.cache.delete(serializedKey);
    }, []);
    var addListener = (0, react_1.useCallback)(function () {
        cacheInstance.listenerCount += 1;
    }, []);
    var removeListener = (0, react_1.useCallback)(function () {
        cacheInstance.listenerCount -= 1;
        if (cacheInstance.listenerCount === 0) {
            // No listeners remaining, delete the cache to free up memory
            delete XCache[cacheName];
        }
    }, []);
    var clearAll = (0, react_1.useCallback)(function () {
        cacheInstance.cache = new Map();
    }, [cacheName]);
    (0, react_1.useEffect)(function () {
        // When the component mounts, add itself as a listener
        addListener();
        // Clean up the listener when the component unmounts
        return function () {
            removeListener();
        };
    }, [addListener, removeListener, cacheName]);
    return { get: get, set: set, remove: remove, addListener: addListener, removeListener: removeListener, clearAll: clearAll };
};
exports.useXCache = useXCache;
