const h = require('../_lib/handler');
module.exports = h((c, q) => c.getPlaylist({ url: q.url, limit: 'max' }));
