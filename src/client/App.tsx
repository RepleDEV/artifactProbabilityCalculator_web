import React, { Component } from "react";
import Page_Artifacts from "./components/Page_Artifacts";
// import Dropdown from "./components/Dropdown";

import Page_Character, { Character_Info } from "./components/Page_Character";
import Page_Weapon from "./components/Page_Weapon";

type ArtifactTypes = "flower" | "feather" | "sands" | "goblet" | "circlet";
const artifactTypes: ArtifactTypes[] = ["flower", "feather", "sands", "goblet", "circlet"];

async function getFromApi(path: string): Promise<any> {
	try {
		const res = await fetch(encodeURI(path));
		const resParse = await res.json();

		return resParse;
	} catch (error) {
		console.log(error)
	}
}



// const MainStatDropdown = (props: {
// 	mainStats?: string[]
// 	placeholder?: string
// 	onChange: (oldVal: string, newVal: string) => void
// }) => {
// 	return (
// 		<div className="main-stat-dropdown">
// 			<Dropdown 
// 				dropdown_contents={props.mainStats} 
// 				placeholder={props.placeholder}
// 				onChange={props.onChange}
// 			/>
// 		</div>
// 	)
// }

// type SubStatData = [string, string, string, string];

// class SubStatSelector extends Component<{
// 	sub_stats: string[]
// 	onChange: (o: SubStatData, n: SubStatData) => void
// 	disable?: boolean
// }, {
// 	selectedSubStats: SubStatData
// }> {
// 	constructor(props) {
// 		super(props)

// 		this.state = {
// 			selectedSubStats: ["", "", "", ""]
// 		}
// 	}

// 	_handleChange(oldVal: string, newVal: string, i: number) {
// 		let newSSS = [...this.state.selectedSubStats] as SubStatData;

// 		newSSS[i] = newVal;

// 		this.props.onChange(this.state.selectedSubStats, newSSS);
// 		this.setState({ selectedSubStats: newSSS });
// 	}

// 	_getContents(i: number): string[] {
// 		const filter = [...this.state.selectedSubStats];

// 		filter.splice(i, 1);

// 		return this.props.sub_stats.filter((x) => filter.indexOf(x) == -1);
// 	}

// 	render() {
// 		const PLACEHOLDER = "Select Sub Stat";

// 		let Dropdowns = [];

// 		for (let i = 0;i < 4;i++) {
// 			const contents = this._getContents(i);

// 			Dropdowns.push(
// 				// If contents has no length, disable button
// 				// (also check if disable property is true to override it :smile:)
// 				<Dropdown key={i} disable={ this.props.disable ? this.props.disable : (contents.length ? false : true) } placeholder={PLACEHOLDER} dropdown_contents={contents} onChange={(o, n) => {
// 					this._handleChange(o, n, i)
// 				}}/>
// 			)
// 		}

// 		return (
// 			<div className="sub-stat-selector">
// 				{ Dropdowns }
// 			</div>
// 		)
// 	}
// }


// type ArtifactTypeData = {
// 	mainStat?: string,
// 	subStat?: SubStatData
// }
// class ArtifactTypeSelector extends Component<{
// 	type: ArtifactTypes,
// 	onChange: (o: ArtifactTypeData, n: ArtifactTypeData) => void
// }, {
// 	mainStats: string[]
// 	subStats: string[]
// 	currentMainStat: string
// }> {
// 	constructor(props) {
// 		super(props)

// 		this.state = {
// 			mainStats: [],
// 			subStats: [],
// 			currentMainStat: ""
// 		}
// 	}

// 	componentDidUpdate(prevProps, prevState) {
// 		const prevMainStat = prevState.currentMainStat as string;
// 		const currMainStat = this.state.currentMainStat;

// 		// If main_stat state is updated (selected a main stat)
// 		if (prevMainStat !== currMainStat) {
// 			this.props.onChange({ mainStat: prevMainStat }, { mainStat: currMainStat })

// 			if (
// 				// Check if props.type isn't either "feather" or "flower"
// 				(!["flower", "feather"].includes(this.props.type)) &&
// 				// Both states doesn't include a DMG Bonus% in it
// 				!(prevMainStat.includes("DMG Bonus%") && currMainStat.includes("DMG Bonus%"))
// 			) {
// 				// Update sub stats
// 				getFromApi(`./api/get/sub_stats?type=${this.props.type}&main_stat=${currMainStat}`).then((val) => {
// 					this.setState({ subStats: val });
// 				});
// 			}
// 		}
// 	}
	
