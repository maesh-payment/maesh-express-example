/**
 * app.js
 * Maesh Express Example. Created by Aditya Gannavarapu (https://github.com/aditya-67)
 */


// create an express app
const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./config');
const fs = require('fs');
const crypto = require('crypto');
const makeRequest = require('./rapyd_utils').makeRequest;

// use the express-static middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use(express.static("public"));

let products = [
    {
      "id": 1,
      "sku": "DEMO001",
      "name": "This Pretty Plant",
      "description": "Look at this pretty plant. Photo by Galina N on Unsplash.",
      "image": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&h=600&q=80",
      "amount": 1000,
      "currency": "SGD",
      "quantity": 20
    },
    {
      "id": 2,
      "sku": "DEMO002",
      "name": "Adventure Mug",
      "description": "We’re going on an adventure! Photo by Annie Spratt on Unsplash.",
      "image": "https://images.unsplash.com/photo-1454329001438-1752daa90420?auto=format&fit=crop&w=600&h=600&q=80",
      "amount": 1500,
      "currency": "SGD",
      "quantity": 20
    }
  ];

let orders = [];

// define the first route
app.get("/", function (req, res) {
  res.send("Hello from Maesh.")
})

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/api-key', (req, res) => {
    res.json(config.api_key);
});

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.get('/orders/:id', (req, res) => {
  let order = orders.find(o => o.reference_code === req.params.id);
  res.json(order);
})

app.post('/order-details', (req, res) => {
    reference_code = Math.random().toString(36).substring(5).toUpperCase();
    let order = req.body;
    order["payment"] = "Unpaid";
    order["status"] = "Pending";
    order["reference_code"] = reference_code;
    order["payment_method"] = '';
    orders.push(order);
    var redirect_url = '/payment?reference='+reference_code
    res.redirect(redirect_url);
});

app.post('/place-order', (req, res) => {
    let body = req.body;
    let order = orders.find(o => o.reference_code === body["reference_code"]);
    order["payment"] = "Paid";
    order["status"] = "Success";
    order["payment_method"] = "Cash on Delivery";
    let product = products.find(p => p.sku === order.sku);
    product["quantity"] -= order["quantity"];
    var redirect_url = '/redirect?reference='+body["reference_code"];
    res.redirect(redirect_url);
});

app.post('/rapyd-pay', async (req, res) => {
    let body = req.body;
    try {
    const body = {
      amount: 821,
      complete_checkout_url: 'http://example.com/redirect',
      country: 'SG',
      currency: 'SGD',
      merchant_reference_id: '950ae8c6-79',
    };
    const result = await makeRequest('POST', '/v1/checkout', body);
    console.log(result);
    res.redirect(result['body']['data']['redirect_url']);
  } catch (error) {
    console.error('Error completing request', error);
  }
});

app.post('/fetch-qr', async (req, res) => {
    let request_body = req.body;
    try {
    const body = {
      amount: parseInt(request_body['amount']),
      currency: 'SGD',
      payment_method: {
        type: 'sg_paynow_bank'
      }
    };
    const result = await makeRequest('POST', '/v1/payments', body);
    var data = {'qr' : result['body']['data']['visual_codes']['PayNow QR'], 'payment_id' : result['body']['data']['id'], 'param_two': result['body']['data']['original_amount']}
    res.send(data);
  } catch (error) {
    console.error('Error completing request', error);
  }
});

app.post('/complete-payment', async (req, res) => {
    let request_body = req.body;
    try {
    const body = {
      token: request_body['payment_id'],
      param2: request_body['param_two']
    };
    const result = await makeRequest('POST', '/v1/payments/completePayment', body);
    res.send(result['body']['status']['status']);
  } catch (error) {
    console.error('Error completing request', error);
  }
});

// start the server listening for requests
app.listen(config.port || 3000, 
  () => console.log("Server is running..."));