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
	  , sendMessage
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

	sendMessage = function () {
		var $nickname   = $('input.js-nickname')
		  , $message    = $('input.js-message')
		  , messageData = {}
		  ;

		if ( $nickname.val() !== '' && $message.val() !== '' ) {

			messageData._id     = new Date().toISOString();
			messageData.author  = $nickname.val();
			messageData.message = { content: $message.val(), date: new Date() };

			db.put( messageData )
			.then( function ( result ) {

				$('p.js-status-message').text( 'Mensaje enviado!' );
			} )
			.catch( function ( error ) {

				console.log( 'Hubo un error', error, error.stack );
			} );
		} else {

			$('p.js-status-message').text( 'Hay campos vacios!' );
		}

	};

	$('button.js-submit-btn').on('click', sendMessage );

	db.allDocs( { include_docs: true } )
	.then( function ( result ) {

		parseMessages( result.rows );
	} )
	.catch( function ( error ) {

		console.log( 'Hubo un error', error, error.stack );
	} );
} );