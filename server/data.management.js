'use strict'; // http://www.w3schools.com/js/js_strict.asp

// token handling in session
var token = require('./token');

// web framework
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var rawParser = bodyParser.raw({limit: '10mb'});

var url  = require('url');

var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

var config = require('./config');

var forgeSDK = require('forge-apis');

router.post('/buckets', jsonParser, function (req, res) {
    var tokenSession = new token(req.session);

    var bucketName = req.body.bucketName
    var bucketType = req.body.bucketType

    var buckets = new forgeSDK.BucketsApi();
    buckets.createBucket({
          "bucketKey": bucketName,
          "policyKey": bucketType
    }, { xAdsRegion: req.body.region }, tokenSession.getOAuth(), tokenSession.getCredentials())
      .then(function (data) {
            res.json(data.body)
      })
      .catch(function (error) {
          res.status(error.statusCode).end(error.statusMessage);
      })

})

router.get('/files/:id', function (req, res) {
    var id = req.params.id
    var boName = getBucketKeyObjectName(id)

    var tokenSession = new token(req.session);

    var objects = new forgeSDK.ObjectsApi();
    objects.getObject(boName.bucketKey, boName.objectName, {}, tokenSession.getOAuth(), tokenSession.getCredentials())
      .then(function (data) {
          var fileParts = boName.objectName.split('.')
          var fileExt = fileParts[fileParts.length - 1];
          res.set('content-type', 'application/octet-stream');
          res.set('Content-Disposition', 'attachment; filename="' + boName.objectName + '"');
          res.end(data.body);
      })
      .catch(function (error) {
          res.status(error.statusCode).end(error.statusMessage);
      });
})

router.delete('/files/:id', function (req, res) {
    var tokenSession = new token(req.session)

    var id = req.params.id
    var boName = getBucketKeyObjectName(id)

    var objects = new forgeSDK.ObjectsApi();
    objects.deleteObject(boName.bucketKey, boName.objectName, tokenSession.getOAuth(), tokenSession.getCredentials())
      .then(function (data) {
          res.json({ status: "success" })
      })
      .catch(function (error) {
          res.status(error.statusCode).end(error.statusMessage);
      })
})

router.get('/files/:id/publicurl', function (req, res) {
    var id = req.params.id
    var boName = getBucketKeyObjectName(id)

    var tokenSession = new token(req.session);

    var objects = new forgeSDK.ObjectsApi();
    objects.createSignedResource(boName.bucketKey, boName.objectName, {}, { 'access': 'readwrite' }, tokenSession.getOAuth(), tokenSession.getCredentials())
      .then(function (data) {
          res.json(data.body);
      })
      .catch(function (error) {
          res.status(error.statusCode).end(error.statusMessage);
      });
})

router.delete('/buckets/:id', function (req, res) {
    var tokenSession = new token(req.session)

    var id = req.params.id

    var buckets = new forgeSDK.BucketsApi();
    buckets.deleteBucket(id, tokenSession.getOAuth(), tokenSession.getCredentials())
      .then(function (data) {
          res.json({ status: "success" })
      })
      .catch(function (error) {
          res.status(error.statusCode).end(error.statusMessage);
      })
})


router.post('/files', jsonParser, function (req, res) {
    // Uploading a file to app bucket

    var tokenSession = new token(req.session);

    var fileName = '';
    var form = new formidable.IncomingForm();
    var uploadedFile;
    var bucketName = req.headers.id

    // Receive the file
    var fileData;

    form
        .on('data', function(data) {
            fileData = data;
        })

        .on('field', function (field, value) {
            console.log(field, value);
        })
        .on('file', function (field, file) {
            console.log(field, file);
            uploadedFile = file;
        })
        .on('end', function () {
            if (uploadedFile.name == '') {
                res.status(500).end('No file submitted!');
            }

            console.log('-> file received');

            // Create file on A360
            fs.readFile(uploadedFile.path, function (err, fileData) {
                // Upload the new file
                var objects = new forgeSDK.ObjectsApi();
                objects.uploadObject(bucketName, uploadedFile.name, uploadedFile.size, fileData, {}, tokenSession.getOAuth(), tokenSession.getCredentials())
                  .then(function (objectData) {
                      console.log('uploadObject: succeeded');
                      res.json(objectData.body);
                  })
                  .catch(function (error) {
                      console.log('uploadObject: failed');
                      res.status(error.statusCode).end(error.statusMessage);
                  });
            });

        });

    form.multiples = true;
    form.parse(req);
});

