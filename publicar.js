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

  var dado = '';
  function lerBD(){
    //var tblUsers = document.getElementById('tbl_users_list');
    var databaseRef = firebase.database().ref('dados/esp/ultra/'); // falta atualizar
    //var rowIndex = 1;
  
    databaseRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    // "dados" é o local onde os valores são armazenados 
    dado = String(childData);
    console.log(dado);
   
   //var row = tblUsers.insertRow(rowIndex);
   //var cellId = row.insertCell(0);
   //var cellName = row.insertCell(1);
   //cellId.appendChild(document.createTextNode(childKey));
   //cellName.appendChild(document.createTextNode(childData.user_name));
   
   //rowIndex = rowIndex + 1;
    });
  });    
  }

  

function save_user(mensagem){
    var topico = mensagem;
    var data = {
     topico: topico
    }
    
    var updates = {};
    updates['/dados/' + topico] = data;
    firebase.database().ref().update(updates);
    
    //alert('The user is created successfully!');
    //reload_page();
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
    clientID = "esp04";
    //clientID = "clientID-" + parseInt(Math.random() * 100);

    // Fetch the hostname/IP address and port number from the form
    host = document.getElementById("host").value;
    port = document.getElementById("port").value;

    // Print output for the user in the messages div
    document.getElementById("messages").innerHTML += '<span>Connecting to: ' + host + ' on port: ' + port + '</span><br/>';
    document.getElementById("messages").innerHTML += '<span>Using the following client value: ' + clientID + '</span><br/>';

    
    //caso queira ler do banco de dados
    //lerBD();


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
    
    // Se quiser publicar dado pela interface
    mensagemPublicar = document.getElementById("mensagemPublicar").value;
   
    // Se quiser capturar dado do firebase e publicar dado
    //mensagemPublicar = dado;
    
    document.getElementById("messages").innerHTML += '<span>Subscribing to: ' + topic + ' e enviando a mensagem: '+ mensagemPublicar +'</span><br/>';

    publicarMensagem(mensagemPublicar, topic);  

    
    
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
    
    // COndição baseada na informação de outro canal
    //if (Number(message.payloadString) < 20) {
    //    publicarMensagem("pegou", "esp/ALGUMA_COISA");
    //}

    // é possivel tambem, salvar no firebase a mensagem que é enviada da interface para o esp
    //save_user(message.payloadString);
}


// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}
