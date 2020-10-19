function getOrderData(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const reference = urlParams.get('reference');
    const xhttp = new XMLHttpRequest();
    const url = 'https://maesh-node-backend.herokuapp.com/orders/' + reference;

    xhttp.open("GET", url, false);
    xhttp.send();

    console.log(xhttp.responseText);
    const order = JSON.parse(xhttp.responseText);

    return order;
}

function apiKey() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", 'https://maesh-node-backend.herokuapp.com/api-key', false);
    xhttp.send();

    const key = JSON.parse(xhttp.responseText);

    return key;
}

const order_data = getOrderData();

const maeshObj = {
    api_key : apiKey(),
    dom_element_id : 'maesh',
    currency: 'SGD',
    amount: order_data["amount"]*100,
    gotoUrl: 'https://maesh-node-backend.herokuapp.com/redirect',
    referenceCode: order_data["reference_code"]
}


const maesh = Maesh();
maesh.create(maeshObj);



// payment Tabs
$(".cards .card").click(function () { // Add active class to active link
    $(this).addClass("active").siblings().removeClass("active"); // Hide all divs on click
    $(".action > div").hide(); //show div
    $('.' + $(this).data("class")).show();
    //$('.action').slideUp();
    //$('.action').delay(0).slideDown();
    //$('.action').stop();
});

// hide show edit card
$('.editcardForm').on('click', function () {
    if ($('.editCard').hasClass('hide')) {
        $('.editCard').removeClass('hide').addClass('show');
    } else {
        $('.editCard').addClass('hide').removeClass('show');
    }
});