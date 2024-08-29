
import bgChimera from './assets/background_chimera.png';
import bgPegasus from './assets/background_pegasus.png';
import bgPhoenix from './assets/background_phoenix.png';
import bgShinobi from './assets/background_shinobi.png';

import img_gold from './assets/gold.png';
import img_silver from './assets/silver.png';
import img_bronze from './assets/bronze.png';
import img_consolation from './assets/consolation.png';

import img_Pheonix from './assets/Empirename_Resilient_Phoenix.png';
import img_Pegasus from './assets/Empirename_Prudent_Pegasus.png';
import img_Chimera from './assets/Empirename_Revenant_Chimera.png';
import img_Shinobi from './assets/Empirename_Shinobi_Beasts.png';


export const empireIds = ["chimera","pegasus","phoenix","shinobi"];

export const empires = {
    "chimera" : {
        id: "chimera",
        name: "Chimera",
        backgroundImage: bgChimera,
    },
    "pegasus" :  {
        id: "pegasus",
        name: "Pegasus",
        backgroundImage: bgPegasus,
    },
    "phoenix" : {
        id: "phoenix",
        name: "Phoenix",
        backgroundImage: bgPhoenix,
    },
    "shinobi" : {
        id: "shinobi",
        name: "Shinobi",
        backgroundImage: bgShinobi,
    }
}

export const medals = ["gold", "silver", "bronze", "consolation"];

export const medal_img = {
    "gold": img_gold,
    "silver": img_silver,
    "bronze": img_bronze,
    "consolation": img_consolation,
}

export const Ename = ["Phoenix", "Pegasus", "Chimera", "Shinobi"];

export const Ename_img = {
    "Phoenix": img_Pheonix,
    "Pegasus": img_Pegasus,
    "Chimera": img_Chimera,
    "Shinobi": img_Shinobi,
}
