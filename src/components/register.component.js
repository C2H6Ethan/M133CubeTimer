import React, { Component } from "react";
import axios from 'axios';
import { Navigate } from "react-router-dom";


export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: '',
          isRegistered: false,
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit = (e) =>{
        e.preventDefault();
        if(this.state.username != '' && this.state.password != ''){
            if(this.state.password.length    < 5){
                alert("Password is too short!")
            }
            else{
                axios.post('http://localhost:5000/api/auth/signup', {
                    username: this.state.username,
                    password: this.state.password,
                    roles: ["user"]
                  })
                  .then((response)  => {
                    console.log(response)
                    if(response.status == 200){
                        this.setState({isRegistered: true})
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                    alert("Username already taken!")
                  });
            }
            
        }
    }

    setUsername = (username) =>{
        this.setState({username: username})
    }
    setPassword = (password) =>{
        this.setState({password: password})
    }

    render() {
        const isRegistered = this.state.isRegistered;
        if (isRegistered) {
            return <Navigate to="/sign-in" />
        }
        return (
            <form onSubmit={this.onSubmit} className="form">
                <h3>Register</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input type="username" className="form-control" placeholder="Enter username" onChange={(e) => this.setUsername(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" onChange={(e) => this.setPassword(e.target.value)}/>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Register</button>
                <p className="forgot-password text-right">
                    Already registered <a href="/sign-in">sign in?</a>
                </p>
            </form>
        );
    }
}