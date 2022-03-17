import React, { useState } from "react";

export function CollapsingSection(props) {
    const [isCollapsed, setCollapsed] = useState(true);
    let clss = "section";
    let plus = "[−]";
    if (isCollapsed) {
        clss += " hidden";
        plus = "[+]";
    }
    return (
        <div className="collapsing_section">
            <div className="collapsing_header">
                <h3><a href="#" onClick={(e) => {
                e.preventDefault();
                if (isCollapsed === true) setCollapsed(false); else setCollapsed(true);
            }}>{plus} {props.title}</a></h3>
                <a href="#" className="section_delete delete_icon" title="Delete section">&times;</a>
            </div>
            <div className={clss}>
                {props.children}
            </div>
        </div>
    );
}

export class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showModal: false};
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen(e) {
        e.preventDefault();
        this.setState({showModal: true});
    }

    handleClose(e) {
        e.preventDefault();
        this.setState({showModal: false});
    }

    render() {
        let cls_backdrop = "modal_backdrop";
        let cls_inner = "modal";
        if (this.state.showModal === false) {
            cls_backdrop = " hidden";
            cls_inner += " hidden";
        }
        return (
            <div className="modal_container">
                <a href="#" onClick={this.handleOpen}>{this.props.linkText}</a>
                <div className={cls_backdrop} onClick={this.handleClose}>
                </div>
                <div className={cls_inner}>
                    <div className="modal_close"><a href="#" onClick={this.handleClose}>&times;</a></div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}