// SendEmail.js

import React from "react";
import emailjs from "emailjs-com";

// Threshold values for temperature and humidity
const THRESHOLD_TEMP = 40;  // Temperature threshold
const THRESHOLD_HUMIDITY = 80;  // Humidity threshold

const SendEmail = ({ temperature, humidity }) => {
  // Function to send email via EmailJS
  const sendEmail = () => {
    const templateParams = {
      to_name: "Recipient Name", // Replace with actual name
      temperature: temperature,
      humidity: humidity,
    };

    emailjs
      .send(
        "service_xgrpt12", // Your Service ID
        "template_qihs4wj", // Your Template ID
        templateParams
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response.status, response.text);
        },
        (error) => {
          console.error("Failed to send email:", error);
        }
      );
  };

  // Check if temperature or humidity exceeds threshold and send email
  if (temperature > THRESHOLD_TEMP || humidity > THRESHOLD_HUMIDITY) {
    sendEmail();
  }

  return null; // Since this component is only used to trigger the email, we don't need to render anything
};

export default SendEmail;
