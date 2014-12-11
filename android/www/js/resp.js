$url = "http://192.168.0.125/raspberry_app/server.php"

document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
	
	if(typeof $('.SSIDField').html() !== 'undefined'){
		$('.SSIDField').val(device.uuid);
	}
	
	$.ajax({
		url : $url,
		type : 'POST',
		timeout: 25000,
		data : {
			typeFunction : 'inicial',
			macAddress : device.uuid
		},
		success : function(data) {
			data = JSON.parse(data);
			if (data['status'] === 200) {
				$('.phoneRegisterDiv').hide();
				$('.coWorkerName p em').html(data['data']['name']);
				
				if(data['data']['registerIn'] !== '0'){
					$('.phoneIn').addClass('disabled');
					$('.phoneIn').parent().parent().parent().find('p').html('Entrada registrada - '+data['data']['registerIn']);
				}
				
				if(data['data']['registerOut'] !== '0'){
					$('.phoneOut').addClass('disabled');
					$('.phoneOut').parent().parent().parent().find('p').html('Salida registrada - '+data['data']['registerOut']);
				}
				
			} else {
				$('.coWorkerName').hide();
				$('.phoneRegisterDiv').show();
				
				$('.phoneIn').addClass('disabled');
				$('.phoneIn').parent().parent().parent().find('p').html('Evento no disponible');
				
				$('.phoneOut').addClass('disabled');
				$('.phoneOut').parent().parent().parent().find('p').html('Evento no disponible');
			}
			
			if(typeof $('.indexDiv').html() !== 'undefined'){
				var goOptions = setInterval(function(){
					window.location = "options.html";
					clearInterval(goOptions);
				},4000);
			}
		},
		error : function(data) {
			$('.indexMessage div').fadeOut(function(){
				$('.indexMessage .errorMessage').fadeIn().css('display','block');;
			});
		}
	});
}

$(document).ready(
		function() {	
			
			var today = new Date();
			$('.timeStamp').html(today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear() + ' - ' + today.getHours() + ':' + today.getMinutes());
			
			setInterval(function(){
				var today = new Date();
				$('.timeStamp').html(today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear() + ' - ' + today.getHours() + ':' + today.getMinutes());
			},60000);

			$('.phoneRegister').click(function() {
				window.location = "register.html";
			});
			
			$('.phoneIn').click(function() {
				if(!$('.phoneIn').hasClass('disabled')){
				if (confirm('Esta seguro que quiere registrar la entrada')) {		
						$('.app>div').css('display','block');
						$.ajax({
							url : $url,
							type : 'POST',
							timeout: 15000,
							data : {
								typeFunction : 'registerIn',
								macAddress : device.uuid
							},
							success : function(data) {
								data = JSON.parse(data);
								$('.app>div').css('display','none');
								if (data['status'] === 200) {
										$('.phoneIn').addClass('disabled');
										$('.phoneIn').parent().parent().parent().find('p').html('Entrada registrada - '+data['data']);							
								} else {
									$('.phoneIn').addClass('disabled');
									$('.phoneIn').parent().parent().parent().find('p').html('Evento no disponible');
								}
							},
							error : function(data) {
								window.location = "index.html";;
							}
						});
					}	
				} 							
			});

			$('.phoneOut').click(function() {
				if(!$('.phoneOut').hasClass('disabled')){
					if (confirm('Esta seguro que quiere registrar la salida')) {
					$('.app>div').css('display','block');
					$.ajax({
						url : $url,
						type : 'POST',
						timeout: 15000,
						data : {
							typeFunction : 'registerOut',
							macAddress : device.uuid
						},
						success : function(data) {
							data = JSON.parse(data);
							if (data['status'] === 200) {
								$('.app>div').css('display','none');
									$('.phoneOut').addClass('disabled');
									$('.phoneOut').parent().parent().parent().find('p').html('Salida registrada - '+data['data']);							
							} else {
								$('.phoneOut').addClass('disabled');
								$('.phoneOut').parent().parent().parent().find('p').html('Evento no disponible');
							}
						},
						error : function(data) {
							window.location = "index.html";;
						}
					});
				  }
				}
			});
			
			$('.helpAction').click(function(){
				window.location = "help.html";
			});
			
			$('.aboutAction').click(function(){
				window.location = "about.html";
			});
			
			$('.inicioAction').click(function(){
				window.location = "options.html";
			});
			
			$('.saveAction').click(function(){
				
				$('.registerDiv .errorMessage').css('display','none');
				$('.registerDiv input').removeClass('errorData');
				
				$('.registerDiv input').each(function(){
					if(this.value === ''){
						$(this).addClass('errorData');
						$('.registerDiv .errorMessage').html('Favor llenar todos los campos requeridos');
						$('.registerDiv .errorMessage').css('display','block');
					}else if($(this).hasClass('IdEmployee')){
						if(!validate(this.value)){
							$(this).addClass('errorData');
							$('.registerDiv .errorMessage').html('Favor llenar unicamente con números');
							$('.registerDiv .errorMessage').css('display','block');
						}
					}				
				});
				
				if(!$('.registerDiv input').hasClass('errorData')){
					$('.registerDiv div').css('display','block');
					$.ajax({
						url : $url,
						type : 'POST',
						timeout: 15000,
						data : {
							typeFunction : 'register',
							uuid : device.uuid,
							idEmployee: $('.IdEmployee').val(),
							nameEmployee: $('.nameEmployee').val()
						},
						success : function(data) {
							data = JSON.parse(data);
							if (data['status'] === 200) {
								$('.registerDiv div').css('display','none');
								$('.registerDiv .successMessage').css('display','block');
								var goOptions = setInterval(function(){
									window.location = "options.html";
									clearInterval(goOptions);
								},2000);
							} else {
								$('.registerDiv div').css('display','none');
								$('.registerDiv .errorMessage').html(data['data']);
								$('.registerDiv .errorMessage').css('display','block');
							}
						},
						error : function(data) {
							$('.registerDiv div').css('display','none');
							$('.registerDiv .errorMessage').html('Error de conexión, favor verificar su conectividad a Internet');
							$('.registerDiv .errorMessage').css('display','block');
						}
					});
				}
		   });
});

function validate(number){
	var regex=/^[0-9]+$/;
	if (number.match(regex))
		return true
	else
		return false
}
