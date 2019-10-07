module.exports = function Socket(idUser, socket) {
    this.socket = socket;
    this.getSocket = () => {
        return this.socket;
    }
}