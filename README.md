# Maison Anila — Scott Anila, chef privé

Site vitrine statique (HTML / CSS / JavaScript), publié via GitHub Pages :
https://scottanila.github.io/scott-anila-chef/

```
docs/index.html            page unique (texte français)
docs/assets/js/i18n.js     traductions anglaises
docs/assets/js/main.js     animations (GSAP, ScrollTrigger, Lenis)
docs/assets/css/style.css  styles et palette
docs/assets/img, video     médias optimisés pour le web
```

Toute modification poussée sur `main` est mise en ligne automatiquement
(`npm run build` se contente de copier `docs/` vers `dist/` pour le workflow existant).
Version anglaise directe : https://scottanila.github.io/scott-anila-chef/?lang=en

L'ancien site (React / Vite) est conservé dans la branche `ancien-site-react`.
