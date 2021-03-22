var express = require('express');
var request = require('request');
var ObjectID = require('mongodb').ObjectID;


var router = express.Router();

//get UserId from the token
function getUserIdByToken(token) {
    var id = new ObjectID(token.id);
    return id;
}
//validate if the student is already applied
router.route('/isApplied')
    .get(function (req, res) {
        var id = getUserIdByToken(req.decoded);
        var db = req.db;
        var Students = db.collection("Students");
        Students.find({ '_id': id }).toArray(function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                //console.log(data);
                if (data[0].FormDetails != undefined) {
                    res.status(200).json({ applied: true });
                }else{
                    res.status(200).json({ applied: false });
                }
            }
        });
    });

router.route('/applicationForm')
    .post(function (req, res) {
        var id = getUserIdByToken(req.decoded);
        var db = req.db;
        var Students = db.collection("Students");

        Students.findOne({ '_id': id }, function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                //console.log(req.body);
                var formObj = new Object();
                formObj._id = new ObjectID(),
                    formObj.FullName = req.body.fullname,
                    formObj.Address = req.body.address,
                    formObj.Gender = req.body.gender,
                    formObj.Nationality = req.body.nationality,
                    formObj.Religion = req.body.religion,
                    formObj.Caste = req.body.caste,
                    formObj.BirthDate = req.body.dob,
                    formObj.Year = req.body.schoolYear,
                    formObj.Standard = req.body.standard,
                    formObj.ImageName = req.body.imgName,
                    formObj.Image = req.body.imageData


                Students.update({ '_id': id }, { $push: { FormDetails: formObj } }, function (err, rows) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        //res.status(200).send('form submitted successfully');
                        var mailOptions = {
                            from: 'bhagatpooja1@gmail.com',
                            to: data.email,
                            subject: 'Student Application',
                            text: 'Your application is subbmitted! We will get back to you soon for admission process.'
                        };

                        global.transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                                res.status(200).send('form submitted successfully');
                            }
                        });
                    }

                });
            }
        });
    });

module.exports = router;