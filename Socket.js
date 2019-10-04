module.exports = function Socket(socket) {
    this.socket = socket;
    this.getSocket = () => {
        return this.socket;
    }
}