import { Request } from "express";
import { DecodedIdToken, UserInfo, UserRecord } from "firebase-admin/auth";

export interface authorizedRequest extends Request {
    currentUser: DecodedIdToken
    body: GraphqlBody | undefined
}

interface GraphqlBody {
    operationName: string,
    variables: Object,
    query: string
}

