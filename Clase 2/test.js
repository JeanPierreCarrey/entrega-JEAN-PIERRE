class TicketManager {
    constructor() {
        this.eventos = [];
    }
    #precioBaseDeGanancia = 0.15;
    getEventos() {
        console.log(this.eventos);
    }
    agregarEvento (nombre, lugar, precio, capacidad, fecha){
        let maxId = 0;
        this.eventos.forEach((evento) => {
            if(evento.id > maxId) {
                maxId = evento.id;
            }
        });
        maxId++;
        const id = maxId;
        const participantes = [];

        precio = precio + this.#precioBaseDeGanancia;
        capacidad = capacidad ?? 50;
        fecha = fecha ?? Date.now();

        const eventoCompleto = {nombre, lugar, precio, capacidad, fecha, id, participantes};

        this.eventos.push(eventoCompleto);
    }
    agregarUsuario(idEvento, idUsuario){
        const indexEventoEncontrado = this.eventos.findIndex(evento => evento.id == idEvento);
        if(indexEventoEncontrado > -1){
            this.eventos[indexEventoEncontrado].participantes.push(idUsuario);
        } else {
            throw "no existe ese id de evento";
        }
    }
}

const ticketera = new TicketManager();
ticketera.agregarEvento("navidad", "union", 100, undefined, undefined);
ticketera.agregarEvento("año nuevo", "buceo", 150, undefined, undefined);
ticketera.agregarUsuario(1, 859);
ticketera.agregarUsuario(2, 956);
ticketera.getEventos();


/* class TicketManager {
    eventos = [];
    constructor() {}
    #precioBaseDeGanancia = 0.15;
    getEventos() {
        console.log(this.eventos);
        return this.eventos;
    }
    agregarEvento (nombre, lugar, precio, capacidad, fecha){
        const id = Math.random();
        const participantes = [];

        precio = precio + this.#precioBaseDeGanancia;
        capacidad = capacidad ?? 50;
        fecha = fecha ?? Date.now();

        const eventoCompleto = {nombre, lugar, precio, capacidad, fecha, id, participantes};

        this.eventos.push(eventoCompleto);
    }
}

const ticketera = new TicketManager();
ticketera.agregarEvento("jp", "union", 100, undefined, undefined);
ticketera.getEventos(); */