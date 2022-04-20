const router = require('express').Router();
const connection = require('../connection');


router.get('/produits_client', (req, res) => {
    connection.query(`
    SELECT * FROM (SELECT prcl.clients_Code, prcl.Produits_id, GROUP_CONCAT(prcl.Nombre_de_postes) AS nbrDePostes, GROUP_CONCAT(prcl.Numéro_de_série) AS numDeSerie, GROUP_CONCAT(pr.Nom) AS logiciels
    FROM produits_clients prcl, produits pr
    WHERE prcl.Produits_id=pr.id 
    GROUP BY prcl.clients_Code) t
    RIGHT JOIN clients cl ON cl.Code=t.clients_Code
    `, function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});



router.get('/:clients_Code', (req, res) => {
    const clients_Code = req.params.clients_Code;
    connection.query(`
    SELECT * FROM (SELECT prcl.clients_Code, GROUP_CONCAT(pr.Nom) AS logiciels
    FROM produits_clients prcl, produits pr
    WHERE prcl.Produits_id=pr.id
    GROUP BY prcl.clients_Code) t
    WHERE t.clients_Code=?` , clients_Code, function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});

router.post('/add', (req, res) => {
    const clients_Code = req.body.clients_Code;
    const Produits_id = req.body.Produits_id;
    const Nombre_de_postes = req.body.Nombre_de_postes;
    const Numéro_de_série = req.body.Numéro_de_série;
    const Observations = req.body.Observations;
    const query = `INSERT INTO produits_clients (clients_Code, Produits_id, Nombre_de_postes, Numéro_de_série, Observations) VALUES (?,?,?,?,?)`;
    connection.query(query, [clients_Code, Produits_id, Nombre_de_postes, Numéro_de_série, Observations], function (error, results, fields) {
        if (error) throw error;
        else {
            res.status('200').send('produit client ajouté.');
        }
    });
});

router.put('/:clients_Code', (req, res) => {
    const clients_Code = req.body.clients_Code;
    const Produits_id = req.body.Produits_id;
    const Nombre_de_postes = req.body.Nombre_de_postes;
    const Numéro_de_série = req.body.Numéro_de_série;
    const Observations = req.body.Observations;

    const sql = "UPDATE produits_clients SET Produits_id=?, Nombre_de_postes=?, Numéro_de_série=?, Observations=? WHERE clients_Code=?";
    connection.query(sql, [Produits_id, Nombre_de_postes, Numéro_de_série, Observations, clients_Code], function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("produit client updated.");
            res.status('200').send('produit client updated.');
        }
    });
});


router.delete('/:clients_Code', (req, res) => {
    const clients_Code = req.params.clients_Code;
    const sql = "DELETE FROM produits_clients WHERE clients_Code=?"
    connection.query(sql, clients_Code, function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("produit client supprimée");
            res.status('200').send('produit client supprimée.');
        }
    });
})


module.exports = router;