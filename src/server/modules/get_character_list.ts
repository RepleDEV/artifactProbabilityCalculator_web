import cheerio from "cheerio";
import axios from "axios";

export default async function get_weapon_list(): Promise<any> {
    // Request from wiki (https://genshin-impact.fandom.com/wiki/Characters)
    const res = await axios.get("https://genshin-impact.fandom.com/wiki/Characters");
    const resParse = res.data;

    const $ = cheerio.load(resParse);

    // Parse table
    const table = $("table.article-table")[0];

    let result = [];

    // Iterate through tbody children but ignore first element
    $(table).find("tbody").children().toArray().slice(1).forEach((row_el) => {
        // tr element
        const row = $(row_el);
        const cells = row.children().toArray().filter((v, i) => i != 5);

        // Parse cells
        let icon = $(cells[0]).find("img").attr("data-src");
        // Remove ?cb query param whatever then replace /50 at the end (rescale size) to be /{size} so that
        // it can be changed after the fact
        icon = icon.substring(0, icon.indexOf("?cb")).replace("/50", "/{size}");
        const name = $(cells[1]).find("a").text();
        // Get first character of alt attribute from the img element from the cell.. wha?
        // console.log(cells[1].children[0])
        const rarity = +$(cells[2]).find("img").attr("alt")[0];
        const element = $($(cells[3]).find("a").get(1)).text();
        const weaponType = $($(cells[4]).find("a").get(1)).text();
        const region = $(cells[5]).find("a").text();

        result.push({ icon, name, rarity, element, weaponType, region });
    });

    return result;
}