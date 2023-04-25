const express = require("express");
//import express from "express";
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});

//CUANDO HACEN UN PEDIDO EJECUTO ALGUNAS DE ESTAS FUNCIONES
app.get("/", (req, res) => {
    res.send("Hello World 3!");
});

app.get("/guille", (req, res) => {
    res.json({ id: 0, nombre: "guille", dni: 32324 });
});

app.get("/ditto", (req, res) => {
    res.json({ id: 2, nombre: "ditto", dni: 0 });
});

app.get("/todos", (req, res) => {
    res.json([
    { id: 0, nombre: "guille", dni: 32324 },
    { id: 2, nombre: "ditto", dni: 0 },
    ]);
});