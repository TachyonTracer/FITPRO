$(document).ready(function () {
  uri = "http://localhost:8080";
  const chatWidget = $("#chat-widget");
  const messagesContainer = $(".chat-messages");
  const userInput = $("#user-message");
  const sendButton = $("#send-message");
  const minimizeButton = $("#minimize-chat");
  const chatBody = $(".chat-body");
  const chatFab = $(".chat-fab");

  // --- Load previous messages from localStorage ---
  function loadMessages() {
    const saved = localStorage.getItem("fitpro_chat_history");
    if (saved) {
      const history = JSON.parse(saved);
      history.forEach(msg => appendMessage(msg.text, msg.sender, false));
    }
  }

  // --- Save message to localStorage ---
  function saveMessage(text, sender) {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem("fitpro_chat_history")) || [];
    } catch { }
    history.push({ text, sender, timestamp: new Date().toISOString() });
    // Keep only last 50 messages
    if (history.length > 50) {
      history = history.slice(history.length - 50);
    }
    localStorage.setItem("fitpro_chat_history", JSON.stringify(history));
  }

  // --- Clear chat history ---
  function clearMessages() {
    localStorage.removeItem("fitpro_chat_history");
    messagesContainer.empty();
  }

  // --- Format message time ---
  function formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // --- Append message to chat window and save ---
  function appendMessage(text, sender, save = true) {
    // Handle multiline texts (replace \n with <br>)
    text = text.replace(/\n/g, '<br>');
    
    const timestamp = save ? new Date().toISOString() : null;
    const timeFormatted = formatTime(timestamp);
    
    let msgHtml;
    if (sender === "user") {
      msgHtml = `
        <div class="user-msg" style="margin-bottom: 16px; text-align: right; animation: fadeIn 0.3s;">
          <div style="display: inline-block; background: #e8f0fe; border-radius: 18px 18px 4px 18px; padding: 10px 14px; max-width: 85%; text-align: left;">
            <span style="display: block; margin-bottom: 4px; color: #4f46e5; font-weight: 500;">You</span>
            <span style="color: #333;">${text}</span>
            ${timestamp ? `<span style="display: block; font-size: 0.7em; color: #999; margin-top: 5px; text-align: right;">${timeFormatted}</span>` : ''}
          </div>
        </div>`;
    } else {
      msgHtml = `
        <div class="bot-msg" style="margin-bottom: 16px; text-align: left; animation: fadeIn 0.3s;">
          <div style="display: flex; align-items: flex-start;">
            <div style="margin-right: 8px; background: #4f46e5; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="color: white; font-size: 1.1em;">💪</span>
            </div>
            <div style="background: #f3f4f6; border-radius: 4px 18px 18px 18px; padding: 10px 14px; max-width: 85%;">
              <span style="display: block; margin-bottom: 4px; color: #4f46e5; font-weight: 500;">Fitty</span>
              <span style="color: #333;">${text}</span>
              ${timestamp ? `<span style="display: block; font-size: 0.7em; color: #999; margin-top: 5px;">${timeFormatted}</span>` : ''}
            </div>
          </div>
        </div>`;
    }
    messagesContainer.append(msgHtml);

    // Inside your appendMessage function, for bot messages about available classes:
    if (sender === "bot" && text.includes("Here are some available classes:")) {
      // Add "More classes" button under the message
      const moreButton = $(`
        <button class="quick-reply-btn" style="background: #e8f0fe; color: #4f46e5; border: 1px solid #4f46e5; 
        border-radius: 16px; padding: 6px 12px; margin-top: 8px; cursor: pointer;">
          More classes
        </button>`);
      
      messagesContainer.append(moreButton);
      
      moreButton.click(function() {
        userInput.val("more classes");
        sendMessage();
      });
    }

    messagesContainer.scrollTop(messagesContainer[0].scrollHeight);
    if (save) saveMessage(text, sender);
  }

  // --- Load history on page load ---
  loadMessages();

  // --- Add greeting if no messages ---
  if (messagesContainer.children().length === 0) {
    appendMessage("Hi! 👋 I'm Fitty, your personal fitness assistant. How can I help you today?", "bot");
  }

  // --- Initialize chat ---
  sendButton.click(sendMessage);
  userInput.keypress(function (e) {
    if (e.which == 13) sendMessage();
  });

  // --- Minimize/Maximize chat ---
  minimizeButton.click(function () {
    console.log("Minimize button clicked, minimized state:", chatWidget.hasClass("minimized"));
    if (chatWidget.hasClass("minimized")) {
      // Maximize
      chatWidget.removeClass("minimized");
      minimizeButton.html("−");
      messagesContainer.scrollTop(messagesContainer[0].scrollHeight);
      
      // Make sure chat is visible
      chatWidget.css("display", "block");
    } else {
      // Minimize
      chatWidget.addClass("minimized");
      minimizeButton.html("+");
    }
  });

  // --- Toggle chat with fab button ---
  chatFab.click(function() {
    console.log("Fab button clicked");
    // Always maximize when clicking the fab
    chatWidget.removeClass("minimized");
    minimizeButton.html("−");
    messagesContainer.scrollTop(messagesContainer[0].scrollHeight);
    
    // Make sure chat is visible
    chatWidget.css("display", "block");
  });

  // --- Clear chat ---
  $("#clear-chat").click(function () {
    clearMessages();
    appendMessage("Hi! 👋 I'm Fitty, your personal fitness assistant. How can I help you today?", "bot");
  });

  // --- Send message function ---
  function sendMessage() {
    const message = userInput.val().trim();
    if (!message) return;
    appendMessage(message, "user");
    userInput.val("");
    
    // Focus back on input
    userInput.focus();
    
    // Get userId from token
    const userId = getUserIdFromToken();
    
    if (!userId) {
      appendMessage("Please log in to use the chatbot.", "bot");
      return;
    }
    
    // Show typing indicator
    const typingIndicator = $(`
      <div class="bot-msg typing-indicator" style="margin-bottom: 16px; text-align: left;">
        <div style="display: flex; align-items: flex-start;">
          <div style="margin-right: 8px; background: #4f46e5; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span style="color: white; font-size: 1.1em;">💪</span>
          </div>
          <div style="background: #f3f4f6; border-radius: 4px 18px 18px 18px; padding: 10px 14px;">
            <div class="dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>
      </div>
    `);
    messagesContainer.append(typingIndicator);
    messagesContainer.scrollTop(messagesContainer[0].scrollHeight);
    
    $.ajax({
      url: `${uri}/api/Chatbot/Process`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ message, userId }),
      success: function (res) {
        // Remove typing indicator
        $(".typing-indicator").remove();
        
        if (res.success && res.data && res.data.response) {
          // Check if the response contains a redirect URL
          const urlMatch = res.data.response.match(/http:\/\/localhost:8081\/User\/Classdetails\/(\d+)/);
          
          if (urlMatch && urlMatch[1]) {
            // Extract the class ID
            const classId = urlMatch[1];
            
            // Show loading message
            appendMessage("Redirecting you to the booking page...", "bot");
            
            // Wait a moment, then redirect
            setTimeout(() => {
              window.location.href = `http://localhost:8081/User/Classdetails/${classId}`;
            }, 1500);
          } else {
            // Regular message, no redirect needed
            appendMessage(res.data.response, "bot");
          }
        } else {
          appendMessage("Sorry, I couldn't process your request.", "bot");
        }
      },
      error: function () {
        // Remove typing indicator
        $(".typing-indicator").remove();
        appendMessage("Server error. Please try again later.", "bot");
      }
    });
  }
  
  // Helper to extract userId from JWT token
  function getUserIdFromToken() {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64));
      return JSON.parse(decoded.UserObject).userId;
    } catch {
      return null;
    }
  }
  
  // Add some animation styles
  $("<style>")
    .prop("type", "text/css")
    .html(`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .typing-indicator .dots {
        display: flex;
        align-items: center;
      }
      .typing-indicator .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #888;
        border-radius: 50%;
        margin-right: 4px;
        animation: pulse 1.2s infinite ease-in-out;
      }
      .typing-indicator .dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-indicator .dot:nth-child(3) {
        animation-delay: 0.4s;
        margin-right: 0;
      }
      @keyframes pulse {
        0%, 100% { transform: scale(0.7); opacity: 0.5; }
        50% { transform: scale(1); opacity: 1; }
      }
    `)
    .appendTo("head");
});
