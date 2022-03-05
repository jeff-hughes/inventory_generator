import React from 'react';
import "./App.css";
import InventoryTable from './inventory.js';

const armor = require('./data/armor.json');

class App extends React.Component {
    constructor(props) {
        super(props);
        // the refresh counter is not used to *count* anything, it just
        // needs to increment each time new random numbers need to be
        // generated, so all the child elements notice a change in their
        // props and can trigger a new roll of the dice
        this.state = {refreshQtyCounter: 0};
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick() {
        this.setState({refreshQtyCounter: this.state.refreshQtyCounter + 1});
    }

    render() {
        return (
            <div className="app">
                <h2>D&amp;D 5th Edition Merchant Inventory Generator</h2>
                <button type="button" onClick={this.handleButtonClick}>Generate Quantities</button>
                <InventoryTable data={armor} refreshQtyCounter={this.state.refreshQtyCounter} />
            </div>
        );
    }
}

export default App;