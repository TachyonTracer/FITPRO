$(document).ready(function () {
  const chatWidget = $("#chat-widget");
  const messagesContainer = $(".chat-messages");
  const userInput = $("#user-message");
  const sendButton = $("#send-message");
  const minimizeButton = $("#minimize-chat");

  // Initialize chat
  sendButton.click(sendMessage);
  userInput.keypress(function (e) {
    if (e.which == 13) sendMessage();
  });

  minimizeButton.click(function () {
    $(".chat-messages, .chat-input").toggle();
    minimizeButton.text(minimizeButton.text() === "-" ? "+" : "-");
    chatWidget.toggleClass("minimized");
  });

  function sendMessage() {
    const message = userInput.val().trim();
    if (!message) return;

    // Add user message
    appendMessage(message, "user");
    userInput.val("");

    // Call API to process message
    $.ajax({
      url: "http://localhost:8080/api/Chatbot/Process",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        message: message,
        userId: getUserIdFromToken(), // This function should be defined in your Index.js
      }),
      success: function (response) {
        if (response.success) {
          appendMessage(response.response, "bot");
        }
      },
      error: function () {
        appendMessage(
          "Sorry, I encountered an error. Please try again.",
          "bot"
        );
      },
    });
  }

  function appendMessage(text, sender) {
    const messageDiv = $("<div>")
      .addClass("message")
      .addClass(sender)
      .text(text);
    messagesContainer.append(messageDiv);
    messagesContainer.scrollTop(messagesContainer[0].scrollHeight);
  }
});
