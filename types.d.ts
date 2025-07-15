import {connection} from "mongoose";

declare global {
    var mongoose: {
        conn: typeof connection | null;
        promise: Promise<connection> | null;
    }
}

export {};