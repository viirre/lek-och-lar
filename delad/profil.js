/*
 * Delad profil för startsidan och alla kurser.
 * Namnet sparas i localStorage, så varje enhet minns vem som spelar.
 * Framsteg sparas per namn, så syskon på samma enhet har egna bockar.
 */
(() => {
  'use strict';
  const AKTIV = 'lekochlar:aktiv';
  const PROFILER = 'lekochlar:profiler';
  const MAX_LANGD = 30;

  const read = (key, fallback) => {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  };
  const clean = n => String(n || '').replace(/\s+/g, ' ').trim().slice(0, MAX_LANGD);
  const same = (a, b) => a.toLocaleLowerCase('sv') === b.toLocaleLowerCase('sv');

  const LekOchLar = {
    namn: () => clean(read(AKTIV, '')),

    profiler: () => {
      const p = read(PROFILER, []);
      return Array.isArray(p) ? p.map(clean).filter(Boolean) : [];
    },

    valj(namn) {
      namn = clean(namn);
      if (!namn) return false;
      const rest = LekOchLar.profiler().filter(n => !same(n, namn));
      write(PROFILER, [namn, ...rest].slice(0, 12));
      write(AKTIV, namn);
      return true;
    },

    glom(namn) {
      write(PROFILER, LekOchLar.profiler().filter(n => !same(n, namn)));
      if (same(LekOchLar.namn(), clean(namn))) LekOchLar.bytPerson();
    },

    bytPerson: () => {
      try { localStorage.removeItem(AKTIV); } catch (e) {}
    },

    // Svensk genitiv: "Alicias", men "Max" och "Lukas" utan extra s.
    genitiv: (namn = LekOchLar.namn()) => /[sxz]$/i.test(namn) ? namn : namn + 's',

    // Nyckel för en kurs framsteg, unik per person.
    nyckel: kurs => 'lekochlar:' + kurs + ':' + LekOchLar.namn().toLocaleLowerCase('sv'),

    // För text som byggs med innerHTML.
    escape: s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),

    // Anropas i <head> på varje kurs. Saknas namn skickas man till startsidan och sedan tillbaka.
    kravNamn(kurs, start = '../../') {
      if (LekOchLar.namn()) return true;
      location.replace(start + '?kurs=' + encodeURIComponent(kurs));
      return false;
    },

    fyllNamn(root = document) {
      const n = LekOchLar.namn();
      root.querySelectorAll('[data-namn]').forEach(el => { el.textContent = n; });
      root.querySelectorAll('[data-namn-genitiv]').forEach(el => { el.textContent = LekOchLar.genitiv(n); });
    },
  };

  window.LekOchLar = LekOchLar;
  document.addEventListener('DOMContentLoaded', () => LekOchLar.fyllNamn());
})();
