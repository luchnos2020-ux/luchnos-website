# Guide de Contribution - Luchnos Website

## Encodage UTF-8 (IMPORTANT)

Ce projet utilise **UTF-8** pour tous les fichiers texte. C'est obligatoire pour supporter les caractères français (é, è, à, ê, ç, etc.).

### Configuration requise

1. **Éditeur de code** : Configurez votre éditeur pour utiliser UTF-8 par défaut
   - VS Code : Déjà configuré via `.editorconfig`
   - Sublime Text : `File > Save with Encoding > UTF-8`
   - Notepad++ : `Encoding > Convert to UTF-8`

2. **Git** : Le fichier `.gitattributes` force UTF-8 automatiquement

### Avant de commit

1. Vérifiez que vos fichiers sont en UTF-8
2. Lancez le validateur : `node scripts/validate-encoding.js`
3. Si des erreurs sont détectées, ré-enregistrez les fichiers en UTF-8

### Caractères français courants

| Caractère | Code HTML | Description |
|-----------|-----------|-------------|
| é | `&eacute;` | e accent aigu |
| è | `&egrave;` | e accent grave |
| ê | `&ecirc;` | e accent circonflexe |
| à | `&agrave;` | a accent grave |
| â | `&acirc;` | a accent circonflexe |
| ô | `&ocirc;` | o accent circonflexe |
| î | `&icirc;` | i accent circonflexe |
| ù | `&ugrave;` | u accent grave |
| ç | `&ccedil;` | c cédille |
| œ | `&oelig;` | o-e liés |

### Problèmes d'encodage

Si vous voyez des caractères comme `Ã©` au lieu de `é`, le fichier n'est pas en UTF-8.

**Solution :**
1. Ouvrez le fichier dans un éditeur
2. Changez l'encodage en UTF-8
3. Ré-enregistrez le fichier
4. Vérifiez avec `node scripts/validate-encoding.js`

## Structure du projet

```
luchnos-website/
├── index.html          # Page d'accueil
├── css/                # Styles
├── js/                 # Scripts
├── data/
│   └── data.json       # Données du site (UTF-8 obligatoire!)
├── assets/             # Images et ressources
└── scripts/            # Scripts utilitaires
```

## Modifier les données

Les données sont dans `data/data.json`. Ce fichier DOIT être en UTF-8.

### Via l'admin panel (recommandé)
Utilisez le panneau d'administration pour modifier les données en toute sécurité.

### Manuellement
1. Éditez `data/data.json`
2. Assurez-vous que l'encodage est UTF-8
3. Validez le JSON (utilisez un validateur en ligne si nécessaire)
4. Lancez `node scripts/validate-encoding.js`
5. Commit et push

## Questions ?

Contactez l'équipe technique si vous avez des problèmes d'encodage.
