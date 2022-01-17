require("dotenv").config({ path: "../config.js" });
const db = require("../db/models");
const Solve = db.solve;
const ObjectId = require("mongodb").ObjectId;
var fs = require('fs');

exports.getSolves = async(req, res) => {
    var solves = await Solve.find({})
    res.status(200).send(solves)

    //log
    var oldText = '';
    fs.readFile('../log.txt', function(err, contents) {
        oldText = contents.toString();
    });
    var newText = oldText + `\n` + "Solves were retreived Successfully";
    fs.writeFile('../log.txt', newText, function(err) {
        if (err) throw err;
    });
}

exports.deleteSolve = async(req, res) => {
    await Solve.deleteOne({_id: ObjectId(req.params.id)});

    //log
    var oldText = '';
    fs.readFile('../log.txt', function(err, contents) {
        oldText = contents.toString();
    });
    var newText = oldText + `\n` + "Solve was deleted Successfully";
    fs.writeFile('../log.txt', newText, function(err) {
        if (err) throw err;
    });
}

exports.addSolve =(req, res) => {
    console.warn(req.body)
    const solve = new Solve ({
        time: req.body.time,
        scramble: req.body.scramble,
        user: req.body.user
    });
    solve.save(err => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        res.send({ message: "Solve was added Successfully" });

        //log
        var oldText = '';
        fs.readFile('../log.txt', function(err, contents) {
            oldText = contents.toString();
        });
        var newText = oldText + `\n` + "Solve was added Successfully";
        fs.writeFile('../log.txt', newText, function(err) {
            if (err) throw err;
        });
    });
}

