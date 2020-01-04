import React from 'react';

import "./tabs.css";

class TabComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: false };
    }

    render() {
        return <button onClick={()=>this.props.onClick(this.props.index)} className={`${this.props.className} ${this.state.active? "active": ""}`}>
            { this.props.value }
        </button>;
    }
};

export class TabContext extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hidden: true };
    }

    render() {
        return <div className={`${this.props.className || ""} ${this.state.hidden? "hidden" : ""}`}>
            { this.props.children }
        </div>;
    }
}

export class TabContainer extends React.Component {
    constructor(props) {
        super(props);
        this.tab_click = this.tab_click.bind(this);
        this.state = { visiable_id: 0 };
        this.tabs = undefined;
        this.tabs_ref = undefined;
        this.contexts = undefined;
        this.contexts_ref = undefined;
    }

    tab_click(index) {
        this.tabs_ref[this.state.visiable_id].current.setState({ active: false });
        this.contexts_ref[this.state.visiable_id].current.setState({ hidden: true });
        this.setState({ visiable_id: index });
        this.tabs_ref[index].current.setState({ active: true });
        this.contexts_ref[index].current.setState({ hidden: false });
    }

    render() {
        if(this.tabs_ref === undefined) {
            var tabs = [];
            var tabs_ref = [];
            var contexts = [];
            var contexts_ref = [];
            let i = 0;
            for(var tab of this.props.tabs) {
                var ref = React.createRef();
                tabs_ref.push(ref);
                tabs.push(<TabComponent { ...tab } index={i} ref={ref} className="tab" onClick={this.tab_click.bind(this)} key={i}/>);
                ref = React.createRef();
                contexts_ref.push(ref);
                contexts.push(<TabContext key={i} className="tab-context" ref={ref}>{tab.context_item}</TabContext>);
                i += 1;
            }
            this.tabs = tabs;
            this.tabs_ref = tabs_ref;
            this.contexts = contexts;
            this.contexts_ref = contexts_ref;
        }
        return <div className="tab_root">
            <div className="tab-container">
            {this.tabs}
        </div>
            {this.contexts}
        </div>;
    }
}