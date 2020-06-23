var userDataArray = new Array();

var fileName = process.argv[2]
var senderMail = process.argv[3]

function UserData(userName, userLastName, userTitle, userMail ){
    this.userName = userName;
    this.userLastName = userLastName;
    this.userTitle = userTitle;
    this.userMail = userMail;
  }

function writeToFile(value) {
    fs = require('fs');
    fs.writeFile('data.json', value, function (err) {
        if (err) return console.log(err);
        console.log('File OK');
    });
}

var XLSX = require('xlsx');
var workbook = XLSX.readFile(fileName);
var sheet_name_list = workbook.SheetNames;
var JsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
writeToFile(JsonData)

  const nodemailer = require('nodemailer');
  function sendMailSetup(mailAddress, subject, body) {    
        let transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            pool: true,
            auth: {
               user: senderMail,
               pass: 'get generated pass from google'
            }
		});
    
  
      const message = {
          from: senderMail, // Sender address
          to: mailAddress, // List of recipients
          subject: subject, // Subject line
          text: body // Plain text body
      };
      transport.sendMail(message, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log(info);
            console.log("sendAllMailMessages DONE !!!");
          }
      });

  }

  function sendAllMailMessages(JsonData) {

    for (i = 0; i < JsonData.length; i++) {
        var userDataObject = new UserData(JsonData[i]["First Name"], JsonData[i]["Last Name"], JsonData[i].Title, JsonData[i].Email);
        userDataArray.push(userDataObject)
      }

      for (i = 0; i < userDataArray.length; i++) {
       var text = "Dear " + userDataArray[i].userName + " " + userDataArray[i].userLastName + "\r\ntest promo mail"
       var subject = "test promo"
       sendMailSetup( userDataArray[i].userMail, subject, "Dear " + userDataArray[i].userName + " " + userDataArray[i].userLastName + "\r\ntest promo mail" + userDataArray[i].userMail)   
      }
      
  }

  sendAllMailMessages(JsonData)

  

