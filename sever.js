var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const AWS = require('aws-sdk');
var app = express();
app.set('view engine', 'pug');
app.set('views','./views');


// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

// AWS.config.update({

//   	accessKeyId: process.env.ACCESS_KEY_ID,
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//     region: process.env.REGION
// });


app.get('/', function (req, res) {
	var db = new AWS.DynamoDB.DocumentClient();
    db.scan({
        TableName : 'justthreadid'
    }, function(err, data) {
        if (err) { console.log(err); return; }
        // var daulau = JSON.parse(data);
        res.render('index', {threadIds: data['Items']});
    });
});

app.get('/threads/:threadId', function (req, res) {
   res.render('show',{threadId: req.params['threadId']});
});

app.get('/insert_thread_id', function (req, res) {
   	var db = new AWS.DynamoDB.DocumentClient();
    db.scan({
        TableName : 'justforfun'
    }, function(err, data) {
        if (err) { console.log(err); return; }
        // var daulau = JSON.parse(data);
        const distinctIds = [...new Set(data['Items'].map(x => x.thread_id))]
     	distinctIds.forEach(insertThreadId);
        res.send('ODk');
    });
});

function insertThreadId(item) {
	item = item.toString();
	var docClient = new AWS.DynamoDB.DocumentClient();
	var table = "justthreadid";
	var params = {
	    TableName:table,
	    Item:{
	        "id": item,
	    }
	};
	console.log("Adding a new item...");
	docClient.put(params, function(err, data) {
	    if (err) {
	        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
	    } else {
	        console.log("Added item:", JSON.stringify(data, null, 2));
	    }
	});
}

app.get('/threads/:threadId/edit', function (req, res) {
	res.render('edit', {threadId: req.params['threadId']});

});

app.post('/addThreadName/', function (req, res) {
	console.log(req.body);
	var docClient = new AWS.DynamoDB.DocumentClient();
	var table = "justthreadid";
	var params = {
	    TableName:table,
	    Item:{
	        "id": req.body.threadId,
	        "name": req.body.name
	    }
	};
	console.log("Adding a new item...");
	docClient.put(params, function(err, data) {
	    if (err) {
	        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
	    } else {
	        console.log("Added item:", JSON.stringify(data, null, 2));
	    }
	});
	res.redirect('/threads/' + req.body.threadId)
});

app.listen(3000);
