import React from "react";

function ProfileSection(props) {
    return (
        <section className="profiles_section">
            <ProfileSelect
                options={props.profileIndex}
                selected={props.currentProfile}
                changeProfile={props.changeProfile}
            />
            <ProfileTitle
                title={props.profileIndex[props.currentProfile]}
                changeProfileTitle={props.changeProfileTitle}
            />
        </section>
    );
}


class ProfileSelect extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        let val = e.target.value;
        if (val === "") return false;

        if (val == "create_new") {
            this.props.changeProfile(null);
        } else {
            this.props.changeProfile(val);
        }
    }

    render() {
        let options = [];
        for (var key in this.props.options) {
            if (this.props.options.hasOwnProperty(key)) {
                let title = this.props.options[key];
                if (title === "") {
                    title = "(no title)";
                }
                options.push(<option value={key} key={key}>{title}</option>);
            }
        }

        return (
            <div>
                <label htmlFor="profiles">Profiles: </label>
                <select className="profiles" value={this.props.selected} onChange={this.handleChange}>
                    {options}
                    <option value="create_new">Create new profile...</option>
                </select>
            </div>
        );
    }
}

class ProfileTitle extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        let val = e.target.value;
        this.props.changeProfileTitle(val);
    }

    render() {
        return (
            <div className="profile_title_container">
                <input type="text" className="profile_title" value={this.props.title} onChange={this.handleChange} />
                <a href="#" className="profile_delete delete_icon" title="Delete profile">&times;</a>
            </div>
        );
    }
}

export default ProfileSection;