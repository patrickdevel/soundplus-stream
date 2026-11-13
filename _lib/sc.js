// Direkter Zugriff auf api-v2 (nur für die erlaubten Abfragen in api/explore.js)
const { getFreshClientID } = require('../src/plugin/client-id');
const { ua } = require('../src/plugin/user-agent');
let cid, at = 0;
const clientId = async () => {
  if (!cid || Date.now() - at > 36e5) { cid = await getFreshClientID(ua); at = Date.now(); }
  return cid;
};
exports.get = async (path, params = {}) => {
  const u = new URL('https://api-v2.soundcloud.com' + path);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  u.searchParams.set('client_id', await clientId());
  const r = await fetch(u, { headers: { 'User-Agent': ua } });
  if (!r.ok) throw new Error('SoundCloud antwortete mit Status ' + r.status);
  return r.json();
};
const art = u => (u ? u.replace('-large.', '-t500x500.') : null);
exports.track = t => ({
  id: t.id, title: t.title, permalinkUrl: t.permalink_url, duration: t.duration, genre: t.genre,
  artworkUrl: art(t.artwork_url || t.user?.avatar_url),
  artist: { id: t.user?.id, username: t.user?.username, profileUrl: t.user?.permalink_url },
  stats: { plays: t.playback_count, likes: t.likes_count },
});
exports.user = u => ({
  id: u.id, username: u.username, permalinkUrl: u.permalink_url, avatarUrl: art(u.avatar_url),
  followers: u.followers_count, tracks: u.track_count, verified: !!u.verified,
});
exports.list = p => ({
  id: p.id, title: p.title, permalinkUrl: p.permalink_url, trackCount: p.track_count,
  artworkUrl: art(p.artwork_url || p.tracks?.[0]?.artwork_url || p.user?.avatar_url),
  artist: { username: p.user?.username },
});
