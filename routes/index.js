const { json } = require('express');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const mongoose = require("mongoose")
router.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let modelName = req.body.mongooseModel

  mongoose.connect(req.body.mongooseURL, {useNewUrlParser: true, useUnifiedTopology: true})

  var dataSchema = new mongoose.Schema({}, {strict: false})
  var dataModel = mongoose.model(modelName, dataSchema)

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let File = req.files.File.data.toString()
  let commaFile = File.replace(/\n/g, "~")
  let Array = commaFile.split('~')
  for (i in Array) {
    Array[i] = JSON.parse(Array[i])
  }
  dataModel.collection.insertMany(Array, function(err, r) {
    if (err) console.log(err)
  })

  res.send('File uploaded!');
});

router.get('/uploadpage', function(req, res, next) {
  res.render('upload')
})

module.exports = router;
