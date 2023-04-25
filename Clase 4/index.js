const fs = require("fs");

fs.writeFileSync("productos.txt", "lmao dudes")

/* if (fs.existsSync("test.txt")) {
console.log("increible!!! test.txt existe!!");
const contenidoInicial = fs.readFileSync("test.txt", "utf-8");
console.log("contenido inicial del archivo");
console.log(contenidoInicial);

fs.appendFileSync("test.txt", "le agregamos algo al archivo");
const contenidoFinal = fs.readFileSync("test.txt", "utf-8");
console.log("contenido final");
console.log(contenidoFinal);
fs.unlinkSync("test.txt");
}
 */

