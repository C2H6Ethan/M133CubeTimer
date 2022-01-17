import React, { Component, button } from 'react';
import axios from 'axios';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Navigate } from "react-router-dom";
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import ls from 'local-storage'

var Scrambo = require('scrambo');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerText: '0.00',
      timerColor: '#000000',
      isTimerRunning: false,
      isSpacePressed: false,
      scramble: '',
      role: '',
      solves: [],
      users: [],
      isLoggedIn: true,
      username: '',
    };
  }
  componentDidMount = async() => {
    var isLoggedIn = ls.get('isLoggedIn');
    if(isLoggedIn != 'true'){
      this.setState({ isLoggedIn: false }); 
    }
    else{
      var username = ls.get('username')
      this.setState({username: username})
    }
    this.getScramble();
    this.getSolves();
    this.getUsers();
    this.getRole();

    document.addEventListener('keydown', this.handleTimerPressIn)
    document.addEventListener('keyup', this.handleTimerPressOut)
  }

  getRole = () => {
    var role = ls.get('role');
    this.setState({role: role})
  }

  getSolves = () => {
    axios
      .get("http://localhost:5000/solves/")
      .then((response) => {
        var solves = response.data;
        this.setState({ solves: solves });
        var newSolves = [];
        solves.forEach(element => {
          if(element['user'] == this.state.username){newSolves.push(element)}
        });
        this.setState({ solves: newSolves });
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  getUsers = () => {
    axios
      .get("http://localhost:5000/users/")
      .then((response) => {
        var users = response.data;
        this.setState({ users: users });
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  getScramble = () => {
    var scrambo = new Scrambo(); 
    var scramble = scrambo.get(1);
    this.setState({scramble: scramble});
  }

  handleTimerPressIn = async (event) => {
    if(event.key === ' ' && this.state.isSpacePressed === false){
      // start timer
      
      this.setState({isSpacePressed: true})

      if (this.state.isTimerRunning)
      {
        // finish timer
        clearTimeout(this.timerTimout);
        this.setState({isTimerRunning: false, isSpacePressed: false});

        // save solve
        var solve = {time: this.state.timerText, scramble: this.state.scramble}
        this.state.solves.push(solve);
        this.saveSolveToDB();
        // display new averages

        // set new scramble
        this.getScramble();

      }
      else {
        this.setState({timerColor: 'red'});
        this.greenTimer = setTimeout(() => { this.setState({timerColor: 'lime'}) }, 250);
      }
    }
  }
  // This function will handle the submission.
  saveSolveToDB = () => {
    const newSolve = {
      time: this.state.timerText,
      scramble: this.state.scramble,
      user: this.state.username
    };

    // This will send a post request to update the data in the database.
    axios
      .post(
        "http://localhost:5000/solves/add" ,
        newSolve
      )
      .then((res) => console.log(res.data));

  }

  handleTimerPressOut = async () => {
    clearTimeout(this.greenTimer);
  

    if (this.state.timerColor === 'lime'){
      // start timer
      this.setState({isTimerRunning: true})
      

      this.startTime = new Date();
      this.handleStartTimer();
    }
    this.setState({timerColor: 'black', isSpacePressed: false})
  }

  handleStartTimer = async () => {
    var now = new Date();
    var diff = now - this.startTime;
    
    var seconds = diff / 1000;
    seconds = seconds.toFixed(2);

    this.setState({timerText: seconds})

    this.timerTimout = setTimeout(() => { this.handleStartTimer(); }, 10);
  }
  lapsList() {
    return this.state.solves.reverse().map((data, index) => {
      var newIndex = this.state.solves.length - index;
      return (
        <div className='solve'>
          <div className='solveIndex'>{newIndex}</div>
          <div className='solveTime'>{data.time}</div>
          <button onClick={() => this.deleteSolve(data._id, newIndex -1)}>Delete</button>
        </div>
      )
    })
  }
  userList() {
    return this.state.users.map((data, index) => {
      return (
        <div className='solve'>
          <div className='solveTime'>{data.username}</div>
          <button onClick={() => this.deleteUser(data._id, index)}>Delete</button>
        </div>
      )
    })
  }
  deleteSolve = (_id, index) => {
    var solves = this.state.solves;
    solves.splice(index, 1)
    this.setState({solves: solves});
    axios
      .delete(
        `http://localhost:5000/${_id}` 
      )
   
  }
  deleteUser = (_id, index) => {
    var users = this.state.users;
    users.splice(index, 1)
    this.setState({users: users});
    axios
      .delete(
        `http://localhost:5000/users/${_id}` 
      )
   
  }

  logout = () =>{
    ls.set('isLoggedIn', 'false');
    this.setState({isLoggedIn: false})
  }

  filterTimes = (e) =>{
    var solves = this.state.solves;
    var newSolves = [];
    solves.forEach(solve => {
      if(solve['time'].includes(e)){newSolves.push(solve)}
    });
    this.setState({solves: newSolves})
    if(e == ''){this.setState({solves: solves})}
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    if (!isLoggedIn) {
        return <Navigate to="/sign-in" />
    }
    return (
      <div className='masterWrapper'>
        <div className='lists'>
          <input type="text" className="form-control" placeholder="Search Times" onChange={(e) => this.filterTimes(e.target.value)}/>
          <div className='solvesWrapper'>
            {this.lapsList()}
          </div>
          {this.state.role == 'ROLE_ADMIN'? 
          <div className='solvesWrapper'>
            {this.userList()}
          </div> : null}
        </div>
        
        <div className='appWrapper'>
          <div className='scrambleUsernameWrapper'>
            <div className='scramble'>{this.state.scramble}</div>
            <div className='username'>{this.state.username}</div>
          </div>
          <div className='timerWrapper'>
            <div className='timerText' style={{color: this.state.timerColor}}>{this.state.timerText}</div>
            <button className='logout' onClick={this.logout}>Logout</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
