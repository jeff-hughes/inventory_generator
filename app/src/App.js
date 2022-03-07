import React from "react";
import "./App.css";

import ProfileSection from "./profiles";
import InventoryTable from "./inventory";
import { CollapsingSection, Modal } from "./utilities";

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
                <h2>RPG Merchant Inventory Generator</h2>

                <ProfileSection />

                <section className="inventory_section">
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
                </section>

                <footer>
                    <AboutModal />
                </footer>
            </div>
        );
    }
}

function AboutModal() {
    return (
        <Modal linkText="About">
            <p>This app was created by Jeff Hughes. All Wizards of the Coast content&mdash;the list of equipment, weapons, and armor and their statistics&mdash;was taken from the <a href="https://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf" target="_blank">System Reference Document 5.1</a>, provided under terms of the <a href="ogl.html">Open Gaming License Version 1.0a</a>.</p>
            <p>The code for the app is distributed under the <a href="https://github.com/jeff-hughes/inventory_generator/blob/master/LICENSE" target="_blank">GPLv3</a> license, and is available on <a href="https://github.com/jeff-hughes/inventory_generator" target="_blank">Github</a>. Suggestions and contributions are welcome; please open an issue or pull request there if you wish to contribute.</p>
        </Modal>
    );
}

export default App;