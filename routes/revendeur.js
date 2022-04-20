const router = require('express').Router();
const connection = require('../connection');
const nodemailer = require("nodemailer");



router.get('/', (req, res) => {
    connection.query('SELECT * from revendeur', function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * from revendeur where id=?', id, function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});

//pour l'ajout des candidature des revendeurs (état par défaut non fonctionnel)(ajout candidature)
router.post('/add', (req, res) => {
    const nomPrenom = req.body.nomPrenom;
    const societe = req.body.societe;
    const activité = req.body.activité;
    const adresse = req.body.adresse;
    const tel = req.body.tel;
    const Mail = req.body.Mail;
    const observations = req.body.observations;

    const query = `INSERT INTO revendeur (nomPrenom, societe, activité, adresse, tel, Mail, observations) VALUES (?,?,?,?,?,?,?)`;
    connection.query(query, [nomPrenom, societe, activité, adresse, tel, Mail, observations], function (error, results, fields) {
        if (error) throw error;
        else {
            res.status('200').send('Candidat revendeur ajouté.');
        }
    });
});

//pour ajouter les revendeur avec lesquels on travaille deja (avec etat par défaut fonctionnel et envoi automatique du mail)
router.post('/add/nr', (req, res) => {
    const nomPrenom = req.body.nomPrenom;
    const societe = req.body.societe;
    const activité = req.body.activité;
    const adresse = req.body.adresse;
    const tel = req.body.tel;
    const Mail = req.body.Mail;
    const observations = req.body.observations;
    const etat_rev = req.body.etat_rev;

    const query = `INSERT INTO revendeur (nomPrenom, societe, activité, adresse, tel, Mail, observations,etat_rev) VALUES (?,?,?,?,?,?,?,?)`;
    connection.query(query, [nomPrenom, societe, activité, adresse, tel, Mail, observations, etat_rev], function (error, results, fields) {
        if (error) throw error;
        else {
            res.status('200').send('Candidat revendeur ajouté.');
            console.log(req.body.Mail)


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
              Body+=  "<h3>Bonjour <span style='text-transform: capitalize;'>"+ req.body.nomPrenom+' ' + "</span></h3>  <p>Nous sommes <strong>très heureux de vous informer que votre compte a été créé avec succès.</strong></p>" ;
               Body+= "<p>Nous vous invitons à consulter  votre compte , votre mot de passe est rev123</p>";
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
                to: req.body.Mail,// list of receiver
                subject: "votre compte", // Subject line
                text: "bonjour,bonsoir voici votre mot de passe pour accéeder à notre site web mdp:rev123",
                html : Body
            }

            //send mail with defined transport object
            const info = transporter.sendMail(msg);
            console.log("Message sent: %s", info);

        }
    });

});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM revendeur WHERE id=?"
    connection.query(sql, id, function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("revendeur deleted");
            res.status('200').send('revendeur deleted.');
        }
    });
})

//pour accepter un revendeur (si accepté, état=> fonctionnel)   fazet il mail li fih el mdp si etat =fonctionnel!
router.put('/put/:id', (req, res) => {
    const id = req.body.id;
    const etat_rev = req.body.etat_rev;

    const sql = "UPDATE revendeur SET etat_rev=? WHERE id=?";
    connection.query(sql, [etat_rev, id], function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("revendeur accepté.");
            res.status('200').send('revendeur accepté.');
        }
    });
});

//celle-la pour mettre à jour les infos personnelles(mdp par défaut)
router.put('/:id', (req, res) => {
    const id = req.body.id;
    const nomPrenom = req.body.nomPrenom;
    const societe = req.body.societe;
    const activité = req.body.activité;
    const adresse = req.body.adresse;
    const tel = req.body.tel;
    const Mail = req.body.Mail;
    const observations = req.body.observations;


    const sql = "UPDATE revendeur SET nomPrenom=?, societe=?, activité=?, adresse=?, tel=?, Mail=?, observations=? WHERE id=?";
    connection.query(sql, [nomPrenom, societe, activité, adresse, tel, Mail, observations, id], function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("revendeur updated.");
            res.status('200').send('revendeur updated.');
        }
    });
});

//pour changer le mdp
router.put('/mdp/:id', (req, res) => {
    const id = req.body.id;
    const motDePasse = req.body.motDePasse;

    const sql = "UPDATE revendeur SET motDePasse=? WHERE id=?";
    connection.query(sql, [motDePasse, id], function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("mot de passe changé.");
            res.status('200').send('mot de passe changé.');
        }
    });
});

//affichage des réclamation d'un client selon son ID
router.get('/aff/:id', (req, res) => {
    const id = req.params.id;
    connection.query(`
    SELECT * FROM (SELECT rev.id, GROUP_CONCAT(rec.nom_prénom) AS NomRevendeur, GROUP_CONCAT(rec.clients_id)AS ClientID ,GROUP_CONCAT(rec.date) AS DatDepot, GROUP_CONCAT(rec.Types_réclamations_id) AS TypeReclamationID, GROUP_CONCAT(rec.produits_id) AS IDProduit, GROUP_CONCAT(rec.etat_rec) AS EtatReclamation, rec.objet
    FROM revendeur rev, reclamation rec
    WHERE rev.id=rec.revendeur_id
    GROUP BY rev.id) r
    WHERE r.id=?` ,id, function (error, results, fields) {
        if (error) throw error;
        else res.send(results)
    });
});
module.exports = router;