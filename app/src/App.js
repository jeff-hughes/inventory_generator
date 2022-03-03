import "./App.css";
import InventoryTable from './inventory.js';

const armor = require('./data/armor.json');

function App() {
    return (
        <div className="app">
            <h2>D&amp;D 5th Edition Merchant Inventory Generator</h2>
            <InventoryTable data={armor} />
        </div>
    );
}

export default App;