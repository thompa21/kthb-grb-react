import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roombookings: [],
      isLoading: true,
      errors: null
    };
    var todaysdate = new Date();
    var yyyy = todaysdate.getFullYear();
    var mm = todaysdate.getMonth()+1; // getMonth() is zero-based
    var dd  = todaysdate.getDate();
    this.date = String(yyyy + '-' + mm + '-' + dd);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  yyyymmdd(dateIn) {
    var yyyy = dateIn.getFullYear();
    var mm = dateIn.getMonth()+1; // getMonth() is zero-based
    var dd  = dateIn.getDate();
    return String(yyyy + '-' + mm + '-' + dd); // Leading zeros for mm and dd
 }

prev() {
  var mydate = new Date(this.date);
  mydate.setDate(mydate.getDate() - 1);
  console.log(this.yyyymmdd(mydate));
  this.date = this.yyyymmdd(mydate);
  this.getBookings(this.yyyymmdd(mydate));
}

next() {
    var mydate = new Date(this.date);
    mydate.setDate(mydate.getDate() + 1);
    console.log(this.yyyymmdd(mydate));
    this.date = this.yyyymmdd(mydate);
    this.getBookings(this.yyyymmdd(mydate));
}

  getBookings(date) {
    // We're using axios instead of Fetch
    axios
      // The API we're requesting data from
      .get("http://apps.lib.kth.se/webservices/mrbs/api/v1/getroombookings?area_id=2&bookingdate=" + date + "&api_key=jbjhvbas56fa865faityvasdfa5f8as5fd8a6scda864s5cd8a4sdc863c861c8136dc1864wq86drc8q6cc1cghfx12gfmoi909")
      // Once we get a response, we'll map the API endpoints to our props
      .then(response => {
        this.setState({
          roombookings: response.data,
          isLoading: false
        });
      }
      )
      // We can still use the `.catch()` method since axios is promise-based
      .catch(error => this.setState({ error, isLoading: false }));
  }

  componentDidMount() {
    this.getBookings(this.date);
    this.timer = setInterval(() => this.getBookings(this.date), 5000);
  }

  componentWillUnmount() {
    this.timer = null;
  }

  render() {
    const { isLoading, roombookings } = this.state;
    return (
      <div className="App">
        <header>
          <button onClick={this.prev}>prev</button>
          <span>{this.date}</span>
          <button onClick={this.next}>next</button>
        </header>
        <React.Fragment>
      <h2>Bokningar</h2>
      <div>
        {!isLoading ? (
          roombookings.map(booking => {
            const { roomname, bookings } = booking;
            return (
              <div key={roomname}>
                <p>{roomname}</p>
                {
                  bookings.map(booking => {
                  const { hour, status, bookingid, endtime } = booking;
                  return (
                    <span class={status} key={hour}>
                      {hour}
                      {status}
                    </span>
                  );
                })}
                <hr />
              </div>
            );
          })
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </React.Fragment>
      </div>
    );
  }
}

export default App;