// 	componentDidMount() {
// 		const { props } = this;

// 		getFromApi(`./api/get/main_stats?type=${props.type}`).then((val) => {
// 			this.setState({ mainStats: val })
// 		});

// 		if (
// 			this.props.type === "flower" ||
// 			this.props.type === "feather"
// 		) {
// 			getFromApi(`./api/get/sub_stats?type=${props.type}`).then((val) => {
// 				this.setState({ subStats: val })
// 			});
// 		}
// 	}

// 	render() {
// 		const { props, state } = this;
// 		const { mainStats, subStats } = state

// 		return (
// 			<div className="artifact-type-selector-container">
// 				<MainStatDropdown placeholder="Select Main Stat" mainStats={mainStats} onChange={(oldVal, newVal) => {
// 					this.setState({ currentMainStat: newVal })
// 				}}/>
// 				<SubStatSelector disable={(props.type == "flower" || props.type == "feather") ? false : undefined} sub_stats={subStats}
// 					onChange={(o, n) => {
// 						if (o !== n) {
// 							this.props.onChange({ subStat: o }, { subStat: n })
// 						}
// 					}}
// 				/>
// 			</div>
// 		)
// 	}
// }

// type ArtifactData = {
// 	[artifactType in ArtifactTypes]?: {
// 		mainStat: string
// 		subStats: [string, string, string, string]
// 	}
// }

// const ArtifactSelector = () => {
// 	const [data, setData] = useState<ArtifactData>({})

// 	const artifactTypeSelectors = [];

// 	for (let i = 0;i < artifactTypes.length;i++) {
// 		const artifactType = artifactTypes[i] as ArtifactTypes;

// 		artifactTypeSelectors.push(
// 			<ArtifactTypeSelector type={artifactType} onChange={((o, n) => {
// 				const newData = data;

// 				if (o.mainStat) {
// 					newData[artifactType]["mainStat"] = n.mainStat;
// 				} else if (o.subStat) {
// 					newData[artifactType]["subStat"] = n.subStat;
// 				}

// 				setData(newData);
// 			})}/>
// 		)
// 	}

// 	return (
// 		<div className="artifact-selector-container">
// 			<ArtifactTypeSelector type="flower"/>
// 			<ArtifactTypeSelector type="feather"/>
// 			<ArtifactTypeSelector type="sands"/>
// 			<ArtifactTypeSelector type="goblet"/>
// 			<ArtifactTypeSelector type="circlet"/>
// 		</div>
// 	)
// }

class LeftNavBar extends Component {
	render() {
		return (
			<div className="left-nav-bar">
				<div className="nav-bar-content">
					<span className="text active">
						Character
					</span>
					<span className="line active"></span>
					<span className="text disabled">
						Weapon
					</span>
					<span className="line"></span>
					<span className="text disabled">
						Artifacts
					</span>
					<span className="line"></span>
					<span className="text disabled">
						Full Stats
					</span>
					<span className="line"></span>
				</div>
			</div>
		)
	}
}

class MainContent extends Component<{}, {
	pageIndex: number
	nextPageData: {
		character_info: Character_Info | { [key: string]: any }
	}
}> {
	constructor(props) {
		super(props);

		this.state = {
			pageIndex: 2,
			nextPageData: {
				character_info: {}
			}
		}
	}
	render() {
		const pages = [
			<Page_Character nextPageHandler={(c) => { 
				let newNextPageData = this.state.nextPageData;
				newNextPageData.character_info = c;
				this.setState({ pageIndex: 1, nextPageData: newNextPageData });
			}}/>,
			<Page_Weapon 
				weapon_type={this.state.nextPageData.character_info.weaponType || ""}
				nextPageHandler={() => {
					this.setState({ pageIndex: 2 });
				}}
			/>,
			<Page_Artifacts nextPageHandler={(aD) => {
				console.log(aD);
				// this.setState({ pageIndex: 3 });
			}}/>
		]

		return (
			<div className="main-content">
				{pages[this.state.pageIndex]}
			</div>
		)
	}
}

export default function App() {
	return (
		<div id="main">
			<LeftNavBar />
			<div className="divider"></div>
			<MainContent />
		</div>
	)
}