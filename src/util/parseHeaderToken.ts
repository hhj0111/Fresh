export default class {
    public static getToken(header:string){
        return header.substring(7)
    }
} 