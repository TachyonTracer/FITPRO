// Create global loader instance
window.loader = new LoaderManager();

// Setup AJAX interceptor
$(document).ajaxSend(function (event, jqXHR, settings) {
  const excludeUrls = [
    // Real-time notifications and chat
    "/api/Notification",
    "/api/Chat",
    "/api/SignalR",
    "/api/LiveUpdates",

    // User real-time updates
    "/api/User/GetNotificationCount",
    "/api/User/GetUserNotifications",

    // Class real-time updates
    "/api/Class/GetAvailableSpots",
    "/api/Class/GetLiveAttendance",

    // Instructor real-time updates
    "/api/Instructor/GetLiveSession",

    // Attendance real-time checks
    "/api/Attendance/CheckIn",

    // Any other polling endpoints
    "/api/Status",
    "/api/Health",
  ];

  if (!excludeUrls.some((url) => settings.url.includes(url))) {
    window.loader.show();
  }
});

$(document).ajaxComplete(function () {
  window.loader.hide();
});

$(document).ajaxError(function () {
  window.loader.hide();
});

// For Fetch API calls
const originalFetch = window.fetch;
window.fetch = async function (...args) {
  const [resource, config] = args;

  const excludeUrls = [
    // Real-time notifications and chat
    "/api/Notification",
    "/api/Chat",
    "/api/SignalR",
    "/api/LiveUpdates",

    // User real-time updates
    "/api/User/GetNotificationCount",
    "/api/User/GetUserNotifications",

    // Class real-time updates
    "/api/Class/GetAvailableSpots",
    "/api/Class/GetLiveAttendance",

    // Instructor real-time updates
    "/api/Instructor/GetLiveSession",

    // Attendance real-time checks
    "/api/Attendance/CheckIn",

    // Any other polling endpoints
    "/api/Status",
    "/api/Health",
  ];

  if (!excludeUrls.some((url) => resource.includes(url))) {
    window.loader.show();
  }

  try {
    const response = await originalFetch(resource, config);
    window.loader.hide();
    return response;
  } catch (error) {
    window.loader.hide();
    throw error;
  }
};
