import React from "react";
import { cloneDeep } from "lodash";
import "./App.css";

import ProfileSection from "./profiles";
import InventorySection from "./inventory";
import { Modal } from "./utilities";

const armor_default = require("./data/armor.json");
const weapons_default = require("./data/weapons.json");
const adv_gear_default = require("./data/adventuring_gear.json");
const tools_default = require("./data/tools.json");

function setDefaultValues(data) {
    let new_data = cloneDeep(data);
    let all_items = new_data.items.map(item => {
        let new_item = cloneDeep(item);
        if ("items" in new_item) {
            let subitems = new_item.items.map(subitem => {
                let new_subitem = cloneDeep(subitem);
                if (!("prob" in new_subitem)) {
                    new_subitem["prob"] = Math.random().toFixed(2);
                }
                if (!("min_qty" in new_subitem)) {
                    new_subitem["min_qty"] = 1;
                }
                if (!("max_qty" in new_subitem)) {
                    new_subitem["max_qty"] = 10;
                }
                return new_subitem;
            });
            new_item.items = subitems;
        } else {
            if (!("prob" in new_item)) {
                new_item["prob"] = Math.random().toFixed(2);
            }
            if (!("min_qty" in new_item)) {
                new_item["min_qty"] = 1;
            }
            if (!("max_qty" in new_item)) {
                new_item["max_qty"] = 10;
            }
        }
        return new_item;
    });
    new_data.items = all_items;
    return new_data;
}

function setProfileData(data) {
    if ("armor" in data) {
        data.armor = setDefaultValues(data.armor);
    } else {
        data.armor = setDefaultValues(cloneDeep(armor_default));
    }
    if ("weapons" in data) {
        data.weapons = setDefaultValues(data.weapons);
    } else {
        data.weapons = setDefaultValues(cloneDeep(weapons_default));
    }
    if ("adv_gear" in data) {
        data.adv_gear = setDefaultValues(data.adv_gear);
    } else {
        data.adv_gear = setDefaultValues(cloneDeep(adv_gear_default));
    }
    if ("tools" in data) {
        data.tools = setDefaultValues(data.tools);
    } else {
        data.tools = setDefaultValues(cloneDeep(tools_default));
    }
    return data;
}

