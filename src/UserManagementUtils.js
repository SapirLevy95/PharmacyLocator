import PouchDB from 'pouchdb-browser';
import pharmaciesData from './data/pharmacy_data.json';


export const user_db = new PouchDB('users');
export const pharmacies_db = new PouchDB('pharmacies');


export function initializePharmecies() {
  pharmacies_db.info().then(function (result) {
    if (result.doc_count === 0) {
      console.log('Its empty!');
      enterAllPharmacies()
    }
    pharmacies_db.allDocs({ include_docs: true }).then((results) => {
      console.log('All pharmacies:')
      console.log(results.rows)
    })

  });
}

export function printAllUsers() {
  const temp = () => {
    user_db.allDocs({ include_docs: true }).then((results) => {
      console.log('allUsers:')
      console.log(results.rows)
    })
  }
  setTimeout(temp, 500)

}

export async function isUsernameExists(userName) {
  try {
    var userFromDb = await user_db.get(userName);
    return true
  } catch (err) {
    return false
  }
}

export async function logIn(userName, passowrd) {
  let user
  if (userName) {
    if (await isUsernameExists(userName)) {
      user = await user_db.get(userName)
      if (user.passowrd === passowrd) {
        console.log(`Logged in successfully user=${user.userName}`)
        return user
      } else {
        console.log(`Wrong password entered=${passowrd} original=${user.passowrd}`)
        return null
      }
    }
  }
}

export async function signUp(userName, passowrd) {
  var user = {
    _id: userName,
    userName: userName,
    passowrd: passowrd
  };
  await user_db.put(user)
  console.log(`Successfully added a user ${userName}`);
  return user
}

export async function enterAllPharmacies() {
  pharmaciesData.forEach(async (pharmecy) => {
    var pharmecyFromDict = {
      _id: pharmecy.id,
      name: pharmecy.name
    };
    await pharmacies_db.put(pharmecyFromDict)
  })
}