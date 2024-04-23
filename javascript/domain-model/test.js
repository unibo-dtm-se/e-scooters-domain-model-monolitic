
var model = require('./domain-model');

let accounts = model.getAccounts();
let escooters = model.getEScooters();
let rentings = model.getRentings()
let service = model.getService();

/** some interaction example  */

// let account = new UserAccount("amerini","Alda","Merini")
// console.log("account: " + account.fullName())

accounts.registerNewUser("amerini", "Alda", "Merini");
accounts.registerNewUser("emontale", "Eugenio", "Montale");
accounts.registerNewUser("gungaretti", "Giuseppe", "Ungaretti");

escooters.registerNewEScooter("escoo-01");
escooters.registerNewEScooter("escoo-02");

/* use case oriented */

let rentId = service.rentAScooter("amerini", "escoo-01")
console.log("Renting succeeded - " + rentId);

// service.terminateARent("emontale", rentId);
service.terminateARent("amerini", rentId);

let events = rentings.getRentById(rentId).getEvents()
events.forEach((ev) => {
    console.log(ev)
})