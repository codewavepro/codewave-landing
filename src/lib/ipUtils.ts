import * as IP2Location from "ip2location-nodejs";

const db = new IP2Location.IP2Location();

import path from 'path';
const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'ipdb', 'IP2LOCATION-LITE-DB1.IPV6.BIN');

let dbReady = false;

try {
    db.open(DB_PATH);
    dbReady = true;
} catch (err) {
    console.error("Error when load:", err);
}

export function getCountry(ip: string): string {
    if (!dbReady) return "Db loading..";

    try {
        const result = db.getAll(ip);
        return result.countryLong || "Unknown";
    } catch (err) {
        return (err as Error).message;
    }
}