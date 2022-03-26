import React from "react";
import { GlobalDataContext } from "./global_data";

function ProfileSection(props) {
    return (
        <section className="profiles_section">
            <ProfileSelect />
            <ProfileTitle />
        </section>
    );
}

function ProfileSelect() {
    const [ global_state, dispatch ] = React.useContext(GlobalDataContext);

    let options = [];
    let profileIndex = global_state.profileIndex;
    for (var key in profileIndex) {
        if (profileIndex.hasOwnProperty(key)) {
            let title = profileIndex[key];
            if (title === "") {
                title = "(no title)";
            }
            options.push(<option value={key} key={key}>{title}</option>);
        }
    }

    return (
        <div>
            <label htmlFor="profiles">Profiles: </label>
            <select className="profiles" value={global_state.currentProfile} onChange={(e) => {
                let val = e.target.value;
                if (val === "") return false;
        
                if (val == "create_new") {
                    val = null;
                }
                dispatch({
                    "action": "change_profile",
                    "profile_id": val
                });
            }}>
                {options}
                <option value="create_new">Create new profile...</option>
            </select>
        </div>
    );
};

function ProfileTitle() {
    const [ global_state, dispatch ] = React.useContext(GlobalDataContext);

    let title = global_state.profileIndex[global_state.currentProfile];
    return (
        <div className="profile_title_container">
            <input type="text" className="profile_title" value={title} onChange={(e) => {
                let val = e.target.value;
                dispatch({
                    "action": "change_profile_title",
                    "new_title": val
                });
            }} />
            <a href="#" className="profile_delete delete_icon" title="Delete profile" onClick={(e) => {
                e.preventDefault();
                dispatch({
                    "action": "delete_profile"
                });
            }}>&times;</a>
        </div>
    );
};

export default ProfileSection;