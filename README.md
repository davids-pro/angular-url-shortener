# URL Shortener application web

## Fonctionnalités

- **Raccourcissement d'URLs**. URL Shortener est une application mobile permettant de réduire drastiquement n'importe quelle URL en une URL courte du type *https://mondomaine/id* avec un id unique sur 6 caractères.
- **Création de compte**. L'application permet de créer un compte utilisateur. Une fois enregistré, l'utilisateur aura la possibilité de personnaliser ses ids *https://mondomaine/mon-id*, si disponibles car ils doivent rester uniques, et pourra accéder à une interface d'adminstration d'où il pourra retrouver tous les liens générés, les supprimer si besoin mais aussi monitorer leurs nombres de clicks.
- **Création de QR Code**. Chaque URL générée sera accompagnée d'un QR Code.
- **Intégration sur réseaux sociaux**. Les URLs générées imitent parfaitement leur destination et l'utilisateur bénéficie ainsi d'une intégration parfaite avec aperçu sur les différents réseaux sociaux.
- **Rapidité**. La génération de lien ainsi que leur consultation, et donc la redirection vers la page d'origine, est quasiment instantanée.
- **Sécurité**. Toutes les données utilisateurs sont cryptées par l'API et stockés ensuite dans cet état en base de donnée. Les données locales (cookies) sont composées de tokens sécurisés JWT.


## Technologies

- **Angular CLI 10**. Framework de développement applicatif. *https://cli.angular.io/*
- **Boostrap 4**. Framework CSS. *https://getbootstrap.com/*
- **Ngx Cookie Service**. Librairie pour cookies. *https://www.npmjs.com/package/ngx-cookie-service*

## Installation

```bash
npm install
```

## Environnement

L'adresse de l'API doit être renseignée dans la variable *apiEndPoint* du fichier

```bash
src/environments/environment.ts
```

## Démarrage

```bash
ng serve --open
```

## License

License ISC - Internet Systems Consortium License

Créé par David Somaré - https://github.com/davids-pro