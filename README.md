# Prototype d'architecture découplée Front End / Back End

## Docker

### Lancement des services

`docker-compose up`

### Fermeture des services

`docker-compose stop`

### Consultation des services en cours d'exécution

`docker-compose ps`

### Installation des dépendances NPM du service API

Avant la première utilisation et après chaque mise à jour des dépendances du projet dans le fichier package.json

`docker-compose run prototype_architecture_decouplee_api npm install`

## Base de données

Passer par Adminer pour l'import de la base de données MySQL

#### Connexion à Adminer

Système : mysql
Serveur : 
Utilisateur : 
Mot de passe : 
Base de données : 

# Documentation des dépendances tierces 

## ORM : Objection.js

https://vincit.github.io/objection.js/

## SQL Query Builder : Knex.js

https://knexjs.org/

## JSON WEB TOKEN 

https://jwt.io/

## Password Encryption : Bcrypt.js

https://github.com/dcodeIO/bcrypt.js

## Adminer

https://www.adminer.org/

Importer l'archive du schéma de la base de données avec Adminer

`./backend/db/architecture_decouplee_db.sql.gz`


## MariaDB

https://mariadb.org/

## Strapi

### Install Strapi + MariaDB with Docker
https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/installation/docker.html


---

**Alexandre Leroux**

- _Mail_ : alex@sherpa.one
- _Github_ : sherpa1
- _Twitter_ : @_sherpa_
- _Discord_ : sherpa#3890

_Enseignant vacataire à l'Université de Lorraine_

- IUT Nancy-Charlemagne (LP Ciasie)

- Institut des Sciences du Digital, Management & Cognition (Masters Sciences Cognitives)
