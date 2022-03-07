import React from "react";
import "./App.css";

import ProfileSection from "./profiles";
import InventorySection from "./inventory";
import { Modal } from "./utilities";

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app">
                <h2>RPG Merchant Inventory Generator</h2>

                <ProfileSection />

                <InventorySection />

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