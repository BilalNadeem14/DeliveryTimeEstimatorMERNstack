//mongodb+srv://Bilal:bluesea1@cluster0.ntmqq.mongodb.net/<dbname>?retryWrites=true&w=majority
const express = require('express');
const app  = express(); //creating new instance of express by just calling express
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const detailRoutes = express.Router();
const PORT = 4000;
//changed
let Detail = require('./avanza.model');

const app2  = express(); //creating new instance of express by just calling express
const uuid = require('uuid/v4');
var DUMMY_ORDERS = {};
const bodyParser2 = require('body-parser');
app2.use(bodyParser2.json());
app2.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
  });

  let createdDetails2 = {}
  //let createdDetails = {}
  console.log('hi')
  app2.post('/product', (req, res, next) => {
//    const { countryName, countryHours, orderType } = req.body;
  let { date, time, orderType, country, day } = req.body;
    const createdDetails = {
        id: uuid(),
        date,
        time,
        orderType,
        country,
        day
    };
    //createdDetails2 = createdDetails
    //DUMMY_ORDERS.push(createdDetails);
    console.log('orderDetails in backend are: ', createdDetails);
    //console.log('order type: is', DUMMY_ORDERS[0].orderType)
    //console.log('orderDetails of  backend are: ', createdDetails2);
    console.log('name of country:', country)

    //time or hours and mins + remaining hours
    //var businessClosureDays = [1408]  //14th August
    var datee = 0
    datee =  Number(createdDetails.date[8]) * 10
    console.log('datee left digit is: ', createdDetails.date[8])
    datee = datee + Number(createdDetails.date[9])
    console.log('date in int: ',datee)
    datee = datee+1

    var month = 0   //index 5,6
    month =  Number(createdDetails.date[5]) * 10
    console.log('month left digit is: ', createdDetails.date[5])
    month = month + Number(createdDetails.date[6])
    console.log('month in int: ',month)
    //month = month+1 if date is more than last_date of month

    console.log('time of order: ', createdDetails.time)
    //9 - 6 = 9:00 and 18:00
    console.log('time of order: ', Number(createdDetails.time[15]))//11,12 hours 14,15 mins
    var hours = Number(createdDetails.time[11]) * 10
    console.log(hours)
    hours = hours + Number(createdDetails.time[12])
    console.log('hours of time in int: ', hours)
    hours = hours + 5
    console.log('hours of time in int with GMT+5: ', hours)
    if(hours == 24)
    {
        hours = 0
    }
    var mins =  Number(createdDetails.time[14]) * 10
    console.log(mins)
    mins = mins + Number(createdDetails.time[15])
    console.log('mins of time in int: ',mins)

    var remaining_hours = 0;    //remaining hours of (software house working hours) in a particular day
    var remaining_mins = 60;    //remaining mins of (software house working mins) in a particular day
    if(hours>=9 && (hours<18 || (hours==18 && mins==0))) {
        remaining_hours = 18 - hours
        /*if(remaining_hours<6) {
            remaining_hours = remaining_hours + 1
        }*/
        remaining_mins = remaining_mins - mins
        if(remaining_mins == 60) {
            remaining_mins = 0
            remaining_hours = remaining_hours + 1
        } 
    }
    else {
        remaining_mins = 0
    }
    if(remaining_mins == 60) {
        remaining_mins = 0
        remaining_hours = remaining_hours + 1
    }
    console.log('mins of time in int: ',mins)

    function incrementDate(date, day) {
        date= date + 1
        day = day + 1
        if(day==6) {
            date = date + 2
            day = day + 2
            console.log('day==6 and date+2 day: ', day)
        }
        else if(day == 7) {
            date = date + 1
            day = day + 1
        }
        let obj = {
            date: date,
            day: day
        }
        return obj 
    }

    //BUSINESS CLOSURE DAY LOGIC
    if((datee == 14 && month == 8) || (datee==23 && month == 3)) {
        date_day_obj = incrementDate(datee, day)
        datee = date_day_obj.date
        day = date_day_obj.day
    }


    var date_day_obj = {}
//    datee = 0

    /*
    if(hours<9 || hours>18) {
        datee = datee + 1 //insert closure days   
        remaing_hours = 9
        remaining_mins = 0

    }*/
    console.log(remaining_hours)
    var orderHoursNeeded = 0

    if(createdDetails.orderType == 'urgent')
    {
        if(hours>=9 && hours<=18) { //if not a business closure day
            if(remaining_hours >= 6 && createdDetails.orderType == 'urgent') {
                hours = hours + 6
            }
            else if(remaining_hours < 6 && createdDetails.orderType == 'urgent')
            {  //insert logic for 10hours at normal order
                date_day_obj = incrementDate(datee, day)
                datee = date_day_obj.date
                day = date_day_obj.day

                orderHoursNeeded = 6 - remaining_hours
                hours = 9 + orderHoursNeeded
                console.log('orderHoursNeeded: ', orderHoursNeeded)
            }
        } 
        else if(hours<9) 
        {
            hours = 9 + 6
        }
        else if(hours>18) {
            date_day_obj = incrementDate(datee, day)
            datee = date_day_obj.date
            day = date_day_obj.day
            hours = 9 + 6
        }
    }
        //remaining_mins logic is left*****************************
    else if(createdDetails.orderType == 'normal')
    {
        if(hours>=9 && hours<=18) { //if not a business closure day
            if(remaining_hours < 10)
            {  //insert logic for 10hours at normal order
                    date_day_obj = incrementDate(datee, day)
                    datee = date_day_obj.date
                    day = date_day_obj.day
                    orderHoursNeeded = 10 - remaining_hours
                hours = 9 + orderHoursNeeded
                console.log('orderHoursNeeded: ', orderHoursNeeded)
            }
        } 
        else if(hours<9) 
        {
            date_day_obj = incrementDate(datee, day)
            datee = date_day_obj.date
            day = date_day_obj.day
            hours = 9 + 1
        }
        else if(hours>18) {
            date_day_obj = incrementDate(datee, day)
            datee = date_day_obj.date
            day = date_day_obj.day

            date_day_obj = incrementDate(datee, day)
            datee = date_day_obj.date
            day = date_day_obj.day

            //if its a weekend then the logic at the end will handle it with 2 if
            hours = 9 + 1
        }

    }

    console.log('time remaining is: ', remaining_hours, ':', remaining_mins);

    console.log('delivery time is: ', hours, ':', mins, 'and date is: ', datee, 'and day is: ', day)
    //remove all if after datee+1 and dont remove where we are doing date+1 twice
    //try making a function for dateIncrement(date) which checks if date is a weekend
    if(day==6) {
        datee = datee + 2
        day = day + 2
        console.log('day==6 and date+2 day: ', day)
    }
    else if(day == 7) {
        datee = datee + 1
        day = day + 1
    }
    console.log('updated day: ', day)

    if(hours==18 && remaining_mins>0) {
        hours = 9
        date_day_obj = incrementDate(datee, day)
        datee = date_day_obj.date
        day = date_day_obj.day

    }

    if(day>7) {
        day = day - 7
    }

    //send month and year as well
    DUMMY_ORDERS = {
        id: uuid(),
        hours,
        mins,
        datee,
        month
    };
console.log('Dummy orders are: ', DUMMY_ORDERS);



    res
      .status(201)
      .json({ message: 'Created new details.', details: createdDetails });


    });
    

