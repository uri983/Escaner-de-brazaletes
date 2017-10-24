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



    function submitLogin(){
        
            var datosUsuario = $("#correo").val();
            var datosPassword = $("#password").val(); 


           
            if(datosUsuario == "" || datosPassword == ""){

              myApp.alert('No dejes campos vacios','Error'); 

            }else{
                 
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
                        myApp.closeModal();
                    }else{
                        myApp.alert('Error en inicio de sesión','Error');                    
                    }                  
                    
                }) 

            }

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