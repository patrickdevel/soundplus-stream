const h = require('../_lib/handler');
module.exports = h((c, q) => c.getProfile({ username: q.u }));
