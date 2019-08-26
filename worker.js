const fs = require("fs");
const login = require("facebook-chat-api");
const AWS = require('aws-sdk');
var uuid = require('uuid');

AWS.config.update({

  	accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

// var FormData = require('form-data');
// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : process.env.DB_HOST,
//   user     : process.env.DB_USER,
//   password : process.env.DB_PASSWORD
// });

// login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    
//     api.setOptions({
//     	selfListen: true,
//         logLevel: "silent",
//         updatePresence: false
//     });
//     if(err) return console.error(err);
//     api.listen((err, message) => {
//         if(err) return console.error(err);

//         if (!message.isGroup) {
//         	if (typeof message.body === "string") {
//         		var form = new FormData();
//         		if (message.attachments.length == 0){
//         			//Do nothing
//         		}
//         		else if (message.attachments[0].type === "photo") {
//         			form.append("entry.1366768221", message.attachments[0].largePreviewUrl);
//  				} else {
//  					form.append("entry.1366768221", message.attachments[0].url);
//  				}
//         		form.append("entry.1524614322", message.threadID);
// 				form.append("entry.1184740740", message.senderID);
// 				form.append("entry.520057091", message.body);
// 				// form.append("entry.1366768221", "Attach");
// 				form.submit('https://docs.google.com/forms/d/e/1FAIpQLSdcjFkgt_PheMSiRZmb-ucNTGcthnOb_frGXilUSab08tM_qA/formResponse?', 
// 				 	function(err, res) {
//   						console.log(res.statusCode);
// 					});
//         	}

// 		}
		

//     });

// });


   
login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {

	api.setOptions({
		selfListen: true,
		logLevel: "silent",
		listenEvents: true,
		updatePresence: false
	});
	if(err) return console.error(err);
	api.listen((err, message) => {
		if(err) return console.error(err);
			if (typeof message.body === "string") {
				var attachment = "empty";
				if (message.attachments.length == 0){
					//Do nothing
				}
				else if (message.attachments[0].type === "photo") {
					attachment = message.attachments[0].largePreviewUrl;
				} else {
					attachment = message.attachments[0].url;
				}
				var docClient = new AWS.DynamoDB.DocumentClient();
				var table = "justforfun";
				var id = uuid.v1();
				var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/BangKok"});
				var timestamps = new Date(asiaTime).toLocaleString();
				console.log(timestamps);
				var params = {
				    TableName:table,
				    Item:{
				        "id": id,
				        "thread_id": message.threadID,
						"sender_id": message.senderID,
						"content"  : message.body,
						"attachment": attachment,
						"sender_name": null,
						"timestamps": timestamps
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
	});

});

