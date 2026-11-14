import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const F = {
  ruqaa: "ThiqaRuqaa",
  naskh: "ThiqaNaskh",
  amiri: "ThiqaAmiri",
  cairo: "ThiqaCairo",
};

const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";

let loaded: Promise<unknown> | null = null;

export const ensureThiqaFonts = () => {
  if (!loaded) {
    loaded = Promise.all([
      loadFont({ family: F.ruqaa, url: staticFile("fonts/aref-ruqaa-arabic-700-normal.woff2"), weight: "700" }),
      loadFont({ family: F.naskh, url: staticFile("fonts/noto-naskh-arabic-arabic-700-normal.woff2"), weight: "700" }),
      loadFont({ family: F.amiri, url: staticFile("fonts/amiri-arabic-700-normal.woff2"), weight: "700" }),
      loadFont({ family: F.cairo, url: staticFile("fonts/cairo-arabic-900-normal.woff2"), weight: "900" }),
      loadFont({ family: F.cairo, url: staticFile("fonts/cairo-arabic-700-normal.woff2"), weight: "700" }),
      loadFont({ family: F.cairo, url: staticFile("fonts/cairo-latin-900-normal.woff2"), weight: "900", unicodeRange: LATIN }),
      loadFont({ family: F.cairo, url: staticFile("fonts/cairo-latin-900-normal.woff2"), weight: "700", unicodeRange: LATIN }),
    ]);
  }
  return loaded;
};
