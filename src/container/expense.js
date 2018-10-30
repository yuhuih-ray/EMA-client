import React, { Component } from "react";
import { Button, Icon, Input } from 'antd';
import 'antd/dist/antd.css';

var config = require('../config.js');
const axios = require('axios');
var Loader = require('react-loader');

class Title extends Component {
  render()  {
    const title = "Expense Management";

    return (<h1 style={{color: '#203954'}}>{title}</h1>);
  }
}

class Statement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      token: false,
      showForm: false,
      transactionAmount: '',
      transactionDescription: '',
      transactionTimestamp: '',
      error: ''
    }
    this.addNewTransaction = this.addNewTransaction.bind(this);
    this.showForm = this.showForm.bind(this);
    this.handleTransactionAmount = this.handleTransactionAmount.bind(this);
    this.handleTransactionDescription = this.handleTransactionDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showForm() {
    this.setState( (state) => ({
      showForm: !state.showForm
    }));
  }

  handleTransactionAmount(event) {
    this.setState({
      transactionAmount: event.target.value
    });
  }

  handleTransactionDescription(event) {
    this.setState({
      transactionDescription: event.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    this.setState({
      loaded: false
    });

    /**
     * Validate user input
     */
    if(isNaN(this.state.transactionAmount)) {

      this.setState({
        error: 'Amount must be numbers',
        loaded: true
      });
      this.forceUpdate();
      return;

    } else if (this.state.transactionAmount === '' || this.state.transactionDescription === '') {

      this.setState({
        error: 'All fileds are required',
        loaded: true
      });
      this.forceUpdate();
      return;

    } else {

      this.setState({
        error: '',
      });
      this.forceUpdate();

    }

    /**
     * AJAX call to create a new transaction
     */
    axios({

      method: 'post',
      url: config.base_url+'api/v1/transaction',
      data: {
        amount: parseFloat(this.state.transactionAmount),
        description: this.state.transactionDescription
      },
      headers: {
        'Authorization': 'Bearer ' + this.state.token
      }

    })
      .then( (response) => {

        this.setState( prevState => ({
          transactions: [...prevState.transactions, response.data.data],
          loaded: true
        }));

        this.forceUpdate();

      });
  }

  addNewTransaction(amount, description) {

    console.log(amount);
  }

  getInitialState() {

    return {loaded: false};
    
  }

  /**
   * AJAX Axio
   */
  componentDidMount() {
    //const token = this.state.token;

    // Login AJAX request
    axios({
      method: 'post',
      url: config.base_url+'api/v1/auth/login',
      data: {
        email: 'test@email.com',
        password: 'defaultpass'
      }
    })
      .then( (response) => {
        this.setState({
          token: response.data.token
        });
        console.log(response.data.token);

        // after login, get transactions from server
        axios({
          method: 'get',
          url: config.base_url+'api/v1/transaction',
          headers: {
            'Authorization': 'Bearer ' + response.data.token
          }
        })
        .then( (response) => {

          this.setState({
            transactions: response.data.data.reverse(),
            loaded: true
          })

        })
        .catch( (error) => {
          console.log(error);
        });
      })
      .catch( (error) => {
          console.log(error);
      })
  }

  render() {
    /**
     * Styles
     */
    const thStyle = {
      fontSize: '20pt',
      color: '#2f4b6a',
      textAlign: 'left'
    }

    const tableStyle = {
      borderCollapse: 'collapse' ,
      width: '100%',
      padding: '10pt',
    }

    const timeStyle = {
      fontSize: '18pt',
      color: '#362010',
      textAlign: 'left'
    }

    const amountStyle = {
      fontSize: '18pt',
      color: '#002928',
      textAlign: 'left'
    }

    const descriptionStlye = {
      fontSize: '18pt',
      textAlign: 'left'
    }

    const secStyle = {
      fontSize: '18pt',
      color: '#367371',
      textAlign: 'left'
    }

    /**
     * Data
     */
    const heads = ["Transaction Date", "Transaction Amount", "Description", "Security Level"];
    const thead = heads.map((head, index) => (<th style={thStyle} key={"th."+index}> {head} </th>));
    console.log(this.state.transactions);
    const transactionItem = this.state.transactions.map((t, index) => (
    <tr key={"transaction."+index}><td style={timeStyle}>{t.timestamp}</td><td style={amountStyle}>$ {t.amount}</td><td style={descriptionStlye}>{t.description}</td><td style={secStyle}>High</td></tr>
    ));

    /**
     * Table
     */
    const content = (
      <div>
      <div>
      <Button type="primary" size="large" onClick={this.showForm}><Icon type="form" theme="outlined" />Add New Transaction</Button> <br/><br/>
      <form style={{display: this.state.showForm ? 'inline-block' : 'none'}}>
        <span> Transaction Amount </span><Input type="text" onChange={this.handleTransactionAmount}/><br/>
        <span> Transaction Description </span><Input type="text" onChange={this.handleTransactionDescription}/><br/><br/>
        <Button id="submitButton" onClick={this.handleSubmit}> Submit </Button><br/>
        <div id="error" style={{color: 'red'}}> {this.state.error} </div>
      </form>
      </div>

      <table style={tableStyle}>

        <thead><tr>{thead}</tr></thead>
        <tbody>
          {transactionItem}
          <Loader loaded={this.state.loaded}></Loader>
        </tbody>

      </table>
      </div>
    );

    return content;
  }
}


class Expense extends Component {

  render() {
    
    return (
      <div> 
        <div> <Title /> </div>
        <div> <Statement /> </div>
      </div>
    );
  }

}

export default Expense;
