var express = require('express');
var request = require('request');

var router = express.Router();

//get UserId from the token
function getUserIdByToken(token) {
    var id = objectId(token.id);
    return id;
}
//student registration process
router.route('/registration')
    .post(function (req, res) {
        //console.log(req.body)
        var db = req.db;
        var stdObj = db.collection("Students");
        stdObj.findOne({ email: req.body.email }, function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                //console.log(data)
                if (data == null || data.length == 0) {
                    stdObj.insertOne(req.body, function (err, result) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.status(200).send({ status: "added" });
                        }
                    });

                } else {
                    res.status(200).send({ status: "exists" });
                }
            }
        });
    });

module.exports = router;