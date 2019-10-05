const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const CONFIG_API = {
    URL: 'https://onesignal.com/api/v1/notifications',
    HEADERS: [
        {key: 'Content-Type', value: 'application/json'},
        {key: 'Authorization', value: 'Basic MjBmODJkZTktYjQ4ZS00ZTJiLTk1ZmUtZTc0MWRhYmVmYjQ3'}
    ],
    APP_ID: 'f1ea11f1-66ab-4222-af16-05dda7a19d32'
}
module.exports = function PushNotification() {
    this.xhr = new XMLHttpRequest();

    this.xhr.open('POST', CONFIG_API.URL);
    CONFIG_API.HEADERS.forEach(_elt => {
        this.xhr.setHeaders(_elt.key, _elt.value);
    });

    this.sendNotif = () => {
        const body = {
            app_id : CONFIG_API.APP_ID,
            included_segments: ["Active Users"],
            heading: {"en": "My Notif"},
            contents: {"en": "TEST"},
            data: {"task": "Sent API"}
        }
        this.xhr.send(body);
    }
}