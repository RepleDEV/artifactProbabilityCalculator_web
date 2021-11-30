import React, { Component } from "react";

async function getSubStats(mainStat: string): Promise<any> {
    const res = await fetch(`./api/get/sub_stats?main_stat=${mainStat}`);
    return res.json();
}

class Artifact_Substat_Select extends Component<{
    subStats: string[]
    onClick?: (s: string) => void
}, {
    selectedSubstat: string
}> {
    constructor(props) {
        super(props);

        this.state = {
            selectedSubstat: ""
        }
    }

    _dropdownClickHandler(s: string) {
        this.setState({ selectedSubstat: s });
    }

    render() {
        return (
            <div className="sub-stat-container">
                {/* If selected substat doesn't exist (no length) add empty class */}
                <span className={this.state.selectedSubstat.length ? "" : "empty"}>{this.state.selectedSubstat}</span>
                <div className="dropdown-content">
                    {...this.props.subStats.filter((v) => v != this.state.selectedSubstat).map((v, i) => <span key={i} onClick={() => this._dropdownClickHandler(v)}>v</span>)}
                </div>
            </div>
        )
    }
}

class Artifact_Substat_Selects extends Component<{
    subStats: string[]
}, {
    selectedArtifacts: [string, string, string, string, string]
}> {
    constructor(props) {
        super(props);

        this.state = {
            selectedArtifacts: ["", "", "", "", ""]
        }
    }
    render() {
        let elements: JSX.Element[] = [];

        for (let i = 0;i < 5;i++) {
            elements.push(<Artifact_Substat_Select key={i} subStats={[]}/>)
            if (i !== 4) {
                elements.push(<span key={-(i + 1)} className="divider" />);
            }
        }

        return <>{...elements}</>
    }
}

class Artifact_Select extends Component<{
    artifactType: string
    mainStats: string[]
}, {
    toggleMainStatDropdown: boolean
    mainStat: string
    subStats: string[]
    flipMainStatsDropdown: boolean
}> {
    dropdownElement: HTMLDivElement;

    constructor(props) {
        super(props);

        // ????
        this._mainStatClickHandler = this._mainStatClickHandler.bind(this);

        this.state = {
            toggleMainStatDropdown: false,
            mainStat: "",
            subStats: [],
            flipMainStatsDropdown: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.toggleMainStatDropdown && this.state.toggleMainStatDropdown) {
            const height = this.dropdownElement.clientHeight;
            const vHeight = document.documentElement.clientHeight;
            const fromBottom = vHeight - this.dropdownElement.getBoundingClientRect().bottom;


            console.log(height, fromBottom)

            this.setState({ flipMainStatsDropdown: fromBottom < height })
        }
    }

    _mainStatClickHandler() {
        if (this.props.mainStats.length) {
            this.setState({ toggleMainStatDropdown: !this.state.toggleMainStatDropdown });
        }
    }

    render() {
        return (
            <div className="artifact-select">
                <div className="artifact-type-container">
                    <span className="artifact-type">{this.props.artifactType}</span>
                </div>
                <div className="inner-artifact-select-container">
                    <div className="main-stat-container">
                        <div className="inner-main-stat-container">
                            <span className="tiny-text">main stat</span>
                            <span className={`main-stat ${this.state.mainStat ? "" : "empty"}`} onClick={this._mainStatClickHandler}> {this.state.mainStat}</span>
                        </div>
                        <div className={`dropdown-content ${this.state.flipMainStatsDropdown ? "flip" : ""} ${this.state.toggleMainStatDropdown ? "visible" : ""}`}
                            ref={(dropdownElement) => { this.dropdownElement = dropdownElement }}
                        >
                            {...this.props.mainStats.map((v, i) => (<span key={i}>{v}</span>))}
                        </div>
                    </div>
                    <div className="fill">
                        <div className="horizontal-divider"></div>
                    </div>
                    <Artifact_Substat_Selects subStats={this.state.subStats}/>
                </div>
            </div>
        )
    }
}

const allArtifactTypes = ["Flower of Life", "Plume of Death", "Sands of Time", "Goblet of Eonothem", "Circlet of Logos"]
const allArtifactTypesId = ["Flower", "Feather", "Sands", "Goblet", "Circlet"];

async function getMainStats(artifactType: string): Promise<any> {
    const res = await fetch(`./api/get/main_stats?type=${artifactType.toLowerCase()}`);
    return res.json();
}

const mapMainStats = (m: string) => {
    if (m === "Elemental Mastery")return "EM";
    if (m === "Energy Recharge%")return "ER%";
    if (m.includes("DMG Bonus%"))return m.split(" ")[0] + "%";
    return m;
};

export default class Page_Artifacts extends Component<{

}, {
    mainStats: string[][]
}> {
    constructor(props) {
        super(props);

        this.state = {
            mainStats: new Array(5).fill([])
        }
    }

    componentDidMount() {
        for (let i = 0;i < allArtifactTypesId.length;i++) {
            const artifactTypeId = allArtifactTypesId[i];

            getMainStats(artifactTypeId.toLowerCase()).then((x) => {
                let newMainStats = this.state.mainStats;
                newMainStats[i] = x.map(mapMainStats);

                this.setState({ mainStats: newMainStats })
            });
        }
    }

    render() {
        const allArtifactSelects: JSX.Element[] = [];

        for (let i = 0;i< allArtifactTypes.length;i++) {
            const artifactType = allArtifactTypes[i];

            allArtifactSelects.push(<Artifact_Select key={i} artifactType={artifactType} mainStats={this.state.mainStats[i]}/>)
        }

        return (
            <div className="page artifact">
                <div className="artifact-select-container">
                    {...allArtifactSelects}
                </div>
            </div>
        )   
    }
}