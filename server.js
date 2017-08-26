const express = require("express");
const mongoose = require("mongoose");
const bluebird = require("bluebird");
const bodyparser = require("body-parser");
const mustacheExpress = require('mustache-express');
const logger = require("morgan");
const Fabric = require("./models/Fabric");
const path = require("path");


const app = express();
mongoose.Promise = bluebird;
mongoose.connect("mongodb://localhost:27017/fabric");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));
app.use(logger("dev"));


app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

////////////////////////////////////////////

app.post("/fabricCollection", function (req, res) {
    console.log(req.body);
    let newFabric = new Fabric(req.body);

    newFabric
        .save()
        .then(function (savedFabric) {
            res.redirect("/")
        })
        .catch(function (err) {
            res.status(500).send(err);
        });

});

/////////////////////////////////////////////////////////////////////

app.get("/", function (req, res) {
    Fabric.find()
        .then(function (foundFabrics) {
            if (!foundFabrics) {
                return res.send({ msg: "No fabrics found" });
            }

            return res.render("index", { fabric: foundFabrics });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});


//////////////////////////////Queries/////////////////////////////////////
app.get("/fabric/:id", function (req, res) {
    Fabric.findById(req.params.id)
        .then(function (foundFabric) {
            if (!foundFabric) {
                return res.send({ msg: "No fabric found" });
            }
            res.render("fabricDetail", { fabric: foundFabric });
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});
////////////////////////////////////////////////////////////////////////
app.post("/fabric/:id", function (req, res) {
    Fabric.findByIdAndUpdate(req.params.id, req.body)
        .then(function (updatedFabric) {
            if (!updatedFabric) {
                return res.send({ msg: "Could not update fabric" });
            }


            let redirectURL =
                res.redirect(`/fabric/${req.params.id}`);

        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});
//////////////////////////////////////////////////////////////////
app.get("/deletefabric/:id", function (req, res) {
    Fabric.findByIdAndRemove(req.params.id)
        .then(function () {
            // res.send(message);
            return res.redirect("/");


        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});



app.listen(8004, () => console.log("Server running on port 8004!"));