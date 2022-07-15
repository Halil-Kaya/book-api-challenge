/*
* Uygulamamda iki mod bulunmakta
* DEVELOPMENT -> normal ayaga kaldirilip calisan mod
* PRODUCTION -> docker'in icinde calisan mod
* */
export enum AppMode {
    DEVELOPMENT = 'DEVELOPMENT',
    PRODUCTION  = 'PRODUCTION'
}
