import PouchDB from 'pouchdb-browser';
import pharmaciesData from './data/pharmacy_data.json';


export const user_db = new PouchDB('users');
//userName,passowrd,locationId
export const pharmacies_db = new PouchDB('pharmacies');

export function initializePharmecies() {
  pharmacies_db.info().then(function (result) {
    if (result.doc_count === 0) {
      console.log('Its empty!');
      enterAllPharmacies()
    }

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
    console.log('isUsernameExists error')
    return false
  }
}

export async function logIn(userName, passowrd) {
  let user
  if (userName) {
    if (await isUsernameExists(userName)) {
      user = await user_db.get(userName)
      if (user.passowrd === passowrd) {
        console.log(`Logged in successfully user=${user.userName} location=${user.locationId}`)
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
    passowrd: passowrd,
    locationId: null
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

export async function updateUserLocationInDb(pharmacyId, user) {
  const doc = {
    ...user,
    locationId: pharmacyId,
  }
  console.log(`updating the user. new location=${pharmacyId}`)
  console.log(user)
  let response;
  try {
    response = await user_db.put(doc)
  } catch (err) {
    console.log('failed to updat document')
    console.error(error)
  }
  console.log('Update done. response=');
  console.log(response)
  let updatedUser;
  try {
    updatedUser = await user_db.get(user._id)
  } catch (err) {
    console.log('failed to get user')
    console.log(`failed to get user. user._id=${user._id}`)

    console.error(error)
  }
  console.log('Update user=');
  console.log(updatedUser)
  return updatedUser
}


export async function getPharmacy(pharmacyId) {
  if (!pharmacyId) {
    return null
  }
  const pharmacy = await pharmacies_db.get(pharmacyId)
  console.log('fetched pharmacy.');
  console.log(pharmacy)


  const users = await (await user_db.allDocs({ include_docs: true })).rows;
  const usersInPharmacy = users.filter((user) => user.doc.locationId === pharmacyId)
  console.log(`${usersInPharmacy.length} users in pharmacy ${pharmacyId}`)
  console.log(usersInPharmacy)
  pharmacy.count = usersInPharmacy.length - 1

  return pharmacy
}