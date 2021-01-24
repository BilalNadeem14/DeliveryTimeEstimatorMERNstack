import React, {View, Component, useState} from 'react';
import Calendar from 'react-calendar';
import { BrowserRouter as Router,  Route, Link } from "react-router-dom";
import {Form} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import logo from "./logo.jpg";

import 'date-fns'
import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker
} from '@material-ui/pickers'

/*
const country = []
	country[0] = {
	  countryId: 123,
	  country: 'PAK',
	  workingHours: [10, 7]
	}
	country[1] = {
	  countryId: 456,
	  country: 'UAE',
	  workingHours: [9, 6]
	}
*/     //countries : country,
 
export default class App extends Component {
  constructor(props) {
    super(props)
    
    this.onSubmit = this.onSubmit.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.addProductHandler = this.addProductHandler.bind(this)
    this.state = {
      country: '',
      country2: '',
      date: '',
      date2: '',
      day: '',
      type: '',
      type2: '',
      workingHoursUAE: [9,18],
      workingHoursPAK: [10,17] ,
      todos: [    //setting random values initially
        {
          countryName: "xyz",
          countryHours: [0, 0]
        },
        {
          countryName: "xyz",
          countryHours: [0, 0]
        }
      ],
      products: {
        entered_title : 'book',
        price: 100
      },
      newProducts:
        {
          hours : 1,
          remaining_mins: 0,
          datee: 11,
          month: 'XYZ'
        }
      ,
      selectedDate: new Date(),
      selectedTime: new Date(),
      selectedTime2: new Date()
    }
  }

setSelectedDate(date) {
  this.setState({
    selectedDate : date
  });
  console.log('date selected: ', date, 'previous state date', this.state.selectedDate)
}

setSelectedTime(time) {
  this.setState({
    selectedTime: time,
    selectedTime2: time
  });
  console.log('selected time is: ', time, 'previous state time: ', this.state.selectedTime)
}
/*
handleDateChange() {
    setSelectedDate(date)
}
*/


//--------------------------------------------
   addProductHandler() {
    try {
      const details = {
        date: this.state.date2, 
        time: this.state.selectedTime2, 
        orderType: this.state.type2,
        country: this.state.country2,
        day: this.state.day
      }
      console.log('printing data sent to backend', details)
      
      const newProduct = {
        title: this.state.products.entered_title,
        price: +this.state.products.price //productPrice "+" to convert string to number
      };
      let hasError = false;
      const response =  fetch('http://localhost:5000/product', {
        method: 'POST',
        body: JSON.stringify(details),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        hasError = true;
      }

      const responseData =  response.json();

      this.setState({
        country2: '',
        type2: ''
      })

      if (hasError) {
        throw new Error(responseData.message);
      }

/*      setLoadedProducts(prevProducts => {
        return prevProducts.concat({
          ...newProduct,
          id: responseData.product.id
        });
      });*/
    } catch (error) {
      alert(error.message || 'Something went wrong!');
    }
  };
//-----------------------------

  retriveData(){
    axios.get('http://localhost:5000/products')
        .then(response => {
            this.setState({newProducts: response.data.details});
            console.log('retrieve data called', response.data.details.hours)
        })
        .catch(function(error) {
            console.log(error);
        })
        
        console.log('printing retrieve data',this.state.newProducts.hours)
  }
  componentDidMount() {
    axios.get('http://localhost:4000/avanzaDB/')
        .then(response => {
            this.setState({todos: response.data});
        })
        .catch(function(error) {
            console.log(error);
        })
}


/*
  componentDidMount(){
    fetch('')
    .then(response => response.json())
    .then(data => {
      //this.setState({countries: data});
    });
  }
*/
  selectCountry(e){
    this.setState({
      country: e.target.value,
      country2: e.target.value
    });
    console.log('country selected: ', e.target.value)
  }

  selectDate(e){
    console.log(e)
    console.log('keys of date: ',e.getDay())  //,Object.keys(e)
    console.log(typeof(e))
    console.log('date selected real func: ', this.state.date, 'previous state date', this.state.date)
    this.setState({
      date: e,
      date2: e,
      day: e.getDay()
      //day: this.state.date.getDay()
    })
  }

  selectType(e){
    //  console.log(e)
    this.setState({
      type: e.target.value,
      type2: e.target.value
    })
    //console.log(e.target.value)
    console.log(this.state.type2)
  }

  onSubmit(e) {
    e.preventDefault();

    console.log(`Form submitted`);
    console.log(`Country Selected: ${this.state.country}`);
    console.log(`Date Selected: ${this.state.date}`);
    console.log(`Order Type Selected: ${this.state.type}`);
    console.log(`time selected: ${this.state.selectedTime}`);
    //if(PAK)
      //console.log(`working hours are: ${this.state.workingHoursUAE[0]}:00 - ${this.state.workingHoursUAE[1]}:00`)
/*
    //right here we need to communicate to the backend before reseting our state to the initial state
    const newDetails = {
      country: this.state.country,
      date: this.state.date,
      type: this.state.type
    }

    //this string is containing the url path of our backend server 
    axios.post('http://localhost:4000/avanza/add', newDetails)  //this end point is accepting incoming data from an end point, 2nd argument is the data we want to send
        .then(res => console.log(res.data));    // we can chain a call of then here which is activated when a response arrives
        //we can respond with a then bec axios.post is returning a promise
*/
    //reseting our state to the initial state
    this.setState ({
      country: '',
      date: '',
      type: '',
      selectedTime: ''
    })
    //this.addProductHandler()
    this.addProductHandler()
    this.retriveData()
  }

  render() { 

    const {country, date, type} = this.state;

    // var uaeTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Dubai"});
    // var uaeDateTime = (new Date(uaeTime)).toISOString();
    // console.log('UAE time: '+ (new Date(uaeTime)).toISOString())

    return (
      
        <div  className="container">

          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <nav className="navbar-brand">Software Delivery Time Estimator</nav>
            <div className="collapse navbar-collapse">
            </div> 
          </nav>
          
          <br/>
          <form onSubmit={this.onSubmit}>
            <div>
              <select onChange={this.selectCountry.bind(this)} value={country}>
                <option>Select Country</option>
                <option value={this.state.todos[0].countryName}>{this.state.todos[0].countryName}</option>
                <option value={this.state.todos[1].countryName}>{this.state.todos[1].countryName}</option>
              </select>
              <p>choosen one is {this.state.country}</p>
              <p>working hours of {this.state.todos[0].countryName} are populated from database: {this.state.todos[0].countryHours[0]}:00 to {this.state.todos[0].countryHours[1]}:00 hours</p>
              <p>working hours of {this.state.todos[1].countryName} are populated from database: {this.state.todos[1].countryHours[0]}:00 to {this.state.todos[1].countryHours[1]}:00 hours</p>
            </div>
          <br/>
            <div>
              <h4>Select date of order</h4>
              {
                country === 'PAK' ? 
                <DatePicker
                  value={date}
                  selected={date}
                  onChange={this.selectDate.bind(this)}
                  dateFormat='dd/MM/yyyy'
                  minDate = {new Date()}
                  filterDate={date => date.getDay() !== 6 && date.getDay() !== 0}
                />
                :
                null
              }

              {
                country === 'UAE' ? 
                <DatePicker
                  value={date}
                  selected={date}
                  onChange={this.selectDate.bind(this)}
                  dateFormat='dd/MM/yyyy'
                  minDate = {new Date()}
                  filterDate={date => date.getDay() !== 6 && date.getDay() !== 0}
                />
                :
                null
              }
            </div>
            
            <br/>
            <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid>

                  <KeyboardTimePicker 
                    margin='normal'
                    id='time-picker'
                    label='Time-picker'
                    value={this.state.selectedTime}
                    onChange={this.setSelectedTime.bind(this)}
                    keyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
  
                  />
              </Grid>
                  
            </MuiPickersUtilsProvider>

            </div>
            <br/>
            <div>
              
                <select onChange={this.selectType.bind(this)} value={type}>
                  <option>Select Type</option>
                  <option value='urgent'>Urgent</option>
                  <option value='normal'>Normal</option>
                </select>
                <p>Urgent Delivery time is 6hours and Normal Delivery time is 10hours</p>              
            </div>
            <div className="form-group">
                <input type="submit" value="Estimate Delivery Time" className="btn btn-primary" />
            </div>

          </form>
          <div>
                  <h3>Estimated Date of Delivery is DD/MM: {this.state.newProducts.datee}/{this.state.newProducts.month}</h3>
          <h3>Estimated Time of Delivery is: {this.state.newProducts.hours}:{this.state.newProducts.mins} hours:mins</h3>
          </div>
          
        </div>
      
    );
  }
}

//export default App;
