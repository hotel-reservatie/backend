import admin, { auth } from 'firebase-admin'
export const verifyToken = (token: string) => {
    return new Promise(function (resolve, reject) {
        auth()
            .verifyIdToken(token)
            .then(decodedToken => {
                resolve(decodedToken)
            })
            .catch(error => {
                reject(error)
            })
    })
}