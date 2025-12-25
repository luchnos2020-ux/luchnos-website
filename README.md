# Lampe Allumee (Luchnos)

> **Presenter Yehoshoua car IL revient**

Site web statique pour le ministere "Lampe Allumee (Luchnos)" - Un ministere dedie a l'evangelisation et a l'edification du corps du Christ.

## Structure du Projet

```
luchnos-website/
├── index.html              # Page d'accueil
├── presentation.html       # Page de presentation
├── qui-sommes-nous.html    # Page "Qui sommes-nous"
├── multimedia.html         # Page des videos
├── edition.html            # Page des livres (Edition Plumage)
├── evenements.html         # Page des evenements
├── contact.html            # Page de contact
├── dons.html               # Page des dons
├── css/
│   ├── style.css           # Styles principaux
│   └── 3d-effects.css      # Effets 3D pour les livres et cartes
├── js/
│   ├── main.js             # JavaScript partage (header, footer, utilitaires)
│   ├── home.js             # Carousel et logique de la page d'accueil
│   ├── multimedia.js       # Filtrage et affichage des videos
│   ├── edition.js          # Filtrage et affichage des livres
│   └── evenements.js       # Filtrage et affichage des evenements
├── data/
│   └── data.json           # Donnees du site (livres, videos, evenements)
└── assets/
    └── images/             # Images du site
        └── logo.png        # Logo Luchnos
```

## Hebergement sur GitHub Pages

### Option 1: Branche principale

1. Allez dans les parametres de votre repository GitHub
2. Cliquez sur "Pages" dans le menu lateral
3. Sous "Source", selectionnez "Deploy from a branch"
4. Selectionnez la branche `main` et le dossier `/luchnos-website`
5. Cliquez sur "Save"

### Option 2: Branche gh-pages

1. Creez une branche `gh-pages` contenant uniquement le contenu du dossier `luchnos-website`
2. Dans les parametres GitHub Pages, selectionnez la branche `gh-pages`

## Configuration pour les collaborateurs

### Encodage UTF-8 (OBLIGATOIRE)

Ce projet utilise UTF-8 pour supporter les caractères français. **Tous les collaborateurs doivent:**

1. **Activer le hook de validation:**
   ```bash
   git config core.hooksPath .githooks
   ```

2. **Vérifier l'encodage avant de commit:**
   ```bash
   node scripts/validate-encoding.js
   ```

3. **Configurer leur éditeur pour UTF-8** (VS Code lit automatiquement `.editorconfig`)

Si vous voyez `Ã©` au lieu de `é`, le fichier n'est pas en UTF-8. Voir `CONTRIBUTING.md` pour plus de détails.

## Developpement Local

Pour tester le site localement, utilisez un serveur HTTP simple:

```bash
# Avec Python 3
cd luchnos-website
python -m http.server 8000

# Avec Node.js (npx)
cd luchnos-website
npx serve

# Avec VS Code Live Server
# Installez l'extension "Live Server" et cliquez sur "Go Live"
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

## Gestion du Contenu

Tout le contenu dynamique est stocke dans `data/data.json`. Pour modifier:

### Ajouter un livre

```json
{
  "id": 4,
  "titre": "Nouveau Livre",
  "auteur": "Nom de l'auteur",
  "description": "Description du livre...",
  "image": "assets/images/livre-couverture.jpg",
  "pdfUrl": "lien-vers-le-pdf.pdf",
  "nombrePages": 150,
  "theme": "Vie Chretienne",
  "langue": "Francais",
  "gratuit": true,
  "prix": 0
}
```

### Ajouter une video

```json
{
  "id": 4,
  "titre": "Titre de la video",
  "description": "Description...",
  "youtubeId": "ID_YOUTUBE",
  "youtubeUrl": "https://www.youtube.com/watch?v=ID_YOUTUBE",
  "thumbnail": "https://img.youtube.com/vi/ID_YOUTUBE/maxresdefault.jpg",
  "categorie": "Enseignement",
  "auteur": "Luchnos Lampe Allumee",
  "datePublication": "2025-01-15"
}
```

### Ajouter un evenement

```json
{
  "id": 4,
  "titre": "Nouvel Evenement",
  "description": "Description de l'evenement...",
  "date": "2025-06-15",
  "heure": "19:00",
  "lieu": "Ville, Pays",
  "type": "conference",
  "statut": "a_venir",
  "image": "assets/images/event.jpg"
}
```

**Types d'evenements**: `conference`, `seminaire`, `culte`, `reunion`, `autre`

**Statuts**: Le statut est calcule automatiquement en fonction de la date (`a_venir`, `en_cours`, `termine`)

## Personnalisation

### Couleurs (css/style.css)

Les couleurs sont definies dans les variables CSS:

```css
:root {
  --primary: #191F34;      /* Bleu marine - fond principal */
  --gold: #FFC100;         /* Or - titres et accents */
  --copper: #CC7447;       /* Cuivre - elements decoratifs */
  --accent-green: #2D7A3E; /* Vert - cartes evenements */
  --accent-orange: #E67E22;/* Orange - boutons secondaires */
}
```

### Informations du site

Modifiez la section `site` dans `data/data.json`:

```json
{
  "site": {
    "name": "Lampe Allumee (Luchnos)",
    "tagline": "Presenter Yehoshoua car IL revient",
    "email": "Luchnos2020@gmail.com",
    "phone": "+241 62 56 29 10",
    "socialLinks": {
      "facebook": "https://facebook.com/...",
      "youtube": "https://youtube.com/...",
      "instagram": "https://instagram.com/...",
      "whatsapp": "https://whatsapp.com/..."
    }
  }
}
```

## Technologies Utilisees

- HTML5
- CSS3 (Vanilla CSS, pas de framework)
- JavaScript (ES6+, Vanilla JS)
- [Swiper.js](https://swiperjs.com/) - Carousel (CDN)
- [Google Fonts](https://fonts.google.com/) - Inter

## Contact

- Email: Luchnos2020@gmail.com
- Email: fillesdesaray@gmail.com
- Telephone: +241 62 56 29 10

---

**Maranatha - Notre Seigneur vient!**
