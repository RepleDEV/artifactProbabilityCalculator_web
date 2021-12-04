import React, { Component, ReactEventHandler } from "react";
import _ from "lodash";

async function getSubStats(type: string, mainStat?: string): Promise<any> {
    let m = mainStat;
    if (m === "ER%")m = "Energy Recharge%";
    else if (m.includes("DMG Bonus%"))m = "Elm_Phys_Bonus";

    const res = await fetch(encodeURI(`./api/get/sub_stats?type=${type}&main_stat=${m}`));
    return res.json();
}

class Artifact_Substat_Select extends Component<{
    subStats: string[]
    onClick?: (s: string) => void
    onInputChange?: (sval: number) => void
}, {
    selectedSubstat: string
    toggleDropdown: boolean
}> {
    subStatElement: HTMLSpanElement;
    subStatDropDownElement: HTMLDivElement;

    constructor(props) {
        super(props);

        this._dropdownClickHandler = this._dropdownClickHandler.bind(this);
        this._subStatClickHandler = this._subStatClickHandler.bind(this);
        this._inputChangeHandler = this._inputChangeHandler.bind(this);
        this._handleClickOutside = this._handleClickOutside.bind(this);

        this.state = {
            selectedSubstat: "",
            toggleDropdown: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // If toggled open
        if (!prevState.toggleDropdown && this.state.toggleDropdown) {
            document.addEventListener("mousedown", (this._handleClickOutside));
        }
        // Closed
        else if (prevState.toggleDropdown && !this.state.toggleDropdown) {
            document.removeEventListener("mousedown", this._handleClickOutside);
        }
    }

    _dropdownClickHandler(s: string) {
        this.setState({ selectedSubstat: s });
        this.setState({ toggleDropdown: false });
        
        this.props.onClick(s);
    }

    _subStatClickHandler() {
        this.setState({ toggleDropdown: !this.state.toggleDropdown });
    }

    _inputChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const { value } = e.target;

        this.props.onInputChange(+value);
    }

    _handleClickOutside(event) {
        if (this.subStatDropDownElement && this.subStatElement &&
            !this.subStatDropDownElement.contains(event.target) && !this.subStatElement.contains(event.target)
        ) {
            this.setState({ toggleDropdown: false });
        }
    }

    render() {
        return (
            <div className="sub-stat-container">
                {/* If selected substat doesn't exist (no length) add empty class */}
                <span 
                    className={this.state.selectedSubstat.length ? "" : "empty"} 
                    onClick={this._subStatClickHandler}
                    ref={(subStatElement) => {this.subStatElement = subStatElement}}
                >{this.state.selectedSubstat}</span>
                <span className="divider"></span>
                <input type="number" onChange={this._inputChangeHandler}/>
                <div 
                    className={`dropdown-content ${this.state.toggleDropdown ? "visible" : ""}`}
                    ref={(subStatDropDownElement) => {this.subStatDropDownElement = subStatDropDownElement}}
                >
                    {...this.props.subStats.filter((v) => v != this.state.selectedSubstat).map((v, i) => <span key={v} onClick={() => this._dropdownClickHandler(v)}>{v}</span>)}
                </div>
            </div>
        )
    }
}

class Artifact_Substat_Selects extends Component<{
    subStats: string[]
    onChange?: (s: [string, string, string, string], sval: [number, number, number, number]) => void
}, {
    selectedSubstats: [string, string, string, string]
    subStatInputs: [number, number, number, number];
}> {
    constructor(props) {
        super(props);

        this._onClickHandler = this._onClickHandler.bind(this);
        this._onInputChangeHandler = this._onInputChangeHandler.bind(this);
        this._onChangeHandler = this._onChangeHandler.bind(this);

        this.state = {
            selectedSubstats: ["", "", "", ""],
            subStatInputs: [0, 0, 0, 0]
        }
    }

    _onClickHandler(i: number, s: string) {
        let newSelectedSubstats = this.state.selectedSubstats;
        newSelectedSubstats[i] = s;

        this.setState({ selectedSubstats: newSelectedSubstats });
        this._onChangeHandler();
    }

    _onInputChangeHandler(sval: number, i: number) {
        let newSval = this.state.subStatInputs;
        newSval[i] = sval;
        this.setState({ subStatInputs: newSval });
        // Possible one liner: this.setState({ subStatInputs: this.state.subStatInputs.map((v, j) => i == j ? sval : v});
        // But no, too long and performance is prob bad (O(n))
        // But doesn't use mem though (i think)
        this._onChangeHandler();
    }

    _onChangeHandler() {
        this.props.onChange(this.state.selectedSubstats, this.state.subStatInputs);
    }

    render() {
        let elements: JSX.Element[] = [];

        for (let i = 0;i < 4;i++) {
            elements.push(
                <Artifact_Substat_Select key={i} 
                    subStats={this.props.subStats.filter((v) => !this.state.selectedSubstats.filter((n, n_i) => n_i != i).includes(v))}
                    onClick={(s) => {this._onClickHandler(i, s)}}
                    onInputChange={(sval) => this._onInputChangeHandler(sval, i)}
                />
            );
            if (i !== 3) {
                elements.push(<span key={-(i + 1)} className="divider" />);
            }
        }

        return <>{...elements}</>
    }
}

