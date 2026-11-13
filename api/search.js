const h = require('../_lib/handler');
module.exports = h((c, q) => c.search({ query: q.q, limit: 20 }));
