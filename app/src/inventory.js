import React from 'react';
import { CollapsingSection } from "./utilities";

class InventorySection extends React.Component {
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
        let armor = this.props.profileData["armor"];
        let weapons = this.props.profileData["weapons"];
        let adv_gear = this.props.profileData["adv_gear"];
        let tools = this.props.profileData["tools"];
        return (
            <section className="inventory_section">
                <button type="button" onClick={this.handleButtonClick}>Generate Quantities</button>
                <CollapsingSection title={armor.category}>
                    <InventoryTable
                        data={armor}
                        signalItemChange={this.props.signalItemChange}
                        refreshQtyCounter={this.state.refreshQtyCounter}
                    />
                </CollapsingSection>
                <CollapsingSection title={weapons.category}>
                    <InventoryTable
                        data={weapons}
                        signalItemChange={this.props.signalItemChange}
                        refreshQtyCounter={this.state.refreshQtyCounter}
                    />
                </CollapsingSection>
                <CollapsingSection title={adv_gear.category}>
                    <InventoryTable
                        data={adv_gear}
                        signalItemChange={this.props.signalItemChange}
                        refreshQtyCounter={this.state.refreshQtyCounter}
                    />
                </CollapsingSection>
                <CollapsingSection title={tools.category}>
                    <InventoryTable
                        data={tools}
                        signalItemChange={this.props.signalItemChange}
                        refreshQtyCounter={this.state.refreshQtyCounter}
                    />
                </CollapsingSection>
            </section>
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
            <h3>{data.category}</h3>
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