//send estimated_delivery_time instead of DUMMY_ORDERS
  app2.get('/products', (req, res, next) => {
    res.status(200).json({ details: DUMMY_ORDERS });
  });
      
/*    //add order time, order date
    const orderDetails = {
        id: uuid(),
        countryName, 
        countryHours, 
        orderType
    };
    console.log(orderDetails);

    DUMMY_ORDERS.push(orderDetails);
*/
app2.listen(5000, function(){
    console.log('server is running on port 5000 for just backend')
}); // start Node + Express server on port 5000



//to add middle ware we write .use() 
app.use(cors());
app.use(bodyParser.json()); //bec i wanted the body parser.json middle ware activated

//it is used to connect to the mongodb database
mongoose.connect('mongodb://127.0.0.1:27017/avanzaDB', { useNewUrlParser: true });  //the first argument is the uri of mongodb, 2nd parameter is the configuration object
///we are referring to local host 127.0.0.1
//it is running on port 
//  mongodb+srv://Bilal:bluesea1@cluster0.ntmqq.mongodb.net/<dbname>?retryWrites=true&w=majority
//to retrieve the reference of the connection object
const connection = mongoose.connection; //connection reference enabled

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

//Our first http end point
detailRoutes.route('/').get(function(req, res) { 
    Detail.find(function(err, details) {        //to retrieve all data models from the database
        if(err){
            console.log(err);
        }
        else {
            res.json(details); //details: is the data we are getting back when we are accessing the mongo db database
        }
    }); 
});

//when we want to retrieve only a particular detail with an id
detailRoutes.route('/:id').get(function(req, res) {   //we're using get bec we'd accept incoming hhtp requests
    let id = req.params.id;
    Detail.findById(id, function(err, detail) {     //this err is the error message if there is any AND this detail is the retrieved detail item
        res.json(detail);    //we are returning to the response object, what we are getting back from the database in json format
    });
});

//next end point is the end point to send http post request to, When adding new detail items to the database
detailRoutes.route('/add').post(function(req, res) {   //we are using post method bec we want to accept http post request
    //first we need to retrive the data of the detail from the request body
    let detail = new Detail(req.body);   //we are creating a new detail instance based on our data  model, retriving data from req.body property
    detail.save() //saving into the database
        .then(detail => {  //as this is called asynchorously, so we can answer with a then
            res.status(200).json({'avanza': 'details added successfully'}); //http status 200 which indicates, inserting/saving data has been completed
        })
        .catch(err => { //for the error case
            res.status(400).send('adding new detail failed')
        });
});

//update existing detail item, for eg: we want to update from false to true
detailRoutes.route('/update/:id').post(function(req, res) { //we are specifically updating the detail with the given id
    Detail.findById(req.params.id, function(err, detail) {
        if(!detail)   //if detail is not set, then it was not successful to update from the DB
            res.status(404).send('data is not found')   //returning a string
        else
        detail.countryName = req.body.countryName;
        detail.countryHours = req.body.countryHours

        detail.save().then(detail =>{   //now we are saving the updated detail in the database
                res.json('AvanzaDB Updated');    //we are sending data back to the frontend in the json format
            })
            .catch(err => { //if the update is not possible
                res.status(400).send("Update failed");  //sending string back to the the frontend
            });
    });
}); 
//changed
app.use('/avanzaDB', detailRoutes);  //avanzaDB is the name of the database



//I'm starting the process on port 4000 by app.listen(port and a call back function)    
//the func is executed when the server process has executed successfully
app.listen(PORT, function() {
    console.log("server is running on port: " + PORT);
});     //very basic server implementation
//it is listening for incomming requests on PORT 4000