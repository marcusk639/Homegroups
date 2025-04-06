// /* tslint:disable */

// import { House } from '../entities/House';
// import Admin from '..//entities/Admin';
// import { Guest } from '../entities/Guest';
// import lodash from 'lodash';
// import { initializeAdvancedConfig, initializeBasicConfig, initializeModerateConfig } from './phase';
// import { User } from '../entities/User';
// import { v4 as uuid } from 'uuid';
// import { app, ratsFirestore } from '../api/firestore';
// import { logger } from 'firebase-functions/v1';

// export default (async () => {

//   const { uniqueNamesGenerator, names } = require('unique-names-generator');

//   const randomName = () => uniqueNamesGenerator({
//     dictionaries: [names, names],
//     separator: ' ',
//     length: 2
//   }); // big_red_donkey

//   const getRandomInt = (min, max) => {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
//   }
//   const firstName = () => randomName().split(' ')[0];
//   const lastName = () => randomName().split(' ')[1];
//   const adminEmail = (name: string) => `${name}@demo-app.com`;
//   const guestEmail = (name: string) => `${name}@demo-app.com`;
//   const phoneNumber = (areaCode: string) => `${areaCode}-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`;
//   const streetNumber = ["1234", "4321", "1324", "1423", "1243", "1224"];
//   const streetName = ["ABC Street", "XYZ Street", "Some Street", "Alpha Street", "Beta Street", "Charlie Street"];
//   const cityName = ["Lafayette", "Cary", "Saint Paul", "San Diego", "Jacksonville", "Seattle", "Austin"];
//   const stateName = ["LA", "NC", "MN", "CA", "FL"];
//   const zipCode = ["70506", "27518", "55105", "91911", "32201", "71465"];
//   const houseNames = ['Alpha House', 'Beta House', 'Charlie House', 'Delta House', 'Echo House'];
//   const phases = [initializeAdvancedConfig(), initializeBasicConfig(), initializeModerateConfig()];

//   const numberOfHouses = 5;
//   const houses = [];
//   const admins = [];
//   let firestoreUser;
//   const guests = [];
//   const numberOfAdmins = [2, 1, 4, 5, 3];
//   const numberOfGuests = [4, 5, 12, 0, 9];
//   const auth = app.auth();
//   const createUser = () => {
//     return auth.createUser({
//       email: 'demo_user@appdemo.net',
//       emailVerified: true,
//       password: 'DemoUser1'
//     }) as Promise<any>;
//   }

//   const createFirestoreUser = (user, admin: Admin, guest: Guest) => {
//     firestoreUser = new User();
//     firestoreUser.adminId = admin.id;
//     firestoreUser.firstName = admin.firstName;
//     firestoreUser.lastName = admin.lastName;
//     firestoreUser.isAdmin = true;
//     firestoreUser.emailVerified = true;
//     firestoreUser.infoEntered = true;
//     firestoreUser.isSuperAdmin = true;
//     firestoreUser.orgSetupCompleted = true;
//     firestoreUser.id = user.uid;
//     return firestoreUser;
//   }

//   const createDemoHouses = () => {
//     for (let i = 0; i < numberOfHouses; i++) {
//       houses.push(this.createHouse(i));
//     }
//   }

//   const upload = (name: string, doc: any) => {
//     if (!doc.id) {
//       logger.info(doc);
//     }
//     return ratsFirestore.collection(name).doc(doc.id).set(JSON.parse(JSON.stringify(doc)));
//   }

//   const user = await createUser();

//   const createClaims = (houses: House[]) => {
//     const claims = {};
//     claims['superAdmin'] = [];
//     houses.forEach(house => {
//       claims['superAdmin'].push(house.id);
//     });
//     return auth.setCustomUserClaims(user.uid, claims);
//   }

//   const uploadDemo = async () => {
//     const promises = [];
//     let name = firstName();
//     const admin = new Admin(adminEmail(name), name, lastName(), uuid());
//     houses.forEach(house => {
//       admin.houseIds.push(house.id)
//       house.adminIds.push(admin.id);
//     });
//     admin.phoneNumber = phoneNumber('919');
//     admin.userId = user.uid;
//     admins.push(admin)
//     firestoreUser = createFirestoreUser(user, admin, null);
//     promises.push(upload('users', firestoreUser));
//     promises.push(...houses.map(house => upload('houses', house)));
//     promises.push(...guests.map(guest => upload('guests', guest)));
//     promises.push(...admins.map(admin => upload('admins', admin)));
//     await createClaims(houses);
//     return Promise.all(promises);
//   }

//   this.createHouse = (index: number) => {
//     const house = new House();
//     //@ts-ignore
//     house.phases = phases[getRandomInt(0, 3)].phases;
//     const phaseNames = lodash.map(house.phases, phase => phase.name);
//     house.isDemoHouse = true;
//     house.maximumCapacity = 15;
//     house.name = houseNames[index];
//     house.phoneNumber = phoneNumber('919');
//     house.street = streetNumber[index] + ' ' + streetName[index];
//     house.city = cityName[index];
//     house.state = stateName[index];
//     house.zip = zipCode[index];

//     this.createAdmins(house, index);
//     this.createGuests(house, index, phaseNames);
//     return house;
//   }

//   this.createAdmin = (house: House, userId?: string) => {
//     let name = firstName();
//     const admin = new Admin(adminEmail(name), name, lastName(), uuid());
//     admin.houseIds.push(house.id);
//     house.adminIds.push(admin.id);
//     admin.phoneNumber = phoneNumber('919');
//     admin.userId = userId || uuid();
//     return admin;
//   }

//   this.createAdmins = (house: House, index: number) => {
//     for (let i = 0; i < numberOfAdmins[index]; i++) {
//       admins.push(this.createAdmin(house));
//     }
//     return admins;
//   }

//   this.createGuests = (house: House, index: number, phaseNames: string[]) => {
//     for (let i = 0; i < numberOfGuests[index]; i++) {
//       const guest = new Guest();
//       guest.phase = phaseNames[getRandomInt(0, phaseNames.length - 1)];
//       guest.firstName = firstName();
//       guest.lastName = lastName();
//       guest.email = guestEmail(guest.firstName);
//       guest.houseId = house.id;
//       guest.userId = uuid();
//       guests.push(guest);
//     }
//     return guests;
//   }

//   createDemoHouses();
//   await uploadDemo();
//   require('fs').writeFileSync('demo-model.json', JSON.stringify({ houses, admins, guests, firestoreUser }));
// })();
