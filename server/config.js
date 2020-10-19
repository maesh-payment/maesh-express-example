/**
 * config.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet)
 * and Thorsten Schaeff (@thorwebdev).
 */

'use strict';

// Load environment variables from the `.env` file.
require('dotenv').config();

module.exports = {

  // Server port.
  port: process.env.PORT || 5000,

  // Maesh testing API key
  api_key : process.env.MAESH_API_KEY
};
