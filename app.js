var db = new PouchDB( 'http://limajs.iriscouch.com/limajs-chat' );

// Empezamos jQuery
$( function () {

	var $messageHolder = $('div.js-messages-holder')
	  , parseMessages
	  ;

	parseMessages = function ( messages ) {

		$.each( messages, function ( index, value ) {

			$('<div>')
			  .addClass('message')
			  .text( value.doc.message.content )
			  .appendTo( $messageHolder );
		} );
	};

	db.allDocs( { include_docs: true }, function ( err, result ) {

		parseMessages( result.rows );
	} );
} );