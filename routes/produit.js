const router = require('express').Router();
const connection = require('../connection');

router.get('/', (req, res) => {
    connection.query('SELECT * from produits', function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * from produits where id=?', id, function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});

router.post('/add', (req, res) => {
    const id = req.body.id;
    const Nom = req.body.Nom;
    const Observation = req.body.Observation;
    const query = `INSERT INTO produits (id, Nom, Observation) VALUES (?,?,?)`;
    connection.query(query, [id, Nom, Observation], function (error, results, fields) {
        if (error) throw error;
        else {
            res.status('200').send('produit ajouté.');
        }
    });
});

router.put('/:id', (req, res) => {
    const id = req.body.id;
    const Nom = req.body.Nom;
    const Observation = req.body.Observation;
    
        
            const sql = "UPDATE produits SET Nom=?, Observation=? WHERE id=?";
            connection.query(sql, [Nom, Observation, id], function (error, results, fields) {
                if (error) throw error;
                else {
                    console.log("produit mis à jour.");
                    res.status('200').send('produit mis à jour.');
                }
            });
});





module.exports = router;