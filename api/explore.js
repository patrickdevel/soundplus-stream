const h = require('../_lib/handler');
const sc = require('../_lib/sc');

const num = v => { const n = parseInt(v, 10); if (!n || n < 0) throw new Error('Ungültige ID'); return n; };

module.exports = h(async (_c, q) => {
  switch (q.type) {
    case 'trending': {
      const genre = /^[a-z0-9-]+$/.test(q.genre || '') ? q.genre : 'all-music';
      const d = await sc.get('/charts', { kind: q.kind === 'top' ? 'top' : 'trending', genre: 'soundcloud:genres:' + genre, limit: 30 });
      return d.collection.map(x => sc.track(x.track)).filter(t => t.title);
    }
    case 'user_tracks': {
      const d = await sc.get(`/users/${num(q.id)}/tracks`, { limit: 40 });
      return d.collection.map(sc.track).filter(t => t.title);
    }
    case 'user_playlists': {
      const d = await sc.get(`/users/${num(q.id)}/playlists_without_albums`, { limit: 30 });
      return d.collection.map(sc.list);
    }
    case 'related': {
      const d = await sc.get(`/tracks/${num(q.id)}/related`, { limit: 20 });
      return d.collection.map(sc.track).filter(t => t.title);
    }
    case 'users': {
      const d = await sc.get('/search/users', { q: String(q.q || ''), limit: 20 });
      return d.collection.map(sc.user);
    }
    case 'playlists': {
      const d = await sc.get('/search/playlists_without_albums', { q: String(q.q || ''), limit: 20 });
      return d.collection.map(sc.list);
    }
  }
  throw new Error('Unbekannter Typ');
});
