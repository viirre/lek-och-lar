# Lek och lär

Små interaktiva övningar för barn, ett skolområde i taget. Allt är vanliga HTML filer utan byggsteg, publicerade med GitHub Pages.

Sidan: https://viirre.github.io/lek-och-lar/

## Så fungerar det

På startsidan skriver man sitt namn och väljer en kurs. Namnet sparas i webbläsarens localStorage, så sidan minns vem man är nästa gång. Flera personer kan använda samma enhet. Framsteg sparas per namn.

## Kurser

1. **Kemikoll för fjärdeklassare** (`kurser/kemikoll/`). Materia, atomer, vatten och ett låtsasprov.
2. **Atomernas värld** (`kurser/atomernas-varld/`). Atomer, joner, molekyler och värme för 13 till 14 åringar.

## Lägga till en kurs

1. Skapa `kurser/<id>/index.html`.
2. Lägg in de här raderna i `<head>`:

   ```html
   <script src="../../delad/profil.js"></script>
   <script>LekOchLar.kravNamn('<id>');</script>
   ```

3. Visa namnet med `<span data-namn></span>` (eller `data-namn-genitiv` för "Alicias"). I JavaScript finns `LekOchLar.namn()`, och `LekOchLar.nyckel('<id>')` ger en localStorage nyckel per person.
4. Lägg till kursen i `kurser.js`.

## Köra lokalt

```sh
python3 -m http.server
```

Öppna sedan http://localhost:8000.
