export default async function get_weapon_list(): Promise<any> {
    const res = await fetch(encodeURI("./api/get/weapon_list"));
    const resParse = await res.json();

    return resParse;
}