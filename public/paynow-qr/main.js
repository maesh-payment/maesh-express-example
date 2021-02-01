
$('#generate-qr').on('click', function(){
	$('#show-qr').hide();
	$('#status').hide();
	var amount = $('.amount').val();
	$.post(request_url + "/fetch-qr",
{
  amount: amount
},
function(data,status){
	$('#show-qr').show();
	$("#qr-code").attr("src",data['qr']);
	$('#payment_id').val(data['payment_id']);
	$('#amount').val(data['param_two']);

});
});

$('#complete-payment').on('click', function(){
	var id = $('#payment_id').val();
	$.post(request_url + "/complete-payment",
{
  payment_id: id,
  param_two: $('#amount').val()
},
function(data,status){
	$('#status').show();
	$('#status').text('Payment completion:' + data);

});
});