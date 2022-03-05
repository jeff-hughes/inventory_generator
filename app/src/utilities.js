import React, { useState } from "react";

export function CollapsingSection(props) {
    const [isCollapsed, setCollapsed] = useState(false);
    let clss = "section";
    let plus = "[-]";
    if (isCollapsed) {
        clss += " hidden";
        plus = "[+]";
    }
    return (
        <div className="collapsing_section">
            <div><a href="#" onClick={() => {
                if (isCollapsed === true) setCollapsed(false); else setCollapsed(true);
            }}>{plus}</a> {props.title}</div>
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
        let cls_outer = "modal_outer";
        let cls_inner = "modal_inner";
        if (this.state.showModal === false) {
            cls_outer = " hidden";
            cls_inner += " hidden";
        }
        return (
            <div className="modal_container">
                <a href="#" onClick={this.handleOpen}>{this.props.linkText}</a>
                <div className={cls_outer} onClick={this.handleClose}>
                    <div className={cls_inner}>
                        <div className="modal_close"><a href="#" onClick={this.handleClose}>&times;</a></div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}