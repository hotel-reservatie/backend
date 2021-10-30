import admin from 'firebase-admin'
export const verifyToken = (token: string) => {
  return new Promise(function (resolve, reject) {
    admin        
     .auth()
      .verifyIdToken(token)
      .then(decodedToken => {
        resolve(decodedToken)
      })
      .catch(error => {
        reject(error)
      })
  })
}