import React from "react";

class ProfileSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                profile1: "Profile 1",
                profile2: "Test profile"
            },
            selected: "profile1"
        };

        this.addNewProfile = this.addNewProfile.bind(this);
        this.changeProfile = this.changeProfile.bind(this);
        this.changeProfileTitle = this.changeProfileTitle.bind(this);
    }

    addNewProfile() {
        let options = this.state.options;
        let num = Object.keys(this.state.options).length + 1;
        let new_id = "profile" + num;
        let profile_name = "Profile " + num;
        options[new_id] = profile_name;
        this.setState({options: options, selected: new_id});
    }

    changeProfile(profile_id) {
        if (profile_id in this.state.options) {
            this.setState({selected: profile_id});
        }
    }

    changeProfileTitle(new_title) {
        let options = this.state.options;
        options[this.state.selected] = new_title;
        this.setState({options: options});
    }

    render() {
        return (
            <section className="profiles_section">
                <ProfileSelect
                    options={this.state.options}
                    selected={this.state.selected}
                    addNewProfile={this.addNewProfile}
                    changeProfile={this.changeProfile}
                />
                <ProfileTitle
                    title={this.state.options[this.state.selected]}
                    changeProfileTitle={this.changeProfileTitle}
                />
            </section>
        );
    }
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
            this.props.addNewProfile();
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
                <label for="profiles">Profiles: </label>
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
            <div>
                <input type="text" className="profile_title" value={this.props.title} onChange={this.handleChange} />
            </div>
        );
    }
}

export default ProfileSection;