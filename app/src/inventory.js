function InventoryTable(props) {
    let data = props.data;

    const rows = data.items.map((item, index) => {
        if ("items" in item) {
            return <InventoryCategory data={item} key={index} />;
        } else {
            return <InventoryRow data={item} key={index} />;
        }
    });

    return (
        <div className="inventory_container">
            <h3>{data.category}</h3>
            <table className="inventory_table">
                <tr>
                    <th>Item</th>
                    <th>Cost</th>
                </tr>
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
            <tr><td colSpan="2" className="inventory_category">{data.name}</td></tr>
            {subitems}
        </tbody>
    );
}

function InventoryRow(props) {
    let data = props.data;
    return (
        <tr>
            <td>{data.name}</td>
            <td>{data.cost.value} {data.cost.type}</td>
        </tr>
    );
}

export default InventoryTable;