import React, { PropTypes } from 'react';
import {
	ContentState,
	Editor,
	EditorState,
	Modifier,
} from 'draft-js';
import {
	attempt,
	invoke,
	isError,
	matchesProperty,
	noop,
	property,
} from 'lodash';

import { parse } from './note-parser';

function plainTextContent( editorState ) {
	return editorState.getCurrentContent().getPlainText( '\n' )
}

function indentCurrentBlock( editorState ) {
	const selection = editorState.getSelection();
	const selectionStart = selection.getStartOffset();

	const content = editorState.getCurrentContent();
	const block = content.getBlockForKey( selection.getFocusKey() );
	const line = block.getText();

	const atStart = line.trim() === '-' || line.trim() === '*';
	const offset = atStart ? 0 : selectionStart;

	// add tab
	const afterInsert = EditorState.push(
		editorState,
		Modifier.replaceText(
			content,
			selection.isCollapsed()
				? selection.merge( {
					anchorOffset: offset,
					focusOffset: offset,
				} )
				: selection,
			'\t'
		),
		'insert-characters'
	);

	// move selection to where it was
	return EditorState.forceSelection(
		afterInsert,
		afterInsert.getSelection().merge( {
			anchorOffset: selectionStart + 1, // +1 because 1 char was added
			focusOffset: selectionStart + 1,
		} )
	);
}

function outdentCurrentBlock( editorState ) {
	const selection = editorState.getSelection();
	const selectionStart = selection.getStartOffset();

	const content = editorState.getCurrentContent();
	const block = content.getBlockForKey( selection.getFocusKey() );
	const line = block.getText();

	const atStart = line.trim() === '-' || line.trim() === '*';
	const rangeStart = atStart ? 0 : selectionStart - 1;
	const rangeEnd = atStart ? 1 : selectionStart;
	const prevChar = block.getText().slice( rangeStart, rangeEnd );

	// there's no indentation to remove
	if ( prevChar !== '\t' ) {
		return editorState
	}

	// remove tab
	const afterRemove = EditorState.push(
		editorState,
		Modifier.removeRange(
			content,
			selection.merge( {
				anchorOffset: rangeStart,
				focusOffset: rangeEnd,
			} )
		),
		'remove-range'
	);

	// move selection to where it was
	return EditorState.forceSelection(
		afterRemove,
		selection.merge( {
			anchorOffset: selectionStart - 1, // -1 because 1 char was removed
			focusOffset: selectionStart - 1,
		} )
	);
}

function urlParser( contentBlock, callback ) {
	const content = contentBlock.getText();
	const parsed = attempt( parse, content );

	if ( isError( parsed ) ) {
		return;
	}

	parsed
		.filter( matchesProperty( 'type', 'link' ) )
		.map( property( 'href.location' ) )
		.forEach( ( { start, end } ) => callback( start.offset, end.offset ) );
}

const addMissingScheme = url =>
	/^[a-zA-Z0-9\-\.]+:\/\//.test( url )
		? url
		: `http://${ url }`;

const openLink = event => {
	const { metaKey } = event;

	if ( ! metaKey ) {
		return;
	}

	const anchor = event.target.parentNode.parentNode;
	const url = anchor.href;

	window.open( url, '_blank' );
};

const DecoratedLink = ( { decoratedText: url, children } ) =>
	<a href={ addMissingScheme( url ) } onClick={ openLink }>{ children }</a>;

const urlDecorator = new CompositeDecorator( [ {
	strategy: urlParser,
	component: DecoratedLink,
} ] );

export default class NoteContentEditor extends React.Component {
	static propTypes = {
		content: PropTypes.string.isRequired,
		onChangeContent: PropTypes.func.isRequired
	}

	state = {
		editorState: EditorState.createWithContent(
			ContentState.createFromText( this.props.content, '\n' ),
			urlDecorator,
		)
	}

	saveEditorRef = ( ref ) => {
		this.editor = ref
	}

	handleEditorStateChange = ( editorState ) => {
		if ( editorState === this.state.editorState ) {
			return
		}

		const nextContent = plainTextContent( editorState );
		const prevContent = plainTextContent( this.state.editorState );

		const announceChanges = nextContent !== prevContent
			? () => this.props.onChangeContent( nextContent )
			: noop;

		this.setState( { editorState }, announceChanges );
	}

	componentWillReceiveProps( { content: newContent } ) {
		const { content: oldContent } = this.props;
		const { editorState: oldEditorState } = this.state;

		if ( newContent === oldContent ) {
			return; // identical to previous `content` prop
		}

		if ( newContent === plainTextContent( oldEditorState ) ) {
			return; // identical to rendered content
		}

		let newEditorState = EditorState.createWithContent(
			ContentState.createFromText( newContent, '\n' ),
			urlDecorator
		)

		// avoids weird caret position if content is changed
		// while the editor had focus, see
		// https://github.com/facebook/draft-js/issues/410#issuecomment-223408160
		if ( oldEditorState.getSelection().getHasFocus() ) {
			newEditorState = EditorState.moveFocusToEnd( newEditorState )
		}

		this.setState( { editorState: newEditorState } );
	}

	focus = () => {
		invoke( this, 'editor.focus' );
	}

	onTab = ( e ) => {
		const { editorState } = this.state;

		// prevent moving focus to next input
		e.preventDefault()

		if ( ! editorState.getSelection().isCollapsed() && e.shiftKey ) {
			return
		}

		if ( e.altKey || e.ctrlKey || e.metaKey ) {
			return
		}

		this.handleEditorStateChange(
			e.shiftKey
				? outdentCurrentBlock( editorState )
				: indentCurrentBlock( editorState )
		)
	}

	render() {
		return (
			<Editor
				ref={this.saveEditorRef}
				spellCheck
				stripPastedStyles
				onChange={this.handleEditorStateChange}
				editorState={this.state.editorState}
				onTab={this.onTab}
			/>
		);
	}
}
