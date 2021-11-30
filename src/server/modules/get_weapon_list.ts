import cheerio from "cheerio";
import axios from "axios";

export default async function get_character_list(): Promise<any> {
    let result = [];

    const PATHS = ["Swords", "Claymores", "Bows", "Polearms", "Catalysts"];

    for (let i = 0;i < PATHS.length;i++) {
        const url = `https://genshin-impact.fandom.com/wiki/${PATHS[i]}`

        // Request from wiki (https://genshin-impact.fandom.com/wiki/path[i])
        const res = await axios.get(url);
        const resParse = res.data;

        const $ = cheerio.load(resParse);

        // Parse table
        const tableCount = $("table.article-table").length;
        const table = $("table.article-table")[tableCount == 3 ? 1 : 2];

        const type = PATHS[i].slice(0, -1);

        // Iterate through tbody children but ignore first element AND ignore the last 3 elements if it is bow or catalyst (1star weapon, 2star weapon, and beta weapon), else 2 elements (1star and 2star weapon)
        $(table).find("tbody").children().toArray().slice(1, ((i == 2 || i == 4) ? -3 : -2)).forEach((row_el, j, THISS) => {
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
            const [ba_min, ba_max] = $(cells[3]).text().replace(/[\n\r)]/g, "").split("(")
            let sec_stat = $(cells[4]).text().split(" ");
            const sec_stat_minmax = sec_stat[sec_stat.length - 1].slice(0, -1).split("(");
            if (sec_stat.length === 3) {
                // parse to [ATK, 10.8, 49.6]
                // sec stat, min, max
                sec_stat = [sec_stat.slice(0, 2).join(" "), ...sec_stat_minmax];
            } else {
                sec_stat = [sec_stat[0], ...sec_stat_minmax]
            }

            result.push(
                { 
                    icon, 
                    name, 
                    rarity, 
                    "base_attack": 
                    { 
                        "min": +ba_min, 
                        "max": +ba_max 
                    },
                    "second_stat":
                    {
                        "stat": sec_stat[0],
                        "min": sec_stat[1],
                        "max": sec_stat[2]
                    },
                    type
                }
            );
        });
    }

    return result;
}
