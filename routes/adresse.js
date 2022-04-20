const router = require('express').Router();
const connection = require('../connection');



router.get('/', (req, res) => {
    connection.query('SELECT * from cp_ville', function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});


;


module.exports = router;