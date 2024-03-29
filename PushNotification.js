const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const CONFIG_API = {
    URL: 'https://onesignal.com/api/v1/notifications',
    HEADERS: [
        {key: 'Content-Type', value: 'application/json'},
        {key: 'Authorization', value: 'Basic MjBmODJkZTktYjQ4ZS00ZTJiLTk1ZmUtZTc0MWRhYmVmYjQ3'},
        {key: 'gzip', value: 'true'}
    ],
    APP_ID: 'f1ea11f1-66ab-4222-af16-05dda7a19d32'
}
module.exports = function PushNotification() {
    this.xhr = new XMLHttpRequest();

    this.sendNotif = (doc) => {
        this.xhr.open('POST', CONFIG_API.URL);
        CONFIG_API.HEADERS.forEach(_elt => {
            this.xhr.setRequestHeader(_elt.key, _elt.value);
        });
        const body = {
            app_id : CONFIG_API.APP_ID,
            included_segments: ["Active Users"],
            heading: {"en": "My Notif"},
            contents: {"en": doc},
            data: {"task": "Sent API"}
        }
        this.xhr.send(JSON.stringify(body));
        this.xhr.onreadystatechange = () => {
            console.log(this.xhr.readyState);
            console.log(this.xhr.status + '->' + this.xhr.statusText);
        }
    }
}