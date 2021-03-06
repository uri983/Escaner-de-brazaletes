// Initialize app
var myApp = new Framework7({swipeBackPage:false,swipePanel:false});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
/*
  Metodo que se ejecuta al iniciar la aplicación
 */
$$(document).on('deviceready', function() {

     
 
     window.BackgroundService.start(
          function(fn) { sync_back(), fn && fn() },
          function() { console.log('err') }
      )

    if(checkConnection() == 0){
        toast('Sin conexión');
        $('#conexion').show();
    }
    if(localStorage.username != undefined ) {
       myApp.closeModal(); 
       $('#name').html(localStorage.usermail);
          
    }

    $("#puertos").val(localStorage.puerto);

    $('#login').click(function (event){       
            
        submitLogin();           

    });

    $("#puertos").change(function() {
       localStorage.puerto =  $("#puertos").val();     
    });

    $("#logout").on('click',function (e) {
       localStorage.removeItem("username");
       localStorage.removeItem("usermail");
       myApp.loginScreen();
        
    })



});



    /*
    Cuando carga la vista de datos por sincronizar
     */
    myApp.onPageInit('datos_local', function (page) {
            
            
            var db = window.openDatabase('local', '1.0', 'local', 2 * 1024 * 1024);            
            db.transaction(function (tx) {
               tx.executeSql('SELECT * FROM folio', [], function (tx, results) {
                  var len = results.rows.length, i;
                  
                    msg="";
                  for (i = 0; i < len; i++){
                     msg += '<tr><td class="numeric-cell">'+results.rows.item(i).folio+'</td><td class="numeric-cell">'+results.rows.item(i).fecha+'</td></tr>';
                      
                  }
                  $('#tabla_datos').html(msg);
                
               }, null);
            });

           

            $("#btn_sync").on('click',function (e) {
                var background_mode = false;               
                sync(background_mode);  
            })

    })

    /*
    Cuando carga la vista de capturas
     */
    myApp.onPageInit('captura', function (page) {
            $('#code').focus();
            $('#code').focusout(function(){
             $('#code').focus();
            });

            //$('.page').css('background-color','#e7e7e9');
            $('#code').change(function (e) { 
                var d = new Date($.now());
                var time = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                if($('#code').val() == ""){

                            
                }else{
                    alert_mode = true;
                    saveCode($('#code').val(),time,alert_mode);
                }            
                $('#code').val('');
                $('#code').focus();               

            });



    })

    /*
    Sincroniza la base de datos local con el servidor 
     */

    function sync(){
        if(checkConnection() == 0){
            
            myApp.alert('Esta funcion requiere conexión a internet','Error'); 
           
        }else{

        

        SpinnerPlugin.activityStart("Sincronizando..");

        

        var db = window.openDatabase('local', '1.0', 'local', 2 * 1024 * 1024); 

            db.transaction(function (tx) {
               tx.executeSql('SELECT * FROM folio', [], function (tx, results) {
                  var len = results.rows.length, i;
                  
                  alert_mode = false;
                  for (i = 0; i < len; i++){
                    // msg += '<tr><td class="numeric-cell">'+results.rows.item(i).folio+'</td><td class="numeric-cell">'+results.rows.item(i).fecha+'</td></tr>';
                    saveCode(results.rows.item(i).folio,results.rows.item(i).fecha,alert_mode); 
                    tx.executeSql('DELETE FROM folio WHERE id = ?', [results.rows.item(i).id]);

                  }
                  
                
               }, null);
            });

            db.transaction(function (tx) {
               tx.executeSql('SELECT * FROM folio', [], function (tx, results) {
                  var len = results.rows.length, i;
                  
                    msg="";
                  for (i = 0; i < len; i++){
                     msg += '<tr><td class="numeric-cell">'+results.rows.item(i).folio+'</td><td class="numeric-cell">'+results.rows.item(i).fecha+'</td></tr>';
                      
                  }
                  $('#tabla_datos').html(msg);
                
               }, null);
            });


        

        SpinnerPlugin.activityStop();
        
        myApp.alert('Sincronizado con éxito','Correcto');  
       
        

        }
    }


    /*
    Sincroniza la base de datos local con el servidor en tarea programada 
     */


    function sync_back(){
        if(checkConnection() == 0){
            
            //myApp.alert('Esta funcion requiere conexión a internet','Error'); 
           
        }else{

        

        //SpinnerPlugin.activityStart("Sincronizando..");

        

        var db = window.openDatabase('local', '1.0', 'local', 2 * 1024 * 1024); 

            db.transaction(function (tx) {
               tx.executeSql('SELECT * FROM folio', [], function (tx, results) {
                  var len = results.rows.length, i;
                  
                  alert_mode = false;
                  for (i = 0; i < len; i++){
                    // msg += '<tr><td class="numeric-cell">'+results.rows.item(i).folio+'</td><td class="numeric-cell">'+results.rows.item(i).fecha+'</td></tr>';
                    saveCode(results.rows.item(i).folio,results.rows.item(i).fecha,alert_mode); 
                    tx.executeSql('DELETE FROM folio WHERE id = ?', [results.rows.item(i).id]);

                  }
                  
                
               }, null);
            });

            db.transaction(function (tx) {
               tx.executeSql('SELECT * FROM folio', [], function (tx, results) {
                  var len = results.rows.length, i;
                  
                    msg="";
                  for (i = 0; i < len; i++){
                     msg += '<tr><td class="numeric-cell">'+results.rows.item(i).folio+'</td><td class="numeric-cell">'+results.rows.item(i).fecha+'</td></tr>';
                      
                  }
                  $('#tabla_datos').html(msg);
                
               }, null);
            });


        

       // SpinnerPlugin.activityStop();
        
        //myApp.alert('Sincronizado con éxito','Correcto');  
       //toast('Sincronizado');
        

        }
    }

    /*
    guarda la informacion de base de datos
     */
    function saveCode(code,date,alert_mode) {
        var options = { dimBackground: true };
        if(alert_mode == true){
        SpinnerPlugin.activityStart("Enviando..", options);
        }
        if(checkConnection() == 0){
        
        var db = window.openDatabase('local', '1.0', 'local', 2 * 1024 * 1024);

        db.transaction(function (tx) {  
           tx.executeSql('CREATE TABLE IF NOT EXISTS folio (id INTEGER PRIMARY KEY,folio INTEGER,fecha TEXT)');
           tx.executeSql('INSERT INTO folio (folio, fecha) VALUES (?,?)', [code, date]);
           
        });  

        if(alert_mode == true){      
        SpinnerPlugin.activityStop();
        toast('guardado sin conexion');       
        }

        }else{

        
        
        //puerto = localStorage.puerto;
        $.ajax({
                type: 'POST',
                url: 'http://servicios.apiqroo.com.mx/app_scanner/home/addFolios',
                data: {
                    "code":code,
                    "date":date,
                    "puerto": localStorage.puerto                    
                    },
                    success: function(data) {   
                     SpinnerPlugin.activityStop();                    
                    //swal(data);
                    
                    if(data['action']== 2){
                        
                        console.log('Duplicado');
                        navigator.notification.beep(1);
                        navigator.vibrate(1000);
                        if(alert_mode == true){
                        window.plugins.toast.showWithOptions(
                        {
                          message: "Folio Duplicado",
                          duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself. 
                          position: "center",
                          addPixelsY: -40,
                          styling: {
                              opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8 
                              backgroundColor: '#e33c3e', // make sure you use #RRGGBB. Default #333333 
                              textColor: '#FFFFFF', // Ditto. Default #FFFFFF 
                              textSize: 20.5, // Default is approx. 13. 
                              cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100 
                              horizontalPadding: 20, // iOS default 16, Android default 50 
                              verticalPadding: 16 // iOS default 12, Android default 30 
                            } 
                        } 
                        
                      );
                    }
                    }else if(data['action']== 1){
                        
                        console.log('Correcto');
                       
                        if(alert_mode == true){
                            navigator.notification.beep(1);
                             navigator.vibrate(500);
                      window.plugins.toast.showWithOptions(
                        {
                          message: "Registrado Correctamente",
                          duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself. 
                          position: "center",
                          addPixelsY: -40,  // added a negative value to move it up a bit (default 0) 
                          styling: {
                              opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8 
                              backgroundColor: '#69a582', // make sure you use #RRGGBB. Default #333333 
                              textColor: '#FFFFFF', // Ditto. Default #FFFFFF 
                              textSize: 20.5, // Default is approx. 13. 
                              cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100 
                              horizontalPadding: 20, // iOS default 16, Android default 50 
                              verticalPadding: 16 // iOS default 12, Android default 30 
                            } 
                        }
                        
                       
                      );
                      } 
                    }else if(data['action']== 3){
                        
                        console.log('Folio no vendido');
                        
                        if(alert_mode == true){
                            navigator.notification.beep(1);
                        navigator.vibrate(500);
                        window.plugins.toast.showWithOptions(
                        {
                          message: "Folio no vendido",
                          duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself. 
                          position: "center",
                          addPixelsY: -40,
                          styling: {
                              opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8 
                              backgroundColor: '#e33c3e', // make sure you use #RRGGBB. Default #333333 
                              textColor: '#FFFFFF', // Ditto. Default #FFFFFF 
                              textSize: 20.5, // Default is approx. 13. 
                              cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100 
                              horizontalPadding: 20, // iOS default 16, Android default 50 
                              verticalPadding: 16 // iOS default 12, Android default 30 
                            } 
                        }

                      );
                    }
                    }else if(data['action']== 0){
                     
                      console.log('no existe');

                      if(alert_mode == true){
                        navigator.notification.beep(1);
                        navigator.vibrate(500);
                        window.plugins.toast.showWithOptions(
                        {
                          message: "Folio no existente",
                          duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself. 
                          position: "center",
                          addPixelsY: -40,
                          styling: {
                              opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8 
                              backgroundColor: '#e33c3e', // make sure you use #RRGGBB. Default #333333 
                              textColor: '#FFFFFF', // Ditto. Default #FFFFFF 
                              textSize: 20.5, // Default is approx. 13. 
                              cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100 
                              horizontalPadding: 20, // iOS default 16, Android default 50 
                              verticalPadding: 16 // iOS default 12, Android default 30 
                            } 
                        } 
                      );
                    }
                    }
                                
                                       
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                      var db = window.openDatabase('local', '1.0', 'local', 2 * 1024 * 1024);
                      db.transaction(function (tx) {  
                         tx.executeSql('CREATE TABLE IF NOT EXISTS folio (id INTEGER PRIMARY KEY,folio INTEGER,fecha TEXT)');
                         tx.executeSql('INSERT INTO folio (folio, fecha) VALUES (?,?)', [code, date]);
                         
                      }); 

                      SpinnerPlugin.activityStop(); 
                    }
        }); 
        
        }
    }



    function submitLogin(){
        
            var datosUsuario = $("#correo").val();
            var datosPassword = $("#password").val(); 


           
            if(datosUsuario == "" || datosPassword == ""){

              myApp.alert('No dejes campos vacios','Error'); 

            }else{
                 var options = { dimBackground: true };
                SpinnerPlugin.activityStart("Cargando...", options);
                $.ajax({                
                    type: 'GET',
                    
                    url: "http://estadistica.apiqroo.com.mx/apis/login/",
                    data: {"login":datosUsuario,'password':datosPassword},
                    async:true                
                })
                .done(function(data) {
                  ///data = JSON.stringify(data);
                  //valor = data;
                  //var arr = Object.values(data);
                  
                  //console.log( data.indexOf("memo"));
                    if(data.indexOf("true") > 0){
                        myApp.alert(data,'Error');
                        localStorage.username = "user";
                        localStorage.usermail = "Bienvenido Usuario"; 
                        localStorage.puerto = "";
                        $('#name').html(localStorage.usermail);
                        myApp.closeModal();
                        SpinnerPlugin.activityStop();

                    }else{
                        SpinnerPlugin.activityStop(); 
                        myApp.alert('Error en inicio de sesión','Error');

                    }                  
                    
                }) 

            }

    }

    function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 0;

    return states[networkState];
    }



    function toast(message){
        window.plugins.toast.showWithOptions(
                        {
                          message: message,
                          duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself. 
                          position: "center",
                          addPixelsY: -40,
                          styling: {
                              opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8 
                              backgroundColor: '#e33c3e', // make sure you use #RRGGBB. Default #333333 
                              textColor: '#FFFFFF', // Ditto. Default #FFFFFF 
                              textSize: 20.5, // Default is approx. 13. 
                              cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100 
                              horizontalPadding: 20, // iOS default 16, Android default 50 
                              verticalPadding: 16 // iOS default 12, Android default 30 
                            } 
                        })
    }





// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})