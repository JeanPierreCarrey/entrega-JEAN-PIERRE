const { TicketModel } = require('./models/tickets.model.js');

class TicketMongo {
    async createTicket(){
        const ticket = TicketModel.create();
        return ticket;
    };
}

module.exports = TicketMongo;