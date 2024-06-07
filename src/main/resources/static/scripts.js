var stompClient = null;
var notificationCount = 0;

$(document).ready(function() {
    console.log("Index page is ready");
    connect();

    $("#send").click(function() {
        sendMessage();
    });

    $("#send-private").click(function() {
        sendPrivateMessage();
    });

    $("#notifications").click(function() {
        resetNotificationCount();
    });
});

function connect() {
    var socket = new SockJS('/our-websocket');  // Open Connection with backend
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        updateNotificationDisplay();
        stompClient.subscribe('/topic/messages', function (message) {  // Subscribe Message Url
            showMessage(JSON.parse(message.body).content); // Show Message
        });

        stompClient.subscribe('/user/topic/private-messages', function (message) { // Subscribe Private Message Url
            showMessage(JSON.parse(message.body).content); // Show Private Message
        });

        stompClient.subscribe('/topic/global-notifications', function (message) {  // Subscribe Global Notification Url
            notificationCount = notificationCount + 1;
            updateNotificationDisplay(); // Update Global Notification
        });

        stompClient.subscribe('/user/topic/private-notifications', function (message) {  // Subscribe Private Notification Url
            notificationCount = notificationCount + 1;
            updateNotificationDisplay(); // Update Private Notification
        });
    });
}

function showMessage(message) {
    $("#messages").append("<tr><td>" + message + "</td></tr>");
}

function sendMessage() {
    console.log("sending message");
    stompClient.send("/ws/message", {}, JSON.stringify({'messageContent': $("#message").val()}));
}

function sendPrivateMessage() {
    console.log("sending private message");
    stompClient.send("/ws/private-message", {}, JSON.stringify({'messageContent': $("#private-message").val()}));
}

function updateNotificationDisplay() {
    if (notificationCount == 0) {
        $('#notifications').hide();
    } else {
        $('#notifications').show();
        $('#notifications').text(notificationCount);
    }
}

function resetNotificationCount() {
    notificationCount = 0;
    updateNotificationDisplay();
}