const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var randomstring = require("randomstring");

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));
var serviceAccount = require("./key.json");


var port = process.env.PORT || 3000;


var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://treasure-hunt-3c46e.firebaseio.com"
});

var db = admin.firestore();

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/details", (req, res) => {
    getDetails().then((docs) => {
        res.render("details", {
            users: docs,
            title: "Team Details"
        })
    })
})

app.get("/form", (req, res) => {
    res.render("form");
})

app.get("/lb", (req, res) => {
    getDetails().then((docs) => {
        res.render("details", {
            users: docs,
            title: "Leader Board"
        })
    })
})

app.post("/submit", (req, res) => {

    var teamName = req.body.teamName;
    var teamLeader = req.body.teamLeader;
    var members = req.body.members;
    var contact = req.body.contact;
    var random = randomstring.generate({
        length: 4,
        charset: 'alphabetic'
    });
    var teamId = teamName.substr(0, 3) + contact.toString().substr(0, 3) + random.toLowerCase();
    db.collection("teams").add({
        level: 1,
        phone: contact,
        teamId: teamId,
        team_leader: teamLeader,
        team_name: teamName,
        members: parseInt(members),
        time: new Date(),
        login: 0
    }).then(function (docRef) {
        res.send("success");
    })
        .catch(function (error) {
            res.send(error);
        });

})



app.listen(port, () => {
    console.log(`server running ${port}`);
})




function getDetails() {
    return new Promise((resolve, reject) => {
        db.collection("teams")
            .get()
            .then(function (querySnapshot) {
                var data = [];
                querySnapshot.forEach(function (doc) {
                    data.push(doc.data());

                });
                console.log(data);
                resolve(data);
            });
    })
}


function getLeaderBoard() {
    return new Promise((resolve, reject) => {

        db.collection("teams").orderBy("level", "desc").orderBy("time", "asc").get().then(function (querySnapshot) {
            var data = [];
            querySnapshot.forEach(function (doc) {
                data.push(doc.data());

            });
            console.log(data);
            resolve(data);
        });

    });
}