var test_profile_data = {
    "profile1": {
        "armor": {
            "id": "armor",
            "category": "Armor",
            "items": [
                {"id": "armor|0", "name": "Light Armor", "items": [
                    {"id": "armor|0|0", "name": "Padded", "cost": {"value": 5, "type": "gp"}, "weight": "8 lb.", "ac": "11 + Dex mod", "strength": null, "stealth": "Disadvantage", "prob": 0.3, "min_qty": 1, "max_qty": 3},
                    {"id": "armor|0|1", "name": "Leather", "cost": {"value": 10, "type": "gp"}, "weight": "10 lb.", "ac": "11 + Dex mod", "strength": null, "stealth": null, "prob": 0.3, "min_qty": 1, "max_qty": 3},
                    {"id": "armor|0|2", "name": "Studded leather", "cost": {"value": 45, "type": "gp"}, "weight": "13 lb.", "ac": "12 + Dex mod", "strength": null, "stealth": null, "prob": 0.3, "min_qty": 1, "max_qty": 3}
                ]},
                {"id": "armor|1", "name": "Medium Armor", "items": [
                    {"id": "armor|1|0", "name": "Hide", "cost": {"value": 10, "type": "gp"}, "weight": "12 lb.", "ac": "12 + Dex mod (max 2)", "strength": null, "stealth": null, "prob": 0.3, "min_qty": 1, "max_qty": 3},
                    {"id": "armor|1|1", "name": "Chain shirt", "cost": {"value": 50, "type": "gp"}, "weight": "20 lb.", "ac": "13 + Dex mod (max 2)", "strength": null, "stealth": null, "prob": 0.3, "min_qty": 1, "max_qty": 3},
                    {"id": "armor|1|2", "name": "Scale mail", "cost": {"value": 50, "type": "gp"}, "weight": "45 lb.", "ac": "14 + Dex mod (max 2)", "strength": null, "stealth": "Disadvantage", "prob": 0.3, "min_qty": 1, "max_qty": 3},
                    {"id": "armor|1|3", "name": "Breastplate", "cost": {"value": 400, "type": "gp"}, "weight": "20 lb.", "ac": "14 + Dex mod (max 2)", "strength": null, "stealth": null, "prob": 0.3, "min_qty": 1, "max_qty": 3},
                    {"id": "armor|1|4", "name": "Half plate", "cost": {"value": 750, "type": "gp"}, "weight": "40 lb.", "ac": "15 + Dex mod (max 2)", "strength": null, "stealth": "Disadvantage", "prob": 0.3, "min_qty": 1, "max_qty": 3}
                ]},
                {"id": "armor|2", "name": "Heavy Armor", "items": [
                    {"id": "armor|2|0", "name": "Ring mail", "cost": {"value": 30, "type": "gp"}, "weight": "40 lb.", "ac": "14", "strength": null, "stealth": "Disadvantage", "prob": 0.3, "min_qty": 1, "max_qty": 3},
                    {"id": "armor|2|1", "name": "Chain mail", "cost": {"value": 75, "type": "gp"}, "weight": "55 lb.", "ac": "16", "strength": "Str 13", "stealth": "Disadvantage", "prob": 0.3, "min_qty": 1, "max_qty": 3},
                    {"id": "armor|2|2", "name": "Splint", "cost": {"value": 200, "type": "gp"}, "weight": "60 lb.", "ac": "17", "strength": "Str 15", "stealth": "Disadvantage", "prob": 0.3, "min_qty": 1, "max_qty": 3},
                    {"id": "armor|2|3", "name": "Plate", "cost": {"value": 1500, "type": "gp"}, "weight": "65 lb.", "ac": "18", "strength": "Str 15", "stealth": "Disadvantage", "prob": 0.3, "min_qty": 1, "max_qty": 3}
                ]},
                {"id": "armor|3", "name": "Shield", "items": [
                    {"id": "armor|3|0", "name": "Shield", "cost": {"value": 10, "type": "gp"}, "weight": "6 lb.", "ac": "+2", "strength": null, "stealth": null, "prob": 0.3, "min_qty": 1, "max_qty": 3}
                ]}
            ],
            "extra_fields": {"ac": "Armor Class (AC)", "strength": "Strength", "stealth": "Stealth"}
        }
    },
    "profile2": {
        "armor": {
            "id": "armor",
            "category": "Armor",
            "items": [
                {"id": "armor|0", "name": "Light Armor", "items": [
                    {"id": "armor|0|0", "name": "Padded", "cost": {"value": 5, "type": "gp"}, "weight": "8 lb.", "ac": "11 + Dex mod", "strength": null, "stealth": "Disadvantage", "prob": 0.4, "min_qty": 2, "max_qty": 4},
                    {"id": "armor|0|1", "name": "Leather", "cost": {"value": 10, "type": "gp"}, "weight": "10 lb.", "ac": "11 + Dex mod", "strength": null, "stealth": null, "prob": 0.4, "min_qty": 2, "max_qty": 4},
                    {"id": "armor|0|2", "name": "Studded leather", "cost": {"value": 45, "type": "gp"}, "weight": "13 lb.", "ac": "12 + Dex mod", "strength": null, "stealth": null, "prob": 0.4, "min_qty": 2, "max_qty": 4}
                ]},
                {"id": "armor|1", "name": "Medium Armor", "items": [
                    {"id": "armor|1|0", "name": "Hide", "cost": {"value": 10, "type": "gp"}, "weight": "12 lb.", "ac": "12 + Dex mod (max 2)", "strength": null, "stealth": null, "prob": 0.4, "min_qty": 2, "max_qty": 4},
                    {"id": "armor|1|1", "name": "Chain shirt", "cost": {"value": 50, "type": "gp"}, "weight": "20 lb.", "ac": "13 + Dex mod (max 2)", "strength": null, "stealth": null, "prob": 0.4, "min_qty": 2, "max_qty": 4},
                    {"id": "armor|1|2", "name": "Scale mail", "cost": {"value": 50, "type": "gp"}, "weight": "45 lb.", "ac": "14 + Dex mod (max 2)", "strength": null, "stealth": "Disadvantage", "prob": 0.4, "min_qty": 2, "max_qty": 4},
                    {"id": "armor|1|3", "name": "Breastplate", "cost": {"value": 400, "type": "gp"}, "weight": "20 lb.", "ac": "14 + Dex mod (max 2)", "strength": null, "stealth": null, "prob": 0.4, "min_qty": 2, "max_qty": 4},
                    {"id": "armor|1|4", "name": "Half plate", "cost": {"value": 750, "type": "gp"}, "weight": "40 lb.", "ac": "15 + Dex mod (max 2)", "strength": null, "stealth": "Disadvantage", "prob": 0.4, "min_qty": 2, "max_qty": 4}
                ]},
                {"id": "armor|2", "name": "Heavy Armor", "items": [
                    {"id": "armor|2|0", "name": "Ring mail", "cost": {"value": 30, "type": "gp"}, "weight": "40 lb.", "ac": "14", "strength": null, "stealth": "Disadvantage", "prob": 0.4, "min_qty": 2, "max_qty": 4},
                    {"id": "armor|2|1", "name": "Chain mail", "cost": {"value": 75, "type": "gp"}, "weight": "55 lb.", "ac": "16", "strength": "Str 13", "stealth": "Disadvantage", "prob": 0.4, "min_qty": 2, "max_qty": 4},
                    {"id": "armor|2|2", "name": "Splint", "cost": {"value": 200, "type": "gp"}, "weight": "60 lb.", "ac": "17", "strength": "Str 15", "stealth": "Disadvantage", "prob": 0.4, "min_qty": 2, "max_qty": 4},
                    {"id": "armor|2|3", "name": "Plate", "cost": {"value": 1500, "type": "gp"}, "weight": "65 lb.", "ac": "18", "strength": "Str 15", "stealth": "Disadvantage", "prob": 0.4, "min_qty": 2, "max_qty": 4}
                ]},
                {"id": "armor|3", "name": "Shield", "items": [
                    {"id": "armor|3|0", "name": "Shield", "cost": {"value": 10, "type": "gp"}, "weight": "6 lb.", "ac": "+2", "strength": null, "stealth": null, "prob": 0.4, "min_qty": 2, "max_qty": 4}
                ]}
            ],
            "extra_fields": {"ac": "Armor Class (AC)", "strength": "Strength", "stealth": "Stealth"}
        }
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);

        let prof_data = cloneDeep(test_profile_data);
        console.log(prof_data);
        let profileKeys = Object.keys(prof_data);
        for (let i in profileKeys) {
            let key = profileKeys[i];
            prof_data[key] = setProfileData(prof_data[key]);
        }

        this.state = {
            currentProfile: "profile1",
            profileData: prof_data
        };

        this.handleProfileChange = this.handleProfileChange.bind(this);
        this.handleItemChange = this.handleItemChange.bind(this);
    }

    handleProfileChange(profile_id) {
        if (profile_id in this.state.profileData) {
            this.setState({currentProfile: profile_id});
        } else {
            let prevProfiles = this.state.profileData;
            prevProfiles[profile_id] = setProfileData({});
            this.setState({currentProfile: profile_id, profileData: prevProfiles});
        }
    }

    handleItemChange(item_id, newState) {
        let addr_split = item_id.split("|");
        let data_copy = cloneDeep(this.state.profileData);
        let data = data_copy[this.state.currentProfile];
        let addr = "";
        // traverse the nested objects until you find the final item
        for (let i in addr_split) {
            if (addr === "") {
                // first address
                addr += addr_split[i];
                data = data[addr];
            } else {
                addr += "|" + addr_split[i];
                data = data.items;
                data = data.find(el => el.id === addr);
            }
        }
        if (data !== undefined) {
            let newKeys = Object.keys(newState);
            newKeys.forEach(key => {
                data[key] = newState[key];
            });
        }
        this.setState({profileData: data_copy});
    }

    render() {
        return (
            <div className="app">
                <h2>RPG Merchant Inventory Generator</h2>

                <ProfileSection signalProfileChange={this.handleProfileChange} />

                <InventorySection profileData={this.state.profileData[this.state.currentProfile]} signalItemChange={this.handleItemChange} />

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