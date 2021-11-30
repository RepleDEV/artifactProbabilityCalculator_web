import React, { Component, useState } from "react"

const DEFAULT_PLACEHOLDER = "Dropdown Placeholder";

export default class Dropdown extends Component<{
	dropdown_contents?: string[]
	placeholder?: string
    disable?: boolean
	onChange: (prevValue: string, currValue: string) => void
}, {
    showDropdownContent: boolean
    currentValue: string
}> {
	constructor(props) {
		super(props)

        this.state = {
            showDropdownContent: false,
            currentValue: ""
        }
	}

    _handleChange(val: string) {
        // state.currentVale = old
        // val (param) = new
        this.props.onChange(this.state.currentValue, val);

        this.setState({ currentValue: val });
    }

    componentDidUpdate(prevProps, prevState) {
        // Check if value is still in contents
        if (this.state.currentValue !== DEFAULT_PLACEHOLDER && !this.props.dropdown_contents.includes(this.state.currentValue)) {
            this.setState({ currentValue: DEFAULT_PLACEHOLDER })
        }
    }
    
	render() {
		const { dropdown_contents, placeholder, disable } = this.props;
        const { showDropdownContent, currentValue } = this.state;

		let DropdownElements = [];

		for (let i = 0;i < dropdown_contents.length;i++) {
			const dropdown_content = dropdown_contents[i];

			DropdownElements.push(
				<span key={i} onClick={() => {
					// Toggle
					this.setState({ showDropdownContent: !showDropdownContent })

					this._handleChange(dropdown_content)
				}}>{dropdown_content}</span>
			)
		}

		const DropdownContent = (
			<div className={`dropdown-content ${showDropdownContent ? "show" : ""}`}>
				{DropdownElements}
			</div>
		);

		let buttonText = placeholder || DEFAULT_PLACEHOLDER;

		let disableButton = false;

		if (dropdown_contents.length == 1) {
			disableButton = true;
			buttonText = dropdown_contents[0]
		}

		return (
			<div className="dropdown">
				<button 
					className="dropbtn" 
					disabled={disable || disableButton}
					onClick= {
						() => {
							// Toggle
							this.setState({ showDropdownContent: !showDropdownContent })
						}
					}
				>{currentValue == "" ? buttonText : currentValue}</button>
				{DropdownContent}
			</div>
		)
	}
}