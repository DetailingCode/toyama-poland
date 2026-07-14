# Toyama Polska — przegląd projektu

Statyczna strona WWW dystrybutora Toyama w Polsce (akumulatory żelowe/AGM/LiFePO4 + ładowarki TBC). Czysty HTML/CSS/JS, bez frameworka/buildu — pliki serwowane bezpośrednio.

## Struktura

```
index.html              strona główna
akumulatory.html         lista serii akumulatorów
seria-npc.html           seria NPC
seria-npg.html           seria NPG
seria-npcg.html          seria NPCG
seria-npm.html           seria NPM
seria-lc.html             seria LC (węglowe)
seria-lfp.html            seria LiFePO4
ladowarki.html            lista ładowarek TBC
tbc4a3s.html … tbc20a4s.html   10 podstron pojedynczych modeli ładowarek
akcesoria.html            pokrowce
gdziekupic.html           lista dystrybutorów (dane w js/dealers-data.js)
kontakt.html
private.html              polityka prywatności
warunki-strony.html       regulamin

css/main.css               cały styl strony
js/main.js                  loader, scroll reveal, licznik statystyk, nawigacja mobilna, cookie banner
js/dealers-data.js          dane dystrybutorów dla gdziekupic.html
image/                      loga, tła, zdjęcia produktów (battery/, charger/, acc/)
```

## Konwencje

- Każda podstrona ma identyczny header (nav + mobile-panel) i footer — kopiowane 1:1 między plikami.
- Sekcje budowane z klas: `.section`, `.section-head`, `.card-grid`, `.callout-grid`, `.related-strip`, `.spec-table`, `.capacity-counter`.
- Animacje wejścia przez klasę `.reveal` (+ `.reveal-delay-1/2/3`), obsługiwane w `js/main.js`.
- Strony produktowe kończą się sekcją "Kompatybilne ładowarki" i/lub "Zobacz też" (linki do powiązanych serii/modeli).

## Jak wznowić pracę po restarcie okna

Przeczytaj `SESSION_LOG.md` (najnowszy wpis na górze) — tam jest zapis co było robione i co zostało do zrobienia.
