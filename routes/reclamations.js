const router = require('express').Router();
const connection = require('../connection');

router.get('/', (req, res) => {
    connection.query('SELECT * from reclamation', function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});
router.get('/alltype', (req, res) => {
    connection.query('SELECT * from types_réclamations', function (error, results, fields) {
        if (error) throw error;
        else res.json(results)
    });
});
router.get('/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * from reclamation where id=?', id, function (error, results, fields) {
        if (error) throw error;
        else res.json(results)
    });
});
router.get('/client/:id', (req, res) => {
    const id = req.params.id;
        connection.query('SELECT * from reclamation where clients_id =?', id, function (error, results, fields) {
        if (error) throw error;
        else res.json(results)
    });
});
router.get('/revendeur/:id' , (req,res) => {
    const id = req.params.id;
        connection.query('SELECT * from reclamation where revendeur_id =?', id, function (error, results, fields) {
        if (error) throw error;
        else res.json(results)
    });
})
//fct pour afficher les types des réclamations
// router.get('/ty', (req, res) => {
//     const id = req.params.id;
//     connection.query('SELECT Types_réclamations_id from reclamation', function (error, results, fields) {
//         if (error) throw error;
//         else res.send(results)
//     });
// });

//lezem naamel kifeh j'affiche les réclamations mta3 il clients bel clients ID


router.post('/add', (req, res) => {
    const date = req.body.date;
    const nom_prénom = req.body.nom_prénom;
    const mail = req.body.mail;
    const téléphone = req.body.téléphone;
    const objet = req.body.objet;
    const clients_id = req.body.clients_id;
    const Types_réclamations_id = req.body.Types_réclamations_id;
    const produits_id = req.body.produits_id;
    const revendeur_id = req.body.revendeur_id;

    const query = `INSERT INTO reclamation (date, nom_prénom, mail, téléphone, objet, clients_id, Types_réclamations_id, produits_id, revendeur_id) VALUES (?,?,?,?,?,?,?,?,?)`;
    connection.query(query, [date, nom_prénom, mail, téléphone, objet, clients_id, Types_réclamations_id, produits_id,revendeur_id], function (error, results, fields) {
        if (error) throw error;
        else {
            res.status('200').json('réclamation déposée.');
        }
    });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM reclamation WHERE id=?"
    connection.query(sql, id, function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("réclamation supprimée");
            res.status('200').send('réclamation supprimée.');
        }
    });
})

router.put('/:id', (req, res) => {
    const id = req.body.id;
    const nom_prénom = req.body.nom_prénom;
    const mail = req.body.mail;
    const téléphone = req.body.téléphone;
    const objet = req.body.objet;
    const clients_id = req.body.clients_id;
    const Types_réclamations_id = req.body.Types_réclamations_id;
    const produits_id = req.body.produits_id;
    
    
        
            const sql = "UPDATE reclamation SET nom_prénom=?, mail=?, téléphone=?, objet=?, clients_id=?, Types_réclamations_id=?, produits_id=? WHERE id=?";
            connection.query(sql, [nom_prénom, mail, téléphone, objet, clients_id, Types_réclamations_id, produits_id, id], function (error, results, fields) {
                if (error) throw error;
                else {
                    console.log("réclamation updated.");
                    res.status('200').send('réclamation updated.');
                }
            });
});

//pour mettre à jour l'état de la réclamation
router.put('/put/:id', (req, res) => {
    const id = req.body.id;
    const etat_rec = req.body.etat_rec;
    
        
            const sql = "UPDATE reclamation SET etat_rec=? WHERE id=?";
            connection.query(sql, [etat_rec, id], function (error, results, fields) {
                if (error) throw error;
                else {
                    console.log("réclamation updated.");
                    res.status('200').send('réclamation updated.');
                }
            });
});

module.exports = router;
