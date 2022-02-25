const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
const https = require('https');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signin.html");
});

app.post("/",function(req,res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  // we can even add some other inputs for merge fields from settings->merge tags
  const address = req.body.address;
  const phoneNo = req.body.phoneNo;
  const email = req.body.email;
  // TO get data of our Audience as described in api ref:
  const data={
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields: {
          FNAME:firstName,
          LNAME:lastName,
          PHONE: phoneNo,
          ADDRESS: address
        }
      }
    ]
  };
  const jsToJsonAudienceData = JSON.stringify(data);
//add api server as usX  ,where X refer last number of api key which is server between 1 to 20. Add Unique/lists id
  const url = "https://us6.api.mailchimp.com/3.0/lists/aa27a712e2";
  const options= {
    method:"POST",
    auth:"Prajwal:d8aa7cd68166ab7131b5239357b3a63d-us6"
  }

  const request = https.request(url,options,function(response){
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on('data', (data) => {
      console.log(JSON.parse(data));  //will print data on console
    });
  });
  request.write(jsToJsonAudienceData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
  console.log("On Heroku Server");
})

// app.listen(3000,function(){
//   console.log("connected to local server 3000");
// });

/*We need to provide some authentication to user so that only valid users can signup. Refer HTTP basic auth page.
  Mailchimp api key: d8aa7cd68166ab7131b5239357b3a63d-us6
  Audience Unique/list id: aa27a712e2
*/
