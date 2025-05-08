// utils/autoReplyGenerator.js
function generateAutoReply(message) {
    const msg = message.toLowerCase();
  
    if (msg.includes("payment")) {
      return "Thank you for your message. Our team will assist you with your payment issue shortly.";
    } else if (msg.includes("login") || msg.includes("access")) {
      return "We noticed you're having login issues. Please try resetting your password or contact support.";
    } else if (msg.includes("delay") || msg.includes("delivery")) {
      return "Sorry for the inconvenience. We're looking into your delivery concern.";
    } else if (msg.includes("refund")) {
      return "Your refund request has been received. Our team will get back to you shortly.";
    }
  
    // Default reply
    return "Thank you for reaching out. We’ve received your message and will respond as soon as possible.";
  }
  
  module.exports = generateAutoReply;
  