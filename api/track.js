const h = require('../_lib/handler');
module.exports = h((c, q) => c.getMetaData({ url: q.url }));
