import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import {
	identity,
} from 'lodash';

const startsWith = prefix => text =>
	text
		.toLowerCase()
		.startsWith( prefix );

export class TagInput extends Component {
	static propTypes = {
		onChange: PropTypes.func,
		onSelect: PropTypes.func,
		tabIndex: PropTypes.number,
		tagNames: PropTypes.arrayOf( PropTypes.string ).isRequired,
		value: PropTypes.string.isRequired,
	};

	static defaultProps = {
		onChange: identity,
		onSelect: identity,
	};

	constructor( props ) {
		super( props );

		this.state = {
			suggestions: [],
		};
	}

	getSuggestions = input => {
		const { tagNames } = this.props;

		return tagNames.filter( startsWith( input.trim().toLowerCase() ) );
	};

	onChange = ( event, { newValue } ) =>
		newValue.endsWith( ',' ) // commas should automatically insert the tag
			? this.onSuggestionSelected( null, { suggestionValue: newValue.slice( 0, -1 ) } )
			: this.props.onChange( newValue );

	onSuggestionSelected = ( event, { suggestionValue } ) => {
		this.setState( {
			suggestions: [],
		}, () => this.props.onSelect( suggestionValue ) );
	};

	onSuggestionsFetchRequested = ( { value } ) =>
		this.setState( { suggestions: this.getSuggestions( value ) } );

	onSuggestionsClearRequested = () =>
		this.setState( { suggestions: [] } );

	renderSuggestion = tag => <span>{ tag }</span>;

	render() {
		const {
			value,
			tabIndex,
		} = this.props;
		const { suggestions } = this.state;

		return (
			<div className="tag-input">
				<Autosuggest { ...{
					suggestions,
					focusFirstSuggestion: true,
					getSuggestionValue: identity,
					onSuggestionSelected: this.onSuggestionSelected,
					onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
					onSuggestionsClearRequested: this.onSuggestionsClearRequested,
					renderSuggestion: this.renderSuggestion,
					inputProps: {
						placeholder: 'Add tags…',
						onChange: this.onChange,
						tabIndex,
						value,
					},
				} } />
			</div>
		);
	}
}

export default TagInput;
