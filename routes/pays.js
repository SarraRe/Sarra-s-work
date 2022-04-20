const router = require('express').Router();
const connection = require('../connection');



router.get('/', (req, res) => {
    connection.query('SELECT * from pays', function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});

router.get('/:code', (req, res) => {
    const code = req.params.code;
    connection.query('SELECT * from pays where id =?', code, function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});

//ajout avec pays 
router.post('/add', (req, res) => {
    const code = req.body.code;
    const Pays  = req.body.Pays;

    const query = `INSERT INTO clients (id,Pays) VALUES (?,?)`;
    connection.query(query, [code, Pays], function (error, results, fields) {
        if (error) throw error;
        else {
            res.status('200').send('pays ajouté.');
        }
    });

});


module.exports = router;