export enum Roles {
    user = 0,
    driver = 1,
}

export enum Statuses {
    pending = 0,
    working = 1,
    canceled = 2,
    done = 3,
}

export interface User {
    id: number
    login: string
    password: string
    phone: string
    role: Roles
}

export interface Request {
    id: number
    userId: number

    StartLat: number
    StartLng: number
    
    EndLat: number
    EndLng: number
    
    timestamp: string
    status: Statuses
    price: number
}

export interface Record {
    id: number
    driverId: number
    requestId: number
}
