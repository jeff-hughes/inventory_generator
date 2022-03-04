import React from 'react';

function InventoryTable(props) {
    let data = props.data;

    const rows = data.items.map((item, index) => {
        if ("items" in item) {
            return <InventoryCategory data={item} key={index} />;
        } else {
            return <tbody><InventoryRow data={item} key={index} /></tbody>;
        }
    });

    return (
        <div className="inventory_container">
            <h3>{data.category}</h3>
            <table className="inventory_table">
                <thead>
                    <tr>
                        <th className="table_left_align">Item</th>
                        <th className="table_right_align">Cost</th>
                        <th className="table_right_align">Probability</th>
                        <th className="table_right_align">Min. Qty</th>
                        <th className="table_right_align">Max. Qty</th>
                    </tr>
                </thead>
                {rows}
            </table>
        </div>
    );
}

function InventoryCategory(props) {
    let data = props.data;
    const subitems = data.items.map((subitem, subindex) => 
        <InventoryRow data={subitem} key={subindex} />
    );
    return (
        <tbody>
            <tr className="inventory_category"><td colSpan="5">{data.name}</td></tr>
            {subitems}
        </tbody>
    );
}

class InventoryRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            probability: Math.random().toFixed(2),
            min_qty: 1,
            max_qty: 10
        };

        this.handleFloat = this.handleFloat.bind(this);
        this.handleInt = this.handleInt.bind(this);
    }

    handleFloat(event) {
        let str = event.target.value;
        let flt = parseFloat(str);
        // ensure value is valid number between 0 and 1
        if (str === "" || (!isNaN(str) && !isNaN(flt) && flt >= 0.0 && flt <= 1.0)) {
            this.setState({probability: event.target.value.trim()});
        }
    }

    handleInt(event) {
        let str = event.target.value;
        let int = parseInt(str);
        // ensure value is valid integer greater/equal to 0
        if (str === "" || (!isNaN(str) && !isNaN(int) && int >= 0)) {
            let state_val = event.target.getAttribute("data-field");
            let state_obj = {}
            state_obj[state_val] = event.target.value.trim();
            this.setState(state_obj);
        }
    }

    render() {
        let data = this.props.data;
        let money = data.cost.value.toLocaleString("en-US");
        return (
            <tr>
                <td className="table_left_align">{data.name}</td>
                <td className="table_right_align">{money} {data.cost.type}</td>
                <td className="table_right_align"><input type="text" className="inventory_prob_field" value={this.state.probability} onChange={this.handleFloat} /></td>
                <td className="table_right_align"><input type="text" className="inventory_min_qty_field" value={this.state.min_qty} data-field="min_qty" onChange={this.handleInt} /></td>
                <td className="table_right_align"><input type="text" className="inventory_max_qty_field" value={this.state.max_qty} data-field="max_qty" onChange={this.handleInt} /></td>
            </tr>
        );
    }
}

export default InventoryTable;