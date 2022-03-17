import React from 'react';
import { cloneDeep } from "lodash";
import { CollapsingSection } from "./utilities";

class InventorySection extends React.Component {
    constructor(props) {
        super(props);

        // the refresh counter is not used to *count* anything, it just
        // needs to increment each time new random numbers need to be
        // generated, so all the child elements notice a change in their
        // props and can trigger a new roll of the dice
        this.state = {refreshQtyCounter: 0};

        this.handleGenQuantities = this.handleGenQuantities.bind(this);
    }

    handleGenQuantities() {
        this.setState({refreshQtyCounter: this.state.refreshQtyCounter + 1});
    }

    render() {
        let categories = Object.keys(this.props.profileData);
        let sections = categories.map(cat => {
            let data = this.props.profileData[cat];
            return (
                <CollapsingSection title={data.category} key={cat}>
                    <InventoryTable
                        data={data}
                        signalItemChange={this.props.signalItemChange}
                        refreshQtyCounter={this.state.refreshQtyCounter}
                    />
                </CollapsingSection>
            );
        });
        return (
            <section className="inventory_section">
                <InventorySelect categories={categories} addInventory={this.props.addInventory} />
                {sections}
                <button type="button" className="inventory_gen_qty" onClick={this.handleGenQuantities}>Generate Quantities</button>
            </section>
        );
    }
}

class InventorySelect extends React.Component {
    constructor(props) {
        super(props);
        this.allCategories = {
            "armor": "Armor",
            "weapons": "Weapons",
            "adv_gear": "Adventuring Gear",
            "tools": "Tools"
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        let val = e.target.value;
        if (val === "" || val === "na") return false;

        this.props.addInventory(val);
    }

    render() {
        let options = [];
        for (var key in this.allCategories) {
            if (this.allCategories.hasOwnProperty(key) && this.props.categories.indexOf(key) === -1) {
                options.push(<option value={key} key={key}>{this.allCategories[key]}</option>);
            }
        }

        return (
            <div className="inventory_select">
                <label htmlFor="add_inventory">Add new inventory section:</label>
                <select className="add_inventory" value="na" onChange={this.handleChange}>
                    <option value="na">---</option>
                    {options}
                </select>
            </div>
        );
    }
}

function InventoryTable(props) {
    let data = props.data;
    let extra_fields = {};
    if ("extra_fields" in data) {
        extra_fields = data.extra_fields;
    }

    const rows = data.items.map((item, index) => {
        if ("items" in item) {
            return (<InventoryCategory
                data={item}
                extraFields={extra_fields}
                signalItemChange={props.signalItemChange}
                refreshQtyCounter={props.refreshQtyCounter}
                key={index}
            />);
        } else {
            return (
                <tbody key={index}>
                    <InventoryRow
                        data={item}
                        extraFields={extra_fields}
                        signalItemChange={props.signalItemChange}
                        refreshQtyCounter={props.refreshQtyCounter}
                    />
                </tbody>
            );
        }
    });

    let extra_cols = [];
    if ("extra_fields" in data) {
        for (let col in data.extra_fields) {
            extra_cols.push(<th className="table_left_align" key={col}>{data.extra_fields[col]}</th>);
        }
    }

    return (
        <div className="inventory_container">
            <table className="inventory_table">
                <thead>
                    <tr>
                        <th className="table_left_align">Item</th>
                        <th className="table_right_align">Cost</th>
                        <th className="table_right_align">Weight</th>
                        <th className="table_right_align">Probability</th>
                        <th className="table_right_align">Min. Qty</th>
                        <th className="table_right_align">Max. Qty</th>
                        <th className="table_right_align">Qty</th>
                        {extra_cols}
                    </tr>
                </thead>
                {rows}
            </table>
        </div>
    );
}

function InventoryCategory(props) {
    let data = props.data;
    let n_cols = 7 + Object.keys(props.extraFields).length;

    const subitems = data.items.map((subitem, subindex) => {
        return (<InventoryRow
            data={subitem}
            extraFields={props.extraFields}
            isSubField={true}
            signalItemChange={props.signalItemChange}
            refreshQtyCounter={props.refreshQtyCounter}
            key={subindex}
        />);
    });
    return (
        <tbody>
            <tr className="inventory_category"><td colSpan={n_cols}>{data.name}</td></tr>
            {subitems}
        </tbody>
    );
}

class InventoryRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            qty: null,
        };

        this.handleFloat = this.handleFloat.bind(this);
        this.handleInt = this.handleInt.bind(this);
        this.generateQty = this.generateQty.bind(this);
    }

    handleFloat(event) {
        let str = event.target.value.trim();
        let flt = parseFloat(str);

        // allow empty values
        if (str === "") {
            this.props.signalItemChange(this.props.data.id, {prob: str});
        }
        // ensure value is valid number between 0 and 1
        else if (!isNaN(str) && !isNaN(flt) && flt >= 0.0 && flt <= 1.0) {
            this.props.signalItemChange(this.props.data.id, {prob: flt});
        }
    }

    handleInt(event) {
        let state_val = event.target.getAttribute("data-field");
        let state_obj = {}
        let str = event.target.value.trim();
        let int = parseInt(str);

        // allow empty values
        if (str === "") {
            state_obj[state_val] = str;
            this.props.signalItemChange(this.props.data.id, state_obj);
        }
        // ensure value is valid integer greater/equal to 0
        else if (!isNaN(str) && !isNaN(int) && int >= 0) {
            state_obj[state_val] = int;
            this.props.signalItemChange(this.props.data.id, state_obj);
        }
    }

    generateQty() {
        if (this.props.prob !== "" && this.props.min_qty !== "" && this.props.max_qty !== "") {
            let rand = Math.random();
            if (rand < this.props.prob) {
                let qty = Math.floor(Math.random() * (this.props.max_qty - this.props.min_qty + 1) + this.props.min_qty);
                this.setState({qty: qty});
            } else {
                this.setState({qty: 0});
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.refreshQtyCounter !== prevProps.refreshQtyCounter) {
            this.generateQty();
        }
    }

    render() {
        let data = this.props.data;
        let money = data.cost.value.toLocaleString("en-US");

        let name_class = "table_left_align";
        if (this.props.isSubField) {
            name_class += " table_indent";
        }

        let extra_cols = [];
        for (let col in this.props.extraFields) {
            let val = "--";
            if (data[col] !== null) {
                val = data[col]
            }
            extra_cols.push(<td className="table_left_align" key={col}>{val}</td>);
        }

        return (
            <tr>
                <td className={name_class}>{data.name}</td>
                <td className="table_right_align">{money} {data.cost.type}</td>
                <td className="table_right_align">{data.weight}</td>
                <td className="table_right_align">
                    <input type="text" className="inventory_prob_field" value={data.prob} onChange={this.handleFloat} />
                </td>
                <td className="table_right_align">
                    <input type="text" className="inventory_min_qty_field" value={data.min_qty} data-field="min_qty" onChange={this.handleInt} />
                </td>
                <td className="table_right_align">
                    <input type="text" className="inventory_max_qty_field" value={data.max_qty} data-field="max_qty" onChange={this.handleInt} />
                </td>
                <td className="table_right_align">
                    {this.state.qty}
                </td>
                {extra_cols}
            </tr>
        );
    }
}

export default InventorySection;