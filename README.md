# Normad

## Installation
`npm install normad`

## Présentation
Ce module permet de normaliser une adresse postal française. 
Si plusieurs choix sont possibles, une modale s'ouvrira pour permettre à l'utilisateur de choisir la meilleure occurrence.

Le module utilise la modale de Bootstrap si ce dernier est utilisé dans le projet, sinon il ouvrira une modale construite dynamiquement. La CSS pourra être personnalisée.

## Paramétrage
Le module nécessite l'instanciation d'une variable `normaFields` pour lui permettre de reconnaître les champs contenant la ligne adresse, le code postal et la localité :
* address : Id du champ ligne adresse
* postcode : Id du champ code postal
* city : Id du champ commune
* partial : Permet de définir si la normalisation / contrôle se fait sur toute l'adresse ou uniquement sur l'association Code Postal / Commune. **true** si contrôle partiel, **false** sinon, auquel cas le champ *address* est obligatoire.

Le module permet de gérer plusieurs formulaires sur une même page ; il suffit de définir les champs à auditer dans une structure au préalable de l'ajout du script :
```
<!-- Audit d'un formulaire -->
<script type="text/javascript">
    var normaFields = {
        address: null,
        postcode: 'cp',
        city: 'commune',
        partial: true
    };
</script>
<script type="text/javascript" src="/path/to/normad.min.js"></script>
```

```
<!-- Audit de plusieurs formulaires -->
<script type="text/javascript">
    var normaFields = [{
        address: 'adresse1',
        postcode: 'cp1',
        city: 'commune1',
        partial: false
    },
    {
        address: 'adresse2',
        postcode: 'cp2',
        city: 'commune2',
        partial: false
    }];
</script>
<script type="text/javascript" src="/path/to/normad.min.js"></script>
```
## Personnalisation
La personnalisation des boutons se fait par l'ajout du script :
```
<!-- Audit d'un formulaire -->
<script type="text/javascript">
    var normaButtons = {
        cancel: {order: 1, label: 'Annuler'},
        submit: {order: 2, label: 'Valider mon choix'}
    };
</script>
```
## Capture d'évènement
Vous pouvez dans un script externe capturer le fait que la mise à jour ait été effectuée par Normad :
```
<script type="text/javascript">
    document.getElementById('<Locality Input Id>').addEventListener('change', e => {
        if (Normad.normalized === true) {
            // Address was normalized
        } else if (Normad.error !== null) {
            // Erreur rencontrée à la normalisation
        }
    });
</script>
```
## Exemples
* [Exemple avec Bootstrap](demos/index-bootstrap.html)
* [Exemple sans Bootstrap](demos/index.html)

Pour chaque bouton (cancel ou submit), on pourra définir l'ordre d'affichage et le texte affiché
## Versions
### In the future...
* Gestion multilingue
* Configuration de la modale, du titre, etc.
* Feuille de style personnalisée
* and so on...
### 1.4.0 (Juin 2022)
* Flag Normad.normalized indique si l'adresse a été normalisée ou non
### 1.3.3 (Avril 2022)
* Compatibilité Bootstrap < 4.x (nécessite JQuery pour la modale)
### 1.3.2 (Mars 2022)
* Personnalisation des boutons
### 1.2.1 (Février 2022)
* Compatibilité Bootstrap 4.0.x
### 1.2.0 (Novembre 2021)
* Compatibilité Bootstrap 4.x + Event Handler
### 1.1.1 (Octobre 2021)
* Compatibilité Bootstrap 5.x (Modale + Input-Group)
### 1.0.0 (Octobre 2021)
* Native JS