import React, { useState } from "react";
import "./App.css";
import InventoryTable from "./inventory.js";

const armor = require("./data/armor.json");
const weapons = require("./data/weapons.json");
const adv_gear = require("./data/adventuring_gear.json");
const tools = require("./data/tools.json");

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
                <CollapsingSection title={armor.category}>
                    <InventoryTable data={armor} refreshQtyCounter={this.state.refreshQtyCounter} />
                </CollapsingSection>
                <CollapsingSection title={weapons.category}>
                    <InventoryTable data={weapons} refreshQtyCounter={this.state.refreshQtyCounter} />
                </CollapsingSection>
                <CollapsingSection title={adv_gear.category}>
                    <InventoryTable data={adv_gear} refreshQtyCounter={this.state.refreshQtyCounter} />
                </CollapsingSection>
                <CollapsingSection title={tools.category}>
                    <InventoryTable data={tools} refreshQtyCounter={this.state.refreshQtyCounter} />
                </CollapsingSection>
            </div>
        );
    }
}

function CollapsingSection(props) {
    const [isCollapsed, setCollapsed] = useState(false);
    let clss = "section";
    let plus = "[-]";
    if (isCollapsed) {
        clss += " hidden";
        plus = "[+]";
    }
    return (
        <div className="collapsing_section">
            <div><a href="#" onClick={() => {
                if (isCollapsed === true) setCollapsed(false); else setCollapsed(true);
            }}>{plus}</a> {props.title}</div>
            <div className={clss}>
                {props.children}
            </div>
        </div>
    );
}

export default App;