router.post('/chunks', rawParser, function (req, res) {
  // Uploading a file to app bucket

  var tokenSession = new token(req.session);

  var fileName = req.headers['x-file-name'];
  var bucketName = req.headers.id
  var data = req.body;
  var range = req.headers.range;
  var sessionId = req.headers.sessionid;

  console.log("chunks with range " + range);

  // Upload the new file
  var objects = new forgeSDK.ObjectsApi();
  objects.uploadChunk(bucketName, fileName, data.length, range, sessionId, data, {}, tokenSession.getOAuth(), tokenSession.getCredentials())
    .then(function (objectData) {
      console.log(`uploadChunk with range ${range}: succeeded`);
      res.status(objectData.statusCode).json(objectData.body);
    })
    .catch(function (error) {
      console.log(`uploadChunk with range ${range}: failed`);
      if (error.statusCode && error.statusMessage) {
        res.status(error.statusCode).end(error.statusMessage);
      } else {
        res.status(500).end("Unknown error");
      }
    });

});

function getBucketKeyObjectName(objectId) {
    // the objectId comes in the form of
    // urn:adsk.objects:os.object:BUCKET_KEY/OBJECT_NAME
    var objectIdParams = objectId.split('/');
    var objectNameValue = objectIdParams[objectIdParams.length - 1];
    // then split again by :
    var bucketKeyParams = objectIdParams[objectIdParams.length - 2].split(':');
    // and get the BucketKey
    var bucketKeyValue = bucketKeyParams[bucketKeyParams.length - 1];

    var ret = {
        bucketKey: decodeURIComponent(bucketKeyValue),
        objectName: decodeURIComponent(objectNameValue)
    };

    return ret;
}

//




/////////////////////////////////////////////////////////////////
// Provide information to the tree control on the client
// about the hubs, projects, folders and files we have on
// our A360 account
/////////////////////////////////////////////////////////////////
router.get('/treeNode', function (req, res) {
    var regions = ["EMEA", "US"];
    var region = req.query.region;
    var id = decodeURIComponent(req.query.id);
    console.log("treeNode for " + id);

    var tokenSession = new token(req.session);

    if (id === '#') {
        // # stands for ROOT
        res.json([
            { id: "US", text: "US", type: "region", children: true },
            { id: "EMEA", text: "EMEA", type: "region", children: true }
        ]);
    }
    else if (regions.includes(id)) {
        var buckets = new forgeSDK.BucketsApi();
        var items = [];
        var getBuckets = function (buckets, tokenSession, options, res, items) {
            buckets.getBuckets(options, tokenSession.getOAuth(), tokenSession.getCredentials())
            .then(function (data) {
                console.log('body.next = ' + data.body.next);
                items = items.concat(data.body.items);
                if (data.body.next) {
                    var query = url.parse(data.body.next, true).query;
                    options.region = query.region;
                    options.startAt = query.startAt;
                    getBuckets(buckets, tokenSession, options, res, items);
                } else {
                    res.json(makeTree(items, true));
                }
            })
            .catch(function (error) {
                console.log(error);
                res.status(error.statusCode).end(error.statusMessage);
            });
        }

        var options = { 'limit': 100, 'region': region };
        getBuckets(buckets, tokenSession, options, res, items);
    } else {
        var objects = new forgeSDK.ObjectsApi();

        var items = [];
        var options = { 'limit': 100 };
        var getObjects = function (objects, tokenSession, options, res, items) {
            objects.getObjects(id, options, tokenSession.getOAuth(), tokenSession.getCredentials())
            .then(function (data) {
                console.log('body.next = ' + data.body.next);
                items = items.concat(data.body.items);
                if (data.body.next) {
                    var query = url.parse(data.body.next, true).query;
                    options.region = query.region;
                    options.startAt = query.startAt;
                    getObjects(objects, tokenSession, options, res, items);
                } else {
                    res.json(makeTree(items, false));
                }
            })
            .catch(function (error) {
                console.log(error);
                res.status(error.statusCode).end(error.statusMessage);
            });
        }

        getObjects(objects, tokenSession, options, res, items);
    }
});

/////////////////////////////////////////////////////////////////
// Collects the information that we need to pass to the
// file tree object on the client
/////////////////////////////////////////////////////////////////
function makeTree(items, isBucket) {
    if (!items) return '';
    var treeList = [];
    items.forEach(function (item, index) {

        var treeItem = {
            id: isBucket ? item.bucketKey : item.objectId,
            text: isBucket ? item.bucketKey + " [" + item.policyKey + "]" : item.objectKey,
            type: isBucket ? "bucket" : "file",
            sha1: item.sha1,
            children: isBucket
        };
        console.log(treeItem);
        treeList.push(treeItem);
    });

    return treeList;
}

/////////////////////////////////////////////////////////////////
// Return the router object that contains the endpoints
/////////////////////////////////////////////////////////////////
module.exports = router;