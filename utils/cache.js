const cache = new Map();

exports.get = (key) => cache.get(key);

exports.set = (key, value, ttl = 60) => {
  cache.set(key, value);

  setTimeout(() => {
    cache.delete(key);
  }, ttl * 1000);
};

exports.del = (key) => cache.delete(key);
