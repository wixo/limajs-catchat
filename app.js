var db = new PouchDB( 'http://limajs.iriscouch.com/limajs-chat' );

// Empezamos jQuery
$( function () {

	var $messagesHolder = $('div.js-messages-holder')
	// fn declarations
	  , parseMessages
	  , buildMessageHolder
	  , buildMessageAuthor
	  , buildMessageContent
	  , buildMessageDate
	  ;

	moment.locale('es-ES');

	buildMessageHolder = function ( value ) {
		var $messageHolder;

		$messageHolder = $('<div>')
		  .addClass( 'message-holder' )
		  .appendTo( $messagesHolder );

		buildMessageAuthor( value ).appendTo( $messageHolder );
		buildMessageContent( value ).appendTo( $messageHolder );
		buildMessageDate( value ).appendTo( $messageHolder );
	};

	buildMessageAuthor = function ( value ) {

		return $('<div>')
		  .addClass( 'message-part message-author' )
		  .text( value.doc.author );
	};

	buildMessageContent = function ( value ) {

		return $('<div>')
		  .addClass( 'message-part message-content' )
		  .text( value.doc.message.content );
	};

	buildMessageDate = function ( value ) {

		return $('<div>')
		  .addClass( 'message-part message-date' )
		  .text( moment( value.doc.message.date ).fromNow() );
	};

	parseMessages = function ( messages ) {

		messages.forEach( buildMessageHolder );
	};

	db.allDocs( { include_docs: true } )
	.then( function ( result ) {

		parseMessages( result.rows );
	} )
	.catch( function ( error ) {

		console.log( 'Hubo un error', error, error.stack );
	} );
} );