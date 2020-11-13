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
  for (let i in Array) {
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

router.post('/upload/folder/svg', function(req, res) {
  
  let modelName = req.body.mongooseModel

  mongoose.connect(req.body.mongooseURL, {useNewUrlParser: true, useUnifiedTopology: true})

  var characterSchema = new mongoose.Schema({
    character: String,
    definition: String,
    pinyin: Array,
    decomposition: String,
    radical: String,
    matches: Array
  }, {collection: "characters"})
  let characterModel = mongoose.model('characters', characterSchema)
  
  var svgSchema = new mongoose.Schema({
    character: String,
    svg: String,
  })
  let svgModel = mongoose.model(modelName, svgSchema)

  characterModel.find({}, function(err, chars) {
    for (let i in req.files.File) {
      let char = chars[i].character
      let svg = req.files.File[i].data.toString()
      
      let newSvg = new svgModel({
        character: char,
        svg: svg,
      })
      newSvg.save()
    }
    console.log(chars.length)
    console.log(req.files.File.length)
  })

  res.sendStatus(200)
})

router.get('/upload/folder/svg', function(req, res, next) {
  res.render('svgFolder')
})

module.exports = router;