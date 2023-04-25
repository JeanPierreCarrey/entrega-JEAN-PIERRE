const date = moment();
const birthday = moment("17-09-1990", "DD-MM-YYYY");
const myBirthInDays = moment().diff(birthday, "days");
if (moment(birthday, "DD-MM-YYYY").isValid()) {
    console.log(myBirthInDays);
}
console.log(date.format("DD-MM-YYYY"));
console.log(birthday.format("DD-MM-YYYY"));

console.log(myBirthInDays);

/* function ageCalculator(name, birthday) {
    const currentDay = moment().format("DD-MM-YYYY");
    let birth = moment(birthday, "DD-MM-YYYY");
    const myBirthday = birth.format("DD-MM-YYYY");
    const myBirthInYears = moment().diff(birth, 'years');
    const myBirthInDays = moment().diff(birth, 'days');

    console.log(`
        Hoy es ${currentDay},
    ${name} nacio el ${myBirthday},
    Desde su nacimiento han pasado ${myBirthInYears} años,
    Han pasado ${myBirthInDays} días,
    `)
};

ageCalculator("Jean Pierre", "02-10-1997");
console.log(ageCalculator); */

