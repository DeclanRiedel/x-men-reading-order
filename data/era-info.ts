interface EraInfo {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  notable: string;
}

export const eraInfo: Record<string, EraInfo> = {
  "Silver Age": {
    title: "Silver Age",
    description: "The beginning of the X-Men, featuring the original team created by Stan Lee and Jack Kirby. This era established the core concepts and characters of the X-Men universe.",
    startDate: "1963",
    endDate: "1970",
    notable: "Original team, Stan Lee & Kirby"
  },
  "Claremont Era": {
    title: "Claremont Era",
    description: "The defining era of X-Men comics, written by Chris Claremont. This period saw the team's greatest growth and most iconic storylines, from Giant-Size X-Men to the Muir Island Saga.",
    startDate: "1975",
    endDate: "1991",
    notable: "Giant-Size to Muir Island Saga"
  },
  "90s Boom": {
    title: "90s Boom",
    description: "A period of massive popularity and expansion for the X-Men, featuring new characters and major storylines that defined the 90s era of comics.",
    startDate: "1991",
    endDate: "2000",
    notable: "Jim Lee, Cable, Bishop, Legacy Virus"
  },
  "Morrison Era": {
    title: "Morrison Era",
    description: "Grant Morrison's revolutionary take on the X-Men, bringing a more edgy sci-fi tone and redefining the team's place in the Marvel Universe.",
    startDate: "2001",
    endDate: "2004",
    notable: "New X-Men, edgier sci-fi tone"
  },
  "Utopia/Krakoa Setup": {
    title: "Utopia/Krakoa Setup",
    description: "A period of major changes for mutantkind, from the Messiah Complex to the events leading up to the Krakoa era.",
    startDate: "2006",
    endDate: "2018",
    notable: "Messiah Complex to Disassembled"
  },
  "Krakoa Era": {
    title: "Krakoa Era",
    description: "The current era of X-Men, featuring the establishment of the mutant nation of Krakoa and major changes to the status quo of mutantkind.",
    startDate: "2019",
    endDate: "2024+",
    notable: "House of X to Fall of X"
  }
} 