import React from "react";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from 'uuid';

import ProfileSection from "./profiles";
import InventorySection from "./inventory";
import { Modal } from "./helpers";
import "./App.css";

const data_defaults = {
    "armor": require("./data/armor.json"),
    "weapons": require("./data/weapons.json"),
    "adv_gear": require("./data/adventuring_gear.json"),
    "tools": require("./data/tools.json")
};

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
    let categories = Object.keys(data_defaults);
    for (let i in categories) {
        let key = categories[i];
        if (key in data) {
            data[key] = setDefaultValues(data[key]);
        }
    }
    return data;
}

class App extends React.Component {
    constructor(props) {
        super(props);

        let profileIndex = JSON.parse(localStorage.getItem("profileIndex"));
        let currProfile = uuidv4();
        let profData = {};
        
        if (profileIndex === null) {
            profileIndex = {}
            profileIndex[currProfile] = "Profile 1";
            profData[currProfile] = {};
            localStorage.setItem("profileIndex", JSON.stringify(profileIndex));
            localStorage.setItem(currProfile, JSON.stringify({}));
        } else {
            // retrieve data for the first profile listed
            let profileKeys = Object.keys(profileIndex);
            currProfile = profileKeys[0];
            profData[currProfile] = JSON.parse(localStorage.getItem(currProfile)) || {};
        }
        console.log(profileIndex);
        console.log(profData);
        let profileKeys = Object.keys(profData);
        for (let i in profileKeys) {
            let key = profileKeys[i];
            profData[key] = setProfileData(profData[key]);
        }

        this.state = {
            profileIndex: profileIndex,
            currentProfile: currProfile,
            profileData: profData
        };

        this.handleProfileChange = this.handleProfileChange.bind(this);
        this.handleProfileTitleChange = this.handleProfileTitleChange.bind(this);
        this.handleDeleteProfile = this.handleDeleteProfile.bind(this);
        this.handleAddInventory = this.handleAddInventory.bind(this);
        this.handleDeleteInventory = this.handleDeleteInventory.bind(this);
        this.handleItemChange = this.handleItemChange.bind(this);
    }

    handleProfileChange(profile_id) {
        if (profile_id !== null && profile_id in this.state.profileIndex) {
            // change to existing profile
            if (!(profile_id in this.state.profileData)) {
                let prevProfileData = cloneDeep(this.state.profileData);
                prevProfileData[profile_id] = JSON.parse(localStorage.getItem(profile_id)) || {};
                this.setState({profileData: prevProfileData});
            }
            this.setState({currentProfile: profile_id});
        } else {
            // create new profile
            let prevProfiles = this.state.profileIndex;
            let prevProfileData = this.state.profileData;
            let num = Object.keys(prevProfiles).length + 1;
            let new_id = uuidv4();
            let profile_name = "Profile " + num;

            prevProfiles[new_id] = profile_name
            prevProfileData[new_id] = setProfileData({});

            localStorage.setItem("profileIndex", JSON.stringify(prevProfiles));
            localStorage.setItem(new_id, JSON.stringify({}));

            this.setState({currentProfile: new_id, profileIndex: prevProfiles, profileData: prevProfileData});
        }
    }

    handleProfileTitleChange(new_title) {
        let prevProfiles = this.state.profileIndex;
        prevProfiles[this.state.currentProfile] = new_title;
        localStorage.setItem("profileIndex", JSON.stringify(prevProfiles));
        this.setState({profileIndex: prevProfiles});
    }

    handleDeleteProfile() {
        let profileIds = Object.keys(this.state.profileIndex);
        let profileNum = profileIds.indexOf(this.state.currentProfile);

        if (profileIds.length > 1) {
            let newProfileId;
            if (profileNum > 0) {
                // jump to previous profile in the list, whatever it is
                newProfileId = profileIds[profileNum - 1];
            } else {
                // jump to next profile instead
                newProfileId = profileIds[profileNum + 1];
            }

            let prevProfileIndex = cloneDeep(this.state.profileIndex);
            delete prevProfileIndex[this.state.currentProfile];
            let prevProfileData = cloneDeep(this.state.profileData);
            delete prevProfileData[this.state.currentProfile];

            if (!(newProfileId in this.state.profileData)) {
                prevProfileData[newProfileId] = JSON.parse(localStorage.getItem(newProfileId)) || {};
            }

            localStorage.setItem("profileIndex", JSON.stringify(prevProfileIndex));
            localStorage.removeItem(this.state.currentProfile);
            this.setState({currentProfile: newProfileId, profileIndex: prevProfileIndex, profileData: prevProfileData});

        } else {
            // this is the only profile; we delete the current data,
            // but also create a fresh profile so we're never left
            // without any profile to work with
            let currProfile = this.state.currentProfile;
            let newProfile = uuidv4();
            let profData = {};
            let profileIndex = {};
            profileIndex[newProfile] = "Profile 1";
            profData[newProfile] = setProfileData({});

            localStorage.removeItem(currProfile);
            localStorage.setItem("profileIndex", JSON.stringify(profileIndex));
            localStorage.setItem(newProfile, JSON.stringify({}));

            this.setState({currentProfile: currProfile, profileIndex: profileIndex, profileData: profData});
        }
    }

    handleAddInventory(category) {
        let data_copy = cloneDeep(this.state.profileData);
        let data = data_copy[this.state.currentProfile];
        if (!(category in data)) {
            data[category] = setDefaultValues(cloneDeep(data_defaults[category]));
        }
        localStorage.setItem(this.state.currentProfile, JSON.stringify(data));
        this.setState({profileData: data_copy});
    }

    handleDeleteInventory(category) {
        let data_copy = cloneDeep(this.state.profileData);
        let data = data_copy[this.state.currentProfile];
        if (category in data) {
            delete data[category];
            localStorage.setItem(this.state.currentProfile, JSON.stringify(data));
            this.setState({profileData: data_copy});
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
        localStorage.setItem(this.state.currentProfile, JSON.stringify(data));
        this.setState({profileData: data_copy});
    }

    render() {
        return (
            <div className="app">
                <h2>RPG Merchant Inventory Generator</h2>

                <ProfileSection
                    profileIndex={this.state.profileIndex}
                    currentProfile={this.state.currentProfile}
                    changeProfile={this.handleProfileChange}
                    changeProfileTitle={this.handleProfileTitleChange}
                    deleteProfile={this.handleDeleteProfile}
                />
                <hr />

                <InventorySection
                    profileData={this.state.profileData[this.state.currentProfile]}
                    addInventory={this.handleAddInventory}
                    deleteInventory={this.handleDeleteInventory}
                    signalItemChange={this.handleItemChange}
                />

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