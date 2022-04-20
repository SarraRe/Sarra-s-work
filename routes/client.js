const router = require('express').Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const connection = require('../connection');
const nodemailer = require("nodemailer");
const Mail = require('nodemailer/lib/mailer');


router.get('/', (req, res) => {
    connection.query('SELECT * from clients', function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});

router.get('/:code', (req, res) => {
    const code = req.params.code;
    connection.query('SELECT * from clients where code=?', code, function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});

//ajout avec mdp par défaut
router.post('/add', (req, res) => {
    const code = req.body.code;
    const Nom = req.body.Nom;
    const Adresse = req.body.Adresse;
    const MatriculeFiscale = req.body.MatriculeFiscale;
    const Mail = req.body.Mail;
    const Contact = req.body.Contact;
    const CodeRevendeur = req.body.CodeRevendeur;
    const Observations = req.body.Observations;
    const Telephone = req.body.Telephone;
    const CP_Ville_CodePostal = req.body.CP_Ville_CodePostal;
    const Pays_id = req.body.Pays_id;
    const Activites_id = req.body.Activites_id;
    const query = `INSERT INTO clients (code, Nom, Adresse, MatriculeFiscale, Mail, Contact, CodeRevendeur, Observations, tel, CP_Ville_CodePostal, Pays_id, Activites_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
    connection.query(query, [code, Nom, Adresse, MatriculeFiscale, Mail, Contact, CodeRevendeur, Observations, Telephone, CP_Ville_CodePostal, Pays_id, Activites_id], function (error, results, fields) {
        if (error) throw error;
        else {
            res.status('200').send('client ajouté.');
            console.log(req.body.Mail)


            //create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    //user: Mail.clients.user, // generated ethereal user
                    user: 'sarrarefaismile@gmail.com',
                    //pass: MotDePasse.clients.pass, // generated ethereal password
                    pass: 'FreshStart',
                },
            });
            let Body = "<html>";
            Body += "<div style='background: rgb(204,204,204); padding:20px'>";
            Body += "<div style='box-shadow: 0 0 0.5cm rgba(0,0,0,0.5); width:500px;margin:auto ; padding :30px; background:white'>"; 
              Body += "<img src='https://www.choisirmonerp.com/Content/images/rubrics/fr-FR/erp-definition-2.png' style='margin:auto;width: 20%;display: block'>"; 
              Body+=  "<h3>Bonjour <span style='text-transform: capitalize;'>"+ req.body.Contact+' ' + "</span></h3>  <p>Nous sommes <strong>très heureux de vous informer que votre compte a été créé avec succès.</strong></p>" ;
               Body+= "<p>Nous vous invitons à consulter  votre compte , votre mot de passe est cl12345</p>";
               Body+=  "<a href='http://localhost:3000/auth1' style='text-decoration: none;'>  <button style='display:block;border: none;outline:none;background: none;padding:10px; background-color:#1890ff;color:white;border-radius:10px; margin:auto'><strong>Me connecter à mon compte</strong></button>  </a>"; 
               Body+=   "<p> Notre service clientèle est disponible pour répondre à toutes vos questions  </p>";
           Body += "<p>Bonne journée</p>  </div></div>";
           Body += "</html>";
            const msg = {
                headers: {
                    "x-priority": "1",
                    "x-msmail-priority": "High",
                    importance: "high"
                 },
                from: 'sarrarefaismile@gmail.com', // sender address
                to: req.body.Mail,// list of receiver
                subject: "votre compte", // Subject line
                text: "bonjour voici votre mot de passe pour accéeder à notre site web et suivre les états de vos réclamations mdp:cl12345",
                html : Body
            }

            //send mail with defined transport object
            const info = transporter.sendMail(msg);
            console.log("Message sent: %s", info);





        }
    });

});


//Pas de fct delete on veut garder les coordonnées de tous les clients

//pour changer le mdp
router.put('/put/:Code', (req, res) => {
    console.log(req.body.code);
    console.log(req.body.MotDePasse)
    const Code = req.body.code;
    const MotDePasse = req.body.MotDePasse;

    const sql = "UPDATE clients SET MotDePasse=? WHERE Code=?";
    connection.query(sql, [MotDePasse, Code], function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("mot de passe changé.");
            res.status('200').send('mot de passe changé.');
        }
    });
});

//pour mettre à jour les infos personnelles 
router.put('/mise/:code', (req, res) => {
    const code = req.body.code;
    const Nom = req.body.Nom;
    const Adresse = req.body.Adresse;
    const MatriculeFiscale = req.body.MatriculeFiscale;
    const Mail = req.body.Mail;
    const Contact = req.body.Contact;
    const CodeRevendeur = req.body.CodeRevendeur;
    const Observations = req.body.Observations;
    const Telephone = req.body.Telephone;
    const CP_Ville_CodePostal = req.body.CP_Ville_CodePostal;
    const Pays_id = req.body.Pays_id;
    const Activites_id = req.body.Activites_id;

    const sql = "UPDATE clients SET Nom=?, Adresse=?, MatriculeFiscale=?, Mail=?, Contact=?, CodeRevendeur=?, Observations=?, tel=?, CP_Ville_CodePostal=?, Pays_id=?, Activites_id=? WHERE code=?";
    connection.query(sql, [Nom, Adresse, MatriculeFiscale, Mail, Contact, CodeRevendeur, Observations, Telephone, CP_Ville_CodePostal, Pays_id, Activites_id, code], function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("client updated.");
            res.status('200').send('client updated.');






        }
    });

});

//affichage des réclamation d'un client selon son ID
router.get('/aff/:code', (req, res) => {
    const code = req.params.code;
    connection.query(`
    SELECT * FROM (SELECT cl.code, GROUP_CONCAT(cl.Nom) AS NomSociete, GROUP_CONCAT(cl.Contact)AS NomPersonne ,GROUP_CONCAT(rec.date) AS DatDepot, GROUP_CONCAT(rec.Types_réclamations_id) AS TypeReclamationID, GROUP_CONCAT(rec.produits_id) AS IDProduit, GROUP_CONCAT(rec.etat_rec) AS EtatReclamation, rec.objet
    FROM clients cl, reclamation rec
    WHERE cl.code=rec.clients_id
    GROUP BY cl.code) r
    WHERE r.code=?` ,code, function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});

//await ne marche seulement qu'avec les async fct mais on n'en a pas besoin ici
// l'envoi d'un mail automatiquement contenant le mdp
// router.post('/mail',(req, res) => {
//     console.log("mail")


//     // const { email } = req.body.mail;
//     console.log(req.body.mail)
//     //create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             //user: Mail.clients.user, // generated ethereal user
//             user: 'jaydon81@ethereal.email',
//             //pass: MotDePasse.clients.pass, // generated ethereal password
//             pass: 'K3sxh4dTmyr6CAcW18',
//         },
//     });
//     const msg = {
//         from: 'admin', // sender address
//         to: req.body.mail,// list of receiver
//         subject: "votre compte", // Subject line
//         text: "bonjour,bonsoir voici votre mot de passe pour accéeder à notre site web et suivre les états de vos réclamations mdp:cl12345",
//     }

//     //send mail with defined transport object
//     const info = transporter.sendMail(msg);
//     console.log("Message sent: %s", info);
// })

module.exports = router;