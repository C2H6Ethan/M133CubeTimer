require("dotenv").config({ path: "../config.js" });
const db = require("../db/models");
const User = db.user;
const ObjectId = require("mongodb").ObjectId;
var fs = require('fs');

exports.getUsers = async(req, res) => {
    var users = await User.find({})
    res.status(200).send(users)

    //log
    var oldText = '';
    fs.readFile('../log.txt', function(err, contents) {
        oldText = contents.toString();
    });
    var newText = oldText + `\n` + "Users were retreived Successfully";
    fs.writeFile('../log.txt', newText, function(err) {
        if (err) throw err;
    });
}

exports.deleteUser = async(req, res) => {
    await User.deleteOne({_id: ObjectId(req.params.id)});

    //log
    var oldText = '';
    fs.readFile('../log.txt', function(err, contents) {
        oldText = contents.toString();
    });
    var newText = oldText + `\n` + "User was deleted Successfully";
    fs.writeFile('../log.txt', newText, function(err) {
        if (err) throw err;
    });
}