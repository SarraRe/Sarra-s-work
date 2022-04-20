const router = require('express').Router();
const connection = require('../connection');
const jwt = require('jsonwebtoken');



router.post('/connection/client', (req, res) => {
    const  email  = req.body.Mail;
    const password = req.body.MotDePasse;
    let appData = {
        "error": 1,
        "role": "",
        "data":""

    };
   connection.query('SELECT * FROM clients WHERE Mail  = ?', [email], function(err, rows, fields) {
    if (err) {
        appData.error = 1;
        appData["data"] = "Error Occured!";
        res.status(400).json(appData);
    } else {
        if (rows.length > 0) {
            if (rows[0].MotDePasse == password) {
                 delete rows[0].password
                 rows[0].role = 'client'
                 console.log(JSON.stringify(rows[0]) )
              //   let token = rows[0]
                 let token = jwt.sign(JSON.stringify(rows[0]),"cates");
                appData.error = 0;
                appData["token"] = token;
                appData.role ="client"
                res.status(200).json(appData);
            } else {
                appData.error = 1;
                appData["data"] = "Soit l'Email soit le mot de passe est faux";
                res.status(200).json(appData);
            }
        } else {
            appData.error = 1;
            appData["data"] = "Les informations saisies sont fausses!";
            res.status(200).json(appData);
        }
    }

})
})

router.post('/connection/revendeur', (req, res) => {
    const  email  = req.body.Mail;
    const password = req.body.MotDePasse;
    let appData = {
        "error": 1,
        "role": "",
        "data":"" 
    };
   connection.query('SELECT * FROM  revendeur WHERE Mail  = ?', [email], function(err, rows, fields) {
    if (err) {
        appData.error = 1;
        appData["data"] = "Error Occured!";
        res.status(400).json(appData);
    } else {
        if (rows.length > 0) {
            if (rows[0].motDePasse == password) {
                 delete rows[0].password
                 rows[0].role = 'revendeur'
                let token = jwt.sign(JSON.stringify(rows[0]),"cates");
                appData.error = 0;
                appData["token"] = token;
                appData.role ="revendeur"
                res.status(200).json(appData);
            } else {
                appData.error = 1;
                appData["data"] = "Soit l'Email soit le mot de passe est faux";
                res.status(200).json(appData);
            }
        } else {
            appData.error = 1;
            appData["data"] = "Les informations saisies sont fausses!";
            res.status(200).json(appData);
        }
    }

})
})

router.post('/connection/autre', (req, res) => {
    const  email  = req.body.Mail;
    const password = req.body.MotDePasse;
    let appData = {
        "error": 1,
        "data": "",
        "role":""
    };
   connection.query('SELECT * FROM  personnels WHERE Mail  = ?', [email], function(err, rows, fields) {
    if (err) {
        appData.error = 1;
        appData["data"] = "Error Occured!";
        res.status(400).json(appData);
    } else {
        if (rows.length > 0) {
           
            if (rows[0].motDePasse == password) {
                 delete rows[0].password
                 rows[0].role = 'personnel'
                let token = jwt.sign(JSON.stringify(rows[0]),"cates");
                appData.error = 0;
                appData["token"] = token;
                appData["role"]="personnel"
                res.status(200).json(appData);
            } else {
                appData.error = 1;
                appData["data"] = "Soit l'Email du personnel soit le mote de passe est faux";
                res.status(200).json(appData);
            }
        } else {
            connection.query('SELECT * FROM  admin WHERE Mail   = ?', [email], function(err, rows, fields) {
                if (err) {
                    appData.error = 1;
                    appData["data"] = "Error Occured!";
                    res.status(400).json(appData);
                } else {
                    if (rows.length > 0) {
                       
                        if (rows[0].MotDePasse == password) {
                             delete rows[0].password
                             rows[0].role = 'admin'
                            let token = jwt.sign(JSON.stringify(rows[0]),"cates");
                            appData.error = 0;
                            appData["token"] = token;
                            res.status(200).json(appData);
                        } else {
                            appData.error = 1;
                            appData["data"] = "Soit l'Email soit le mot de passe de l'admin est faux";
                            res.status(200).json(appData);
                        }
                    }
                else {
             appData.error = 1;
            appData["data"] = "Les informations saisies sont fausses!";
            res.status(200).json(appData);
                }
                }})
               

            
                }
        }
    

})
})




module.exports = router;