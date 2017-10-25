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
$$(document).on('deviceready', function() {


    if(checkConnection() == 0){
        toast('Sin conexión');
        $('#conexion').show();
    }
    if(localStorage.username != undefined ) {
       myApp.closeModal(); 
       $('#name').html(localStorage.usermail);
          
    }

    $('#login').click(function (event){       
            
        submitLogin();           

    });

    $("#logout").on('click',function (e) {
       localStorage.removeItem("username");
       localStorage.removeItem("usermail");
       myApp.loginScreen();
        
    })



});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
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
                saveCode($('#code').val(),time);
            }            
            $('#code').val('');
            $('#code').focus();               

        });


})


    function saveCode(code,date) {

        if(checkConnection() == 0){
        var db = sqlitePlugin.openDatabase({name: 'folio.db'});

        db.transaction(function (txn) {
          txn.executeSql('CREATE TABLE IF NOT EXISTS folio (folio INTEGER, fecha DATE)', [], function (tx, res) {
            //toast(res.rows.item(0).answer);
          });
        });

        db.transaction(function (txn) {
          txn.executeSql('INSERT INTO folio (folio,fecha) value('+ code +','+date+')', [], function (tx, res) {
            toast("Guardado sin conexion");
          });
        });

        db.transaction(function (txn) {
          txn.executeSql('select folio from folio', [], function (tx, res) {
            toast(res.rows.item(0).folio);
          });
        });

        }else{

        
        
        puerto = "";
        $.ajax({
                type: 'POST',
                url: 'http://servicios.apiqroo.com.mx/app_scanner/home/addFolios',
                data: {
                    "code":code,
                    "date":date,
                    "puerto": puerto                    
                    },
                    success: function(data) {   
                                         
                    //swal(data);
                    
                    if(data['action']== 2){
                        
                        console.log('Duplicado');
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
                    }else if(data['action']== 1){
                       
                        console.log('Correcto');
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
                       
                    }else if(data['action']== 3){
                        
                        console.log('Folio no vendido');
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
                    }else if(data['action']== 0){
                     
                      console.log('no existe');
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
                                
                                       
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                                //swal("Error en el guardado!");
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
                    type: 'POST',
                    url: "http://servicios.apiqroo.com.mx/app_scanner/home/verifyUser",
                    data: {"user":datosUsuario,'password':datosPassword},
                    async:true                
                })
                .done(function(data) {
                    if(data['existe'] == 1){
                        myApp.alert(data,'Error');
                        localStorage.username = data['user_id'];
                        localStorage.usermail = data['user']; 
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