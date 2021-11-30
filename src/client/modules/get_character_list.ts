export default async function get_character_list(): Promise<any> {
    const res = await fetch(encodeURI("./api/get/character_list"));
    const resParse = await res.json();

    return resParse;
}