class Artifact_Select extends Component<{
    artifactType: string
    artifactTypeId: string
    mainStats: string[]
    onChange?: (m: string, mval: number, s?: [string, string, string, string], sval?: [number, number, number, number]) => void
}, {
    toggleMainStatDropdown: boolean
    mainStat: string
    subStats: string[]
    flipMainStatsDropdown: boolean
    mainStatInputValue: string
}> {
    dropdownElement: HTMLDivElement;
    mainStatElement: HTMLSpanElement;

    constructor(props) {
        super(props);

        // ????
        this._handleClickOutside = this._handleClickOutside.bind(this);
        this._mainStatClickHandler = this._mainStatClickHandler.bind(this);
        this._setSubStats = this._setSubStats.bind(this);
        this._handleInputOnChange = this._handleInputOnChange.bind(this);
        this._handleSubStatChange = this._handleSubStatChange.bind(this);

        this.state = {
            toggleMainStatDropdown: false,
            mainStat: "",
            subStats: [],
            flipMainStatsDropdown: false,
            mainStatInputValue: ""
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // ! these 2 ifs *MIGHT* cause errors with state changes n whatever

        // If dropdown is toggled open
        if (!prevState.toggleMainStatDropdown && this.state.toggleMainStatDropdown) {
            const height = this.dropdownElement.clientHeight;
            const vHeight = document.documentElement.clientHeight;
            const fromBottom = vHeight - this.dropdownElement.getBoundingClientRect().bottom;

            // Set flipped
            this.setState({ flipMainStatsDropdown: fromBottom < height });

            document.addEventListener("mousedown", (this._handleClickOutside));
        }

        // If dropdown is toggled close
        if (prevState.toggleMainStatDropdown && !this.state.toggleMainStatDropdown) {
            document.removeEventListener("mousedown", this._handleClickOutside);
        }

        // If main stats turns out to only have 1 item
        if (prevProps.mainStats.length === 0 && this.props.mainStats.length === 1) {
            this.setState({ mainStat: this.props.mainStats[0] });

            this._setSubStats(this.props.artifactTypeId, this.props.mainStats[0]);
        }

        // if mainStats array isn't length of 1 AND mainStat state has change
        if (
            (prevState.mainStat !== this.state.mainStat) ||
            // or the mainStatInputValue state changed
            (prevState.mainStatInputValue !== this.state.mainStatInputValue)
            ) {
            this.props.onChange(this.state.mainStat, +this.state.mainStatInputValue);
        }
    }

    _handleClickOutside(event) {
        if (this.dropdownElement && this.mainStatElement && !this.dropdownElement.contains(event.target) && !this.mainStatElement.contains(event.target)) {
            this.setState({ toggleMainStatDropdown: false });
        }
    }

    _mainStatClickHandler() {
        if (this.props.mainStats.length && this.props.mainStats.length !== 1) {
            this.setState({ toggleMainStatDropdown: !this.state.toggleMainStatDropdown });
        }
    }

    _setSubStats(t: string, m: string) {
        // Get substats
        getSubStats(t, m).then((s) => {
            this.setState({ subStats: s.map(mapStats) });
        });
    }

    _mainStatDropdownClickHandler(m: string) {
        this.setState({ mainStat: mapStats(m) });
        this.setState({ toggleMainStatDropdown: false });

        this._setSubStats(this.props.artifactTypeId, m);
    }

    _handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { value } = e.target;

        this.setState({ mainStatInputValue: value });
    }

    _handleSubStatChange(s: [string, string, string, string], sval: [number, number, number, number]) {
        this.props.onChange(this.state.mainStat, +this.state.mainStatInputValue, s, sval)
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
                            <span ref={(mainStatElement) => { this.mainStatElement = mainStatElement }} className={`main-stat ${this.state.mainStat ? "" : "empty"}`} onClick={this._mainStatClickHandler}>{this.state.mainStat}</span>
                            <input type="number" onChange={this._handleInputOnChange}/>
                        </div>
                        <div className={`dropdown-content ${this.state.flipMainStatsDropdown ? "flip" : ""} ${this.state.toggleMainStatDropdown ? "visible" : ""}`}
                            ref={(dropdownElement) => { this.dropdownElement = dropdownElement }}
                        >
                            {...this.props.mainStats.map((v, i) => (<span key={v} onClick={() => this._mainStatDropdownClickHandler(v)} >{mapStats(v)}</span>))}
                        </div>
                    </div>
                    <div className="fill">
                        <div className="horizontal-divider"></div>
                    </div>
                    <Artifact_Substat_Selects subStats={this.state.subStats} onChange={this._handleSubStatChange}/>
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

const mapStats = (m: string) => {
    if (m === "Elemental Mastery")return "EM";
    if (m === "Energy Recharge%")return "ER%";
    if (m.includes("DMG Bonus%") || m.includes("Healing"))return m.split(" ")[0] + "%";
    return m;
};

interface ArtifactData {
    // selectedMainStats: string[]
    // selectedMainStatValues: number[]
    // selectedSubStats: string[][]
    // selectedSubStatValues: number[][]
    [key: string]: {
        selectedMainStat: string
        selectedMainStatValue: number
        selectedSubStats: string[]
        selectedSubStatValues: number[]
    }
}

export default class Page_Artifacts extends Component<{
    nextPageHandler?: (artifactData: ArtifactData) => void
}, {
    mainStats: string[][]
    selectedMainStats: string[]
    selectedMainStatValues: number[]
    selectedSubStats: string[][]
    selectedSubStatValues: number[][]
}> {
    constructor(props) {
        super(props);

        this._artifactSelectChangeHandler = this._artifactSelectChangeHandler.bind(this);
        this._nextButtonHandler = this._nextButtonHandler.bind(this);

        this.state = {
            mainStats: new Array(5).fill([]),
            selectedMainStats: new Array(5).fill(""),
            selectedMainStatValues: new Array(5).fill(0),
            selectedSubStats: new Array(5).fill([]),
            selectedSubStatValues: new Array(5).fill([])
        }
    }

    componentDidMount() {
        for (let i = 0;i < allArtifactTypesId.length;i++) {
            const artifactTypeId = allArtifactTypesId[i];

            getMainStats(artifactTypeId.toLowerCase()).then((x) => {
                let newMainStats = this.state.mainStats;
                newMainStats[i] = x;

                this.setState({ mainStats: newMainStats })
            });
        }
    }

    _artifactSelectChangeHandler(i: number, m: string, mval: number, s?: [string, string, string, string], sval?: [number, number, number, number]) {
        let newSelectedSubStats = this.state.selectedSubStats;
        let newSelectedSubStatValues = this.state.selectedSubStatValues;

        // If s is not undefined
        if (s !== undefined && sval !== undefined) {
            newSelectedSubStats[i] = s;
            newSelectedSubStatValues[i] = sval;
        }

        let newSelectedMainStats = this.state.selectedMainStats;
        newSelectedMainStats[i] = m;
        let newSelectedMainStatValues = this.state.selectedMainStatValues;
        newSelectedMainStatValues[i] = mval;

        this.setState({
            selectedMainStats: newSelectedMainStats,
            selectedMainStatValues: newSelectedMainStatValues,
            selectedSubStats: newSelectedSubStats,
            selectedSubStatValues: newSelectedSubStatValues
        });
    }

    _nextButtonHandler() {
        const artifactData: ArtifactData = {};

        const { 
            selectedMainStats,
            selectedMainStatValues,
            selectedSubStats,
            selectedSubStatValues
        } = this.state;

        for (let i = 0;i < allArtifactTypesId.length;i++) {
            const artifactTypeId = allArtifactTypesId[i].toLowerCase();

            artifactData[artifactTypeId] = {
                selectedMainStat: selectedMainStats[i],
                selectedMainStatValue: selectedMainStatValues[i],
                selectedSubStats: selectedSubStats[i],
                selectedSubStatValues: selectedSubStatValues[i]
            }
        }

        this.props.nextPageHandler(artifactData);
    }

    render() {
        const allArtifactSelects: JSX.Element[] = [];

        for (let i = 0;i< allArtifactTypes.length;i++) {
            const artifactType = allArtifactTypes[i];
            const artifactTypeId = allArtifactTypesId[i].toLowerCase();

            allArtifactSelects.push(
                <Artifact_Select 
                    key={artifactTypeId} 
                    artifactType={artifactType} 
                    artifactTypeId={artifactTypeId} 
                    mainStats={this.state.mainStats[i]}
                    onChange={(...args) => this._artifactSelectChangeHandler(i, ...args)}
                />
            )
        }

        return (
            <div className="page artifact">
                <div className="artifact-select-container">
                    {...allArtifactSelects}
                </div>
                <div className="next-button-container">
                    <button className="next-button" onClick={this._nextButtonHandler}>Next</button>
                </div>
            </div>
        )   
    }
}