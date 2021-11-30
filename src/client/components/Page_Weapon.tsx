import React, { Component } from "react";
import get_weapon_list from "../modules/get_weapon_list";

interface Weapon_Info {
	icon: string
	name: string
	base_attack: {
		min: number
		max: number
	}
	second_stat: {
		stat: string
		min: string
		max: string
	}
	type: string
}

class Weapon_Select_Button extends Component<{
	weapon_name?: string
	// onclick definition ?? is this
	onClick?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	img: string
}, {}> {
	render() {
		return (
			<div className="weapon-select-button" data-weapon-name={this.props.weapon_name} onClick={this.props.onClick}>
				<div className="icon">
					<img src={this.props.img}/>
				</div>
			</div>
		)
	}
}

class Weapon_Select_Buttons extends Component<{
	weapon_list: Weapon_Info[]
	weapon_type: string
	onClick?: (w?: Weapon_Info) => void
	filterSearch?: string
}> {
	render() {
		const res: JSX.Element[] = [];

		const { weapon_list, weapon_type, filterSearch } = this.props;
		for (let i = 0;i < weapon_list.length;i++) {
			const weapon = weapon_list[i];

			if (filterSearch && (!weapon.name.toLowerCase().includes(filterSearch.toLowerCase()))) {
				continue;
			}

			if (weapon.type !== weapon_type) {
				continue;
			}

			res.push(
				<Weapon_Select_Button 
				key={i}
				img={weapon.icon.substring(0, weapon.icon.indexOf("/revision"))} 
				onClick={() => {this.props.onClick(weapon)}}
				/>
			);
		}

		return res;
	}
}

export default class Page_Weapon extends Component<{
	weapon_type: string
	nextPageHandler?: (w: Weapon_Info) => void
}, {
	weapon_list: Weapon_Info[]
	searchInputValue: string
}> {
	constructor(props) {
		super(props);

		this.state = {
			weapon_list: [],
			searchInputValue: ""
		}
	}

	componentDidMount() {
		get_weapon_list().then((weapon_list) => {
			this.setState({ weapon_list });
		});
	}

	render() {
		return (
			<div className="page weapon">
				<div className="top-bar">
					<div className="fill"></div>
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
				</div>
				<div className="weapon-select-container">
					<Weapon_Select_Buttons
						weapon_list={this.state.weapon_list}
						weapon_type={this.props.weapon_type}
						filterSearch={this.state.searchInputValue}
						onClick={this.props.nextPageHandler}
					/>
				</div>
			</div>
		)
	}
}