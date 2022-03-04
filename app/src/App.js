import React from 'react';
import "./App.css";
import InventoryTable from './inventory.js';

const armor = require('./data/armor.json');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {num: this.generateNumber()};
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    generateNumber() {
        return Math.random();
    }

    handleButtonClick() {
        this.setState({num: this.generateNumber()});
    }

    render() {
        return (
            <div className="app">
                <h2>D&amp;D 5th Edition Merchant Inventory Generator</h2>
                <button type="button" onClick={this.handleButtonClick}>Button!</button>
                <div>{this.state.num.toString()}</div>
                <InventoryTable data={armor} />
            </div>
        );
    }
}

export default App;