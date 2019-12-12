var firebaseConfig = {
    apiKey: "AIzaSyBZPBnjX2eU5Mc5zIM5xR-JWkYEIxU38v8",
    authDomain: "smarthome-54122.firebaseapp.com",
    databaseURL: "https://smarthome-54122.firebaseio.com",
    projectId: "smarthome-54122",
    storageBucket: "smarthome-54122.appspot.com",
    messagingSenderId: "357568198491",
    appId: "1:357568198491:web:e377755b2710e8550a0c7e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var contador = 0;  
  
function save_user(topicoBD,mensagem,cont){
	
    var data = {
     dado: mensagem
    }
    
    var updates = {};
    updates['/dados/' + topicoBD+'/'+cont] = data;
    firebase.database().ref().update(updates);
    
    //alert('The user is created successfully!');
    //reload_page();
}


function update_user(){
    var user_name = document.getElementById('user_name').value;
    var user_id = document.getElementById('user_id').value;
 
    var data = {
     user_id: user_id,
     user_name: user_name
    }
    
    var updates = {};
    updates['/users/' + user_id] = data;
    firebase.database().ref().update(updates);
    
    alert('The user is updated successfully!');
    
    reload_page();
   }
   
   function delete_user(){
    var user_id = document.getElementById('user_id').value;
   
    firebase.database().ref().child('/users/' + user_id).remove();
    alert('The user is deleted successfully!');
    reload_page();
   }
   
   function reload_page(){
    window.location.reload();
   }




function publicarMensagem(mensagem, topico){
    client.subscribe(topico);
        message = new Paho.MQTT.Message(mensagem);
        message.destinationName = topico;
        client.send(message);
}


// Called after form input is processed
function startConnect() {
    
    // Generate a random client ID
    clientID = "esp02";
    //clientID = "clientID-" + parseInt(Math.random() * 100);

    // Fetch the hostname/IP address and port number from the form
    host = document.getElementById("host").value;
    port = document.getElementById("port").value;

    // Print output for the user in the messages div
    document.getElementById("messages").innerHTML += '<span>Connecting to: ' + host + ' on port: ' + port + '</span><br/>';
    document.getElementById("messages").innerHTML += '<span>Using the following client value: ' + clientID + '</span><br/>';

    // Initialize new Paho client connection
    client = new Paho.MQTT.Client(host, Number(port), clientID);

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({ 
        onSuccess: onConnect,
    });
}

// Called when the client connects
function onConnect() {
    // Fetch the MQTT topic from the form
    topic = document.getElementById("topic").value;

    // Print output for the user in the messages div
    document.getElementById("messages").innerHTML += '<span>Subscribing to: ' + topic + '</span><br/>';

    // Subscribe to the requested topic
    client.subscribe(topic);


    //client.subscribe(topic);
    //message = new Paho.MQTT.Message("EAE");
    //message.destinationName = topic;
    //client.send(message);


}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    document.getElementById("messages").innerHTML += '<span>ERROR: Connection lost</span><br/>';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML += '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
    }
}

// Called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived: " + message.payloadString);
    document.getElementById("messages").innerHTML += '<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>';
    
    //if (Number(message.payloadString) < 20) {
    //    publicarMensagem("pegou", "esp/ALGUMA_COISA");
    //}
    contador = contador + 1;
    save_user(topic, message.payloadString,contador);
}


// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}
