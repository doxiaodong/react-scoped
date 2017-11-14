"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let uuid = 0;
function getUuid() {
    return uuid++;
}
exports.getUuid = getUuid;
