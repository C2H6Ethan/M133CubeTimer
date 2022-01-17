import React, { Component } from "react";
import axios from 'axios';
import { Navigate } from "react-router-dom";
import ls from 'local-storage'
var fs = require('fs')

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: '',
          isLoggedIn: false,
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit = (e) =>{
        e.preventDefault();
        if(this.state.username != '' && this.state.password != ''){
            axios.post('http://localhost:5000/api/auth/signin', {
                username: this.state.username,
                password: this.state.password
              })
              .then((response)  => {
                if(response.status == 200){
                    console.log(response.data.roles)
                    this.setState({isLoggedIn: true})
                    ls.set('isLoggedIn', 'true')
                    ls.set('username', this.state.username)
                    ls.set('role', response.data.roles[0])
                }
              })
              .catch(function (error) {
                console.log(error)
                alert("Incorrect Username or Password")
              });
        }
    }

    setUsername = (username) =>{
        this.setState({username: username})
    }
    setPassword = (password) =>{
        this.setState({password: password})
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;
        if (isLoggedIn) {
            return <Navigate to="/"/>
        }
        return (
            <form onSubmit={this.onSubmit} className="form">
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input type="username" className="form-control" placeholder="Enter username" onChange={(e) => this.setUsername(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" onChange={(e) => this.setPassword(e.target.value)}/>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                <p className="forgot-password text-right">
                     <a href="/sign-up">Not registered?</a>
                </p>
            </form>
        );
    }
}
