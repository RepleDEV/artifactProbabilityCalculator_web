import React, { Component } from "react";

import get_character_list from "../modules/get_character_list";

type ElementType = "pyro" | "cryo" | "electro" | "geo" | "hydro" | "anemo" | "dendro";

class ElementSelects extends Component<{
	onClick?: (a?: ElementType) => void
}> {
	render() {
		const allElements: ElementType[] = ["pyro", "cryo", "electro", "geo", "hydro", "anemo", "dendro"];

		let elementSelectContainers: JSX.Element[] = [];

		for (let i = 0;i < allElements.length;i++) {
			elementSelectContainers.push(
				<div 
					className={`element-select ${allElements[i]}`}
					key={i}
					onClick={() => {
						this.props.onClick(allElements[i]);
					}}
				>

				</div>
			);
		}

		return (
			<div className="element-select-container">
					{...elementSelectContainers}
			</div>
		)
	}
}

export interface Character_Info {
	icon: string
	name: string
	rarity: number
	element: string
	weaponType: string
	region: string
}

class Character_Select_Button extends Component<{
	character_name?: string
	// onclick definition ?? is this
	onClick?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	img: string
}, {}> {
	render() {
		return (
			<div className="character-select-button" data-character-name={this.props.character_name} onClick={this.props.onClick}>
				<div className="icon">
					<img src={this.props.img}/>
				</div>
			</div>
		)
	}
}

class Character_Select_Buttons extends Component<{
	character_list: Character_Info[]
	onClick?: (c?: Character_Info) => void
	filterSelectedElement?: "" | ElementType
	filterSearch?: string
}> {
	render() {
		const res: JSX.Element[] = [];

		const { character_list } = this.props;
		for (let i = 0;i < character_list.length;i++) {
			const character = character_list[i];

			// Filter by element
			if (this.props.filterSelectedElement && (character.element.toLowerCase() !== this.props.filterSelectedElement)) {
				continue;
			}

			if (this.props.filterSearch && (!character.name.toLowerCase().includes(this.props.filterSearch.toLowerCase()))) {
				continue;
			}

			res.push(
				<Character_Select_Button 
				key={i}
				img={character.icon.substring(0, character.icon.indexOf("/revision"))} 
				onClick={() => {this.props.onClick(character)}}
				/>
			);
		}

		return res;
	}
}

export default class Page_Character extends Component<{
	nextPageHandler?: (c: Character_Info) => void
}, { 
	character_list: Character_Info[]
	elementSelected: "" | ElementType
	searchInputValue: string
}> {
	constructor(props) {
		super(props);

		this.state = {
			character_list: [],
			elementSelected: "",
			searchInputValue: ""
		}
	}

	componentDidMount() {
		get_character_list().then((character_list) => {
			this.setState({ character_list });
		});
	}

	_elementSelectsClickHandler(e?: ElementType) {
		if (this.state.elementSelected !== e) {
			this.setState({ elementSelected: e });
		} else {
			this.setState({ elementSelected: "" });
		}
	}

	render() {
		return (
			<div className="page character">
				<div className="top-bar">
					<div className="fill"></div>
					<span className="divider"></span>
					<ElementSelects onClick={(e) => {
						this._elementSelectsClickHandler(e)
					}}/>
					<span className="divider"></span>
					<div className="search-bar">
						<div className="inner-container">
							<input type="text" placeholder="Search" onChange={(e) => {
								const { value } = e.target;

								this.setState({ searchInputValue: value })
							}}/>
						</div>
					</div>
					<span className="divider"></span>
					<div className="dropdown-bar">
						<div className="inner-container dropdown-inner">
							<div className="dropdown-text">
								Mondstadt
							</div>
						</div>
					</div>
					<span className="divider"></span>
				</div>
				<div className="character-select-container">
					<Character_Select_Buttons 
						character_list={this.state.character_list} 
						onClick={this.props.nextPageHandler}
						filterSelectedElement={this.state.elementSelected}
						filterSearch={this.state.searchInputValue}
					/>
				</div>
			</div>
		)
	}
}