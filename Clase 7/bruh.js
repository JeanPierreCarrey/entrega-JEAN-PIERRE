const express = require("express");
const app = express();
const port = 3001;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.listen(port,() => console.log("dfdfg"));

let frase = "Frase";
app.get("/api/frase/:frase", (req, res) => {
    res.status(200).json(frase)
});

app.get("/api/palabras/:pos", (req, res) => {
    const pos = req.params.pos;
    let array = frase.split(" ");
    res.status(200).json(array[pos -1]);
});

app.post("/api/palabras", (req, res) => {
    const palabras = req.body;
    frase = frase + " " + palabras;
    let array = frase.split(" ");
    res.status(200).json({agregado:palabras, posicion: array.lenght})
});

app.put("/api/palabras/:pos", (req, res) => {
    let objeto = req.body;
    let posicion = req.params.pos;
    let array = frase.split(" ");
    let palabraAnterior = frase[posicion];
    array[posicion] = objeto;
    res.status(200).json({palabraAnterior});
})