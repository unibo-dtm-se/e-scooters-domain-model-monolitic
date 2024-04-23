/***********************************************
 *                                             *
 *                                             *
 *  Classes implementing the Domain Model      *
 *                                             *
 *                                             *
 ***********************************************

 /* User Account Entity */

class UserAccount {

    constructor(id, name, surname) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }

    name(){
        return this.name;
    }

    surname(){
        return this.surname;
    }

    id(){
        return this.name;
    }

    fullName(){
        return this.name + " " + this.surname;
    }
}

/*  Accounts Aggregate */

class UserAccounts {
    
    constructor() {
      this.accounts = new Map()
    }

    registerNewUser(id, name, surname){
        console.log("Registering new user: " + id)
        if (!this.isUserAlreadyRegistered(id)){
            console.log("GOOD: not present")
            this.accounts.set(id, new UserAccount(id, name, surname))
        } else {
            console.log("BAD: user already here")
            throw 'Duplicate id'
        }
    }

    isUserAlreadyRegistered(id){
        return this.accounts.get(id) != undefined
    }

    getAccountById(id){
        return this.accounts.get(id)
    }

    getAllAccountsId(){
        return Array.from(this.accounts.keys())
    }
}

/* Entity E-Scooter */

class EScooter {

    static IN_SERVICE_AVAILABLE = "in-service:available"
    static IN_SERVICE_NOT_AVAILABLE_IN_USE = "in-service:not-available:in-use"
    static OUT_OF_SERVICE_NEED_MAINTENANCE = "out-of-service:need-maintenance"
    static OUT_OF_SERVICE_IN_MAINTENANCE = "out-of-service:in-maintenance"
    static OUT_OF_SERVICE_BROKEN = "out-of-service:broken"
    static OUT_OF_SERVICE_LOST = "out-of-service:lost"

    constructor(id) {
        this.id = id
        this.serviceState = EScooter.IN_SERVICE_AVAILABLE;
        this.deviceState = {
            state: null,
            pos: null,
            batteryLevel: null
        }
    }

    getState(){
        return this.serviceState
    }

    unlock() {
        if (this.serviceState == EScooter.IN_SERVICE_AVAILABLE){
            this.serviceState = EScooter.IN_SERVICE_NOT_AVAILABLE_IN_USE;
            this.log("unlock request succeded")
        } else {
            this.log("unlock request failed")
            throw 'not available'
        }
    }

    lock() {
        if (this.serviceState == EScooter.IN_SERVICE_NOT_AVAILABLE_IN_USE){
            this.serviceState = EScooter.IN_SERVICE_AVAILABLE;
            this.log("lock request succeeded")
        } else {
            this.log("lock request failed")
            throw 'already locked'
        }
    }
    
    sync(state, pos, batteryLevel){
        this.log("sync")
        this.deviceState = {
            state: state,
            pos: pos,
            batteryLevel: batteryLevel
        }
    }

    log(msg){
        console.log("[EScooter " + this.id + "] " + msg);
    }

}

/** Escooters Aggregate */

class EScooters {
    
    constructor() {
      this.scooters = new Map()
    }

    registerNewEScooter(id){
        console.log("Registering new e-scooter: " + id)
        if (!this.isEScooterAlreadyRegistered(id)){
            console.log("GOOD: not present")
            this.scooters.set(id, new EScooter(id))
        } else {
            console.log("BAD: e-scooter already registered")
            throw 'Duplicate id'
        }
    }

    isEScooterAlreadyRegistered(id){
        return this.scooters.get(id) != undefined
    }

    getAllEScootersId(){
        return Array.from(this.scooters.keys())
    }

    // to access the individual EScooter DT

    lockEScooter(id){
        this.log("locking " + id)
        this.scooters.get(id).lock();
    }

    unlockEScooter(id){
        this.log("unlocking " + id)
        this.scooters.get(id).unlock();
    }

    syncEScooter(id,state, pos, batteryLevel){
        this.scooters.get(id).sync(state, pos, batteryLevel);
    }

    log(msg){
        console.log("[EScooters] " + msg);
    }


}

class RentEvent {
    constructor(time, what) {
        this.time = time
        this.what = what
    }
}

/* Rent Entity */

class Rent {

    constructor(id, userId, escooterId) {
        this.id = id
        this.userId = userId
        this.escooterId = escooterId
        const time = Date.now()
        this.events = [
            new RentEvent(time,"started")
        ]
    }

    getEvents(){
        return this.events
    }
    
    notifyEvent(time, what){
        this.events.push(new RentEvent(time,what))
    }

    endRenting(){
        const time = new Date();
        this.events.push(new RentEvent(time,"completed"))
        this.log("rent " + this.id + " completed at " + time.toUTCString())
    }
    
    log(msg){
        console.log("[Rent " + this.id + "] " + msg);
    }
}

/* Rentings Aggregate */

class Rentings {
    
    constructor() {
      this.rents = new Map()
      this.rentCounter = 0;
    }

    startNewRent(userId, escooterId){
        this.rentCounter++;
        const rentId = "rent-" + this.rentCounter;
        this.log("starting a new rent: " + rentId);
        let rent = new Rent(rentId, userId, escooterId)
        this.rents.set(rentId, rent)
        return rentId
    }

    endOngoingRent(rentId){
        let rent = this.rents.get(rentId)
        if (rent != undefined){
            rent.endRenting()
        } else {
            throw 'rent not found'
        }
    }

    getRentById(id){
        return this.rents.get(id)
    }

    getAllRents(){
        return Array.from(this.rents.keys())
    }

    log(msg){
        console.log("[Renting] " + msg);
    }


}

let accounts = new UserAccounts()
let escooters = new EScooters()
let rentings = new Rentings()

/** some interaction example  */

let account = new UserAccount("amerini","Alda","Merini")
console.log("account: " + account.fullName())

accounts.registerNewUser("amerini", "Alda", "Merini");
accounts.registerNewUser("emontale", "Eugenio", "Montale");
accounts.registerNewUser("gungaretti", "Giuseppe", "Ungaretti");

escooters.registerNewEScooter("escoo-01");
escooters.registerNewEScooter("escoo-02");

let rentId = rentings.startNewRent("amerini","escoo-01");
rentings.endOngoingRent(rentId);

let events = rentings.getRentById(rentId).getEvents()
events.forEach((ev) => {
    console.log(ev)
})