var db = new PouchDB( 'http://limajs.iriscouch.com/limajs-chat' );

// Empezamos jQuery
$( function () {

	var $messagesHolder = $('div.js-messages-holder')
	// fn declarations
	  , buildMessageHolder
	  , buildMessageAuthor
	  , buildMessageContent
	  , buildMessageDate
	  , parseMessages
	  , putDataInDB
	  , sendMessage
	  , showMessages
	  ;

	moment.locale('es-ES');

	buildMessageHolder = function ( value ) {
		var $messageHolder;

		$messageHolder = $('<div>')
		  .addClass( 'message-holder js-message-holder' )
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

		if ( value.doc.isACat ) {
			return $('<div>')
			  .addClass( 'message-part message-content' )
			  .append( $('<img>').prop('src', value.doc.message.content ) );
		} else {
			return $('<div>')
			  .addClass( 'message-part message-content' )
			  .text( value.doc.message.content );
		}

	};

	buildMessageDate = function ( value ) {

		return $('<div>')
		  .addClass( 'message-part message-date' )
		  .text( moment( value.doc.message.date ).fromNow() );
	};

	parseMessages = function ( messages ) {
		$messagesHolder.empty();
		messages.forEach( buildMessageHolder );
		$messagesHolder.scrollTop( $('div.js-messages-holder')[0].scrollHeight );
		$('input.js-cat-checkbox').prop('checked') && $('input.js-cat-checkbox').click();
		$messagesHolder.find( 'div.js-message' ).focus();
	};

	putDataInDB = function ( messageData, $message ) {
		db.put( messageData )
		.then( function ( result ) {

			$('p.js-status-message').text( 'Mensaje enviado!' );
			$message.val('');
		} )
		.catch( function ( error ) {

			console.log( 'Hubo un error', error, error.stack );
		} );
	};

	sendMessage = function ( e ) {
		var $nickname   = $('input.js-nickname')
		  , $message    = $('input.js-message')
		  , isACat      = $('input.js-cat-checkbox').prop('checked')
		  , messageData = {}
		  ;

		e.preventDefault();

		if ( isACat ) {
			$message.val( 'http://lorempixel.com/200/200/cats/' + Math.floor( Math.random() * 10 ) );
		}

		if ( $nickname.val() !== '' && $message.val() !== '' ) {

			messageData._id     = new Date().toISOString();
			messageData.author  = $nickname.val();
			messageData.message = { content: $message.val(), date: new Date() };

			if ( isACat ) {
				messageData.isACat = true;
			}

			putDataInDB( messageData, $message );

		} else {

			$('p.js-status-message').text( 'Hay campos vacios!' );
		}

	};

	showMessages = function () {

		db.allDocs( { include_docs: true } )
		.then( function ( result ) {

			parseMessages( result.rows );
		} )
		.catch( function ( error ) {

			console.log( 'Hubo un error', error, error.stack );
		} );
	};

	db.changes( { since : 'now'
	            , live  : true
	            } )
	.on('change', showMessages);

	showMessages();

	$('form.js-new-message-form').on('submit', sendMessage );


} );