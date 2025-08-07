var locked = false;
var memory;

// function to catch missing console on robot
// only usable if used on local browser
function logthis(message){
	try{
		console.log(message);
	} catch(err){}
}

// Callback touch event
function onTouchDown(data){
	logthis("touch down");
	if( !locked ){
	
		// recalculate data
		x = data[0] * $(document).width();
		y = data[1] * $(document).height();
	
		// get element
		locked = true;
		var el = document.elementFromPoint(x, y);
		
		if( el != null ){
			// create and sipatch event
			var ev = new MouseEvent('click', {
				'view': window,
				'bubbles': true,
				'cancelable': false
			});
			el.dispatchEvent(ev);
			
			// check if element or parent element is button
			if( el.tagName == 'BUTTON' ){
				logthis(el);
				memory.raiseEvent( "custom/tablet/onButtonClick", el.id );
			} else if( el.parentElement != null && el.parentElement.tagName == 'BUTTON' ){
				logthis(el.parentElement);
				memory.raiseEvent( "custom/tablet/onButtonClick", el.parentElement.id );
			}
		}
		
	}
}

function alOnClick(value){
	memory.raiseEvent( "custom/tablet/onButtonClick", value );
}

function onTouchUp(){
	locked = false;
}

// NAOqi connected
function onConnected(session){
	logthis("connected to naoqi");
	session.service("ALMemory").then( 
		function (service){
			memory = service;
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchDown", onTouchDown );
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchUp", onTouchUp );
			
			// set website alive interval
			setInterval( function(){
				memory.raiseEvent( "custom/tablet/alive", 1 );
			}, 1000 );
		},
		function (error) {}
	);
}

// NAOqi disconnected
function onDisconnected(){
	alert("Disconnected from NAOqi!");
}

// ------ MAIN ------
$( document ).ready(function() {
	logthis("document ready");

    // connect to naoqi
    // function will wait half a second after document is ready,
    // because connected sometimes fails if done without timeout.
    setTimeout( function(){
    	logthis("connecting to naoqi...");
		RobotUtils.connect( onConnected, onDisconnected );
	}, 500 );
});



