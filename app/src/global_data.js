import React from "react";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from 'uuid';

const data_defaults = {
    "armor": require("./data/armor.json"),
    "weapons": require("./data/weapons.json"),
    "adv_gear": require("./data/adventuring_gear.json"),
    "tools": require("./data/tools.json")
};

const allCategories = {
    "armor": "Armor",
    "weapons": "Weapons",
    "adv_gear": "Adventuring Gear",
    "tools": "Tools"
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

function createInitialState() {
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
    let profileKeys = Object.keys(profData);
    for (let i in profileKeys) {
        let key = profileKeys[i];
        profData[key] = setProfileData(profData[key]);
    }
    let state = {
        allCategories: allCategories,
        profileIndex: profileIndex,
        currentProfile: currProfile,
        profileData: profData
    };
    console.log(state);
    return state;
}


// The reducer is the main engine for changing the primary data elements
// of the app; it handles any modifications to profiles, or to inventory
// sections or items (i.e., profile data). As such, it's a bit...complex.
// The reducer always takes an object as input, and requires the "action"
// key to be set to indicate the action type to perform. Some actions
// also require additional data:
// reducer({"action": "change_profile", "profile_id": Optional[str]})
// reducer({"action": "change_profile_title", "new_title": str})
// reducer({"action": "delete_profile"})
// reducer({"action": "add_inventory", "category": str})
// reducer({"action": "delete_inventory", "category": str})
// reducer({"action": "change_item", "item_id": str, "new_state": obj})
const reducer = (state, action) => {
    let new_state = state;
    switch (action.action) {
        // CHANGE PROFILE -----------------------------------------------
        case "change_profile": {
            new_state = cloneDeep(state);
            if (action.profile_id !== null && action.profile_id in state.profileIndex) {
                // change to existing profile
                if (!(action.profile_id in new_state.profileData)) {
                    new_state.profileData[action.profile_id] = JSON.parse(localStorage.getItem(action.profile_id)) || {};
                }
                new_state.currentProfile = action.profile_id;
            } else {
                // create new profile
                let num = Object.keys(new_state.profileIndex).length + 1;
                let new_id = uuidv4();
                let profile_name = "Profile " + num;
    
                new_state.profileIndex[new_id] = profile_name
                new_state.profileData[new_id] = setProfileData({});
                new_state.currentProfile = new_id;
    
                localStorage.setItem("profileIndex", JSON.stringify(new_state.profileIndex));
                localStorage.setItem(new_id, JSON.stringify({}));
            }
            break;
        }

        // CHANGE PROFILE TITLE -----------------------------------------
        case "change_profile_title": {
            let profileIndex = cloneDeep(state.profileIndex);
            profileIndex[state.currentProfile] = action.new_title;
            localStorage.setItem("profileIndex", JSON.stringify(profileIndex));
            new_state = {...state, profileIndex: profileIndex};
            break;
        }

        // DELETE PROFILE -----------------------------------------------
        case "delete_profile": {
            let profileIds = Object.keys(state.profileIndex);
            let profileNum = profileIds.indexOf(state.currentProfile);
            new_state = cloneDeep(state);

            if (profileIds.length > 1) {
                let newProfileId;
                if (profileNum > 0) {
                    // jump to previous profile in the list, whatever it is
                    newProfileId = profileIds[profileNum - 1];
                } else {
                    // jump to next profile instead
                    newProfileId = profileIds[profileNum + 1];
                }

                let profileIndex = cloneDeep(state.profileIndex);
                delete profileIndex[state.currentProfile];
                let profileData = cloneDeep(state.profileData);
                delete profileData[state.currentProfile];

                if (!(newProfileId in state.profileData)) {
                    profileData[newProfileId] = JSON.parse(localStorage.getItem(newProfileId)) || {};
                }

                localStorage.setItem("profileIndex", JSON.stringify(profileIndex));
                localStorage.removeItem(state.currentProfile);

                new_state.currentProfile = newProfileId;
                new_state.profileIndex = profileIndex;
                new_state.profileData = profileData;

            } else {
                // this is the only profile; we delete the current data,
                // but also create a fresh profile so we're never left
                // without any profile to work with
                let currProfile = state.currentProfile;
                let profileData = {};
                let profileIndex = {};
                profileIndex[currProfile] = "Profile 1";
                profileData[currProfile] = setProfileData({});

                localStorage.setItem("profileIndex", JSON.stringify(profileIndex));
                localStorage.setItem(currProfile, JSON.stringify({}));

                new_state.profileIndex = profileIndex;
                new_state.profileData = profileData;
            }
            break;
        }

        // ADD INVENTORY ------------------------------------------------
        case "add_inventory": {
            let data_copy = cloneDeep(state.profileData);
            let data = data_copy[state.currentProfile];
            if (!(action.category in data)) {
                data[action.category] = setDefaultValues(cloneDeep(data_defaults[action.category]));
            }
            localStorage.setItem(state.currentProfile, JSON.stringify(data));
            new_state = {...state, profileData: data_copy};
            break;
        }

        // DELETE INVENTORY ---------------------------------------------
        case "delete_inventory": {
            let data_copy = cloneDeep(state.profileData);
            let data = data_copy[state.currentProfile];
            if (action.category in data) {
                delete data[action.category];
                localStorage.setItem(state.currentProfile, JSON.stringify(data));
                new_state = {...state, profileData: data_copy};
            }
            break;
        }

        // CHANGE ITEM --------------------------------------------------
        case "change_item": {
            let addr_split = action.item_id.split("|");
            let data_copy = cloneDeep(state.profileData);
            let data = data_copy[state.currentProfile];
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
                let newKeys = Object.keys(action.new_state);
                newKeys.forEach(key => {
                    data[key] = action.new_state[key];
                });
            }
            localStorage.setItem(state.currentProfile, JSON.stringify(data));
            new_state = {...state, profileData: data_copy};
            break;
        }
    }
    console.log(new_state);
    return new_state;
};


export const GlobalDataContext = React.createContext({
    state: {},
    dispatch: () => null
});

export const GlobalDataProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, createInitialState());

    return (
        <GlobalDataContext.Provider value={[state, dispatch]}>
    	    { children }
        </GlobalDataContext.Provider>
    );
};