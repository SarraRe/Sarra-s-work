const router = require('express').Router();
const connection = require('../connection');
const nodemailer = require("nodemailer");


router.get('/', (req, res) => {
    connection.query('SELECT * from personnels', function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});
router.get('/:id', (req, res) => {
    const id = req.params.id ;
    connection.query('SELECT * from personnels where id_personnel =?', id,  function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});

router.post('/add', async (req, res) => {
    const nom_prenom = req.body.nom_prenom;
    const mail = req.body.mail;
    const tel = req.body.tel;
    const query = `INSERT INTO personnels (nom_prenom,Mail , tel) VALUES (?,?,?)`;
    connection.query(query, [nom_prenom, mail, tel], async function (error, results, fields) {
        if (error) throw error;
        else {
            res.status('200').send('manager ajouté.');
            console.log(req.body.mail)

            //create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                   
                    user: 'sarrarefaismile@gmail.com',
                   
                    pass: 'FreshStart',
                },
            });
            let Body = "<html>";
            Body += "<div style='background: rgb(204,204,204); padding:20px'>";
            Body += "<div style='box-shadow: 0 0 0.5cm rgba(0,0,0,0.5); width:500px;margin:auto ; padding :30px; background:white'>"; 
              Body += "<img src='https://www.choisirmonerp.com/Content/images/rubrics/fr-FR/erp-definition-2.png' style='margin:auto;width: 20%;display: block'>"; 
              Body+=  "<h3>Bonjour <span style='text-transform: capitalize;'>"+ req.body.nom_prenom+' ' + "</span></h3>  <p>Nous sommes <strong>très heureux de vous informer que votre compte a été créé avec succès.</strong></p>" ;
               Body+= "<p>Voici votre mot de passe: per123 pour pouvoir accéder et gérer notre site web</p>";
               Body+=  "<a href='http://localhost:3000/auth1' style='text-decoration: none;'>  <button style='display:block;border: none;outline:none;background: none;padding:10px; background-color:#1890ff;color:white;border-radius:10px; margin:auto'><strong>Me connecter à mon compte</strong></button>  </a>"; 
           Body += "<p>Bonne journée</p>  </div></div>";
           Body += "</html>";
            const msg = {
                headers: {
                    "x-priority": "1",
                    "x-msmail-priority": "High",
                    importance: "high"
                 },
                from: 'sarrarefaismile@gmail.com', // sender address
                to: req.body.mail,// list of receiver
                subject: "votre compte", // Subject line
                text: "bonsoir voici votre mot de passe pour accéeder et gérer note site web : per123",
                html : Body
            }

            //send mail with defined transport object
            const info = await transporter.sendMail(msg);
            console.log("Message sent: %s", info);
        }
    });
});

router.delete('/:id_personnel', (req, res) => {
    console.log(req);
    const id_personnel = req.params.id_personnel;
    const sql = "DELETE FROM personnels WHERE id_personnel=?"
    connection.query(sql, id_personnel, function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("manager supprimé");
            res.status('200').send('manager supprimé.');
        }
    });
});

//celle-la pour mettre à jour les infos personnelles(avec mdp par défaut)
router.put('/:id_personnel', (req, res) => {
    const id_personnel = req.body.id_personnel;
    const nom_prenom = req.body.nom_prenom;
    const mail = req.body.mail;
    const tel = req.body.tel;

    const sql = "UPDATE personnels SET nom_prenom=?, mail=?, tel=? WHERE id_personnel=?";
    connection.query(sql, [nom_prenom, mail, tel, id_personnel], function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("manager updated.");
            res.status('200').send('manager updated.');
        }
    });
});

//pour changer le mdp
// router.put('/put/:id_personnel', (req, res) => {
//     const id_personnel = req.body.id_personnel;
//     const motDePasse = req.body.motDePasse;

//     const sql = "UPDATE personnels SET motDePasse=? WHERE id_personnel=?";
//     connection.query(sql, [motDePasse, id_personnel], function (error, results, fields) {
//         if (error) throw error;
//         else {
//             console.log("mot de passe changé.");
//             res.status('200').send('mot de passe changé.');
//         }
//     });
// });


module.exports = router;