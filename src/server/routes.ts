import * as express from 'express';
import * as fs from "fs";
import * as path from "path";

import get_character_list from './modules/get_character_list';
import get_weapon_list from './modules/get_weapon_list';

const router = express.Router();

// Pre-processed data
let character_list: any[] = [];
let weapon_list: any[] = [];

(async () => {
    character_list = await get_character_list();
    weapon_list = await get_weapon_list();
})();

router.get("/api/get/character_list", (req, res) => {
    res.json(character_list);
});

router.get("/api/get/weapon_list", (req, res) => {
    res.json(weapon_list);
});

router.get('/api/get/main_stats', (req, res) => {
    const { query } = req

    const arti_list = JSON.parse(fs.readFileSync(path.resolve("./public/arti_list.json"), { encoding: "utf-8" }))

    if (query.type) {
        res.json(Object.keys(arti_list["mainStats"][query.type.toString()]))
        return;
    }

    res.json([])
});

router.get("/api/get/sub_stats", (req, res) => {
    const { query } = req

    const arti_list = JSON.parse(fs.readFileSync(path.resolve("./public/arti_list.json"), { encoding: "utf-8" }))

    const type = decodeURI(query.type.toString());
    let main_stat = (query.main_stat || "").toString();

    if (type === "feather" || type === "flower") {
        res.json(Object.keys(arti_list["subStats"][type]));
        return;
    } else {
        if (main_stat) {
            if (main_stat.includes("DMG Bonus%")) {
                // yeah, i know, shutup
                main_stat = "Elm_Phys_Bonus";
            }

            res.json(Object.keys(arti_list["subStats"][type][main_stat]));

            return;
        }
    }

    res.json([]);
});

export default router;