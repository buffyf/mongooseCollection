const express = require("express");
const mongoose = require("mongoose");
const bluebird = require("bluebird");
const bodyparser = require("body-parser");
const logger = require("morgan");
const Fabric = require("./models/Fabric");

const app = express();
mongoose.Promise = bluebird;
mongoose.connect("mongodb://localhost:27017/fabric");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(logger("dev"));

// let fabric1 = {
//     name: {
//         designerName: "Martha Stewart",
//         fabricName: "sunny day"
//     },
//     color: ["red", "yellow", "blue", "purple", "green", "white"],
//     amount: 5,
//     projectPlanned: false,
//     material: "cotton",

// };

// let newFabric = new Fabric(fabric1);

// newFabric
//     .save()
//     .then(function (savedFabric) {
//         console.log("savedFabric: ", savedFabric);
//     })
//     .catch(function (err) {
//         console.log(err);
//     });

app.post("/fabric", function (req, res) {
    console.log(req.body);
    let newFabric = new Fabric(req.body);

    newFabric
        .save()
        .then(function (savedFabric) {
            res.send(savedFabric);
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});

app.get("/fabric", function (req, res) {
    Fabric.find()
        .then(function (foundFabrics) {
            if (!foundFabrics) {
                return res.send({ msg: "No fabrics found" });
            }

            res.send(foundFabrics);
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});

app.get("/fabric/:id", function (req, res) {
    Fabric.findById(req.params.id)
        .then(function (foundFabric) {
            if (!foundFabric) {
                return res.send({ msg: "No fabric found" });
            }

            res.send(foundFabric);
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});

app.put("/fabric/:id", function (req, res) {
    Fabric.findByIdAndUpdate(req.params.id, req.body)
        .then(function (updatedFabric) {
            if (!updatedFabric) {
                return res.send({ msg: "Could not update fabric" });
            }

            res.send(updatedFabric);
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});

app.delete("/fabric/:id", function (req, res) {
    Fabric.findByIdAndRemove(req.params.id)
        .then(function (message) {
            res.send(message);
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});

app.listen(8000, () => console.log("Server running on port 8000!"));