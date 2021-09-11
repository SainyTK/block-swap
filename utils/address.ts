import fs from "fs";
import { promisify } from "util";

const getAddressPath = (networkName: string) => `${__dirname}/../addressList/${networkName}.json`

async function getAddressList(networkName: string) {
    const addressPath = getAddressPath(networkName);
    return promisify(fs.readFile)(addressPath).then(res => JSON.parse(res.toString())).catch(e => ({}));
}

async function saveAddresses(networkName: string, newAddrList: Record<string, string>) {
    const addressPath = getAddressPath(networkName);
    const addressList = await getAddressList(networkName);
    return promisify(fs.writeFile)(addressPath, JSON.stringify({
        ...addressList,
        ...newAddrList
    }));
}

export default {
    getAddressList,
    saveAddresses
}