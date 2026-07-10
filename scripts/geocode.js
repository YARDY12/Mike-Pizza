(async () => {
  const q = 'Av. Argentina cuadra 2, Nuevo Chimbote 02710';
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mike-Pizza-App/1.0 (contact: none)' } });
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    console.error('Geocode error', e);
    process.exit(1);
  }
})();