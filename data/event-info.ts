interface EventInfo {
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  keyIssues?: string[];
  impact?: string;
}

export const eventInfo: Record<string, EventInfo> = {
  "The Vanisher's Debut": {
    title: "The Vanisher's Debut",
    description: "The X-Men face their first major villain, the Vanisher, who has the ability to teleport himself and others. This early encounter showcases the team's ability to work together against a powerful foe.",
    startDate: "September 1963",
    keyIssues: [
      "X-Men vol. 1 #2",
      "X-Men vol. 1 #3"
    ],
    impact: "Established the X-Men's role in protecting humanity from mutant threats."
  },
  "Brotherhood of Evil Mutants": {
    title: "Brotherhood of Evil Mutants",
    description: "Magneto forms his first Brotherhood of Evil Mutants, recruiting Toad, Quicksilver, Scarlet Witch, and Mastermind. This marks the beginning of a long-standing rivalry between the X-Men and Magneto's forces.",
    startDate: "January 1964",
    keyIssues: [
      "X-Men vol. 1 #4",
      "X-Men vol. 1 #5",
      "X-Men vol. 1 #6"
    ],
    impact: "Introduced key characters who would become major players in the X-Men universe, including Quicksilver and Scarlet Witch."
  },
  // Add more events here following the same structure
  // Example:
  // "Dark Phoenix Saga": {
  //   title: "Dark Phoenix Saga",
  //   description: "Jean Grey becomes corrupted by the Phoenix Force, leading to one of the most tragic and impactful stories in X-Men history.",
  //   startDate: "January 1980",
  //   endDate: "October 1980",
  //   keyIssues: [
  //     "X-Men vol. 1 #129",
  //     "X-Men vol. 1 #137"
  //   ],
  //   impact: "One of the most significant storylines in X-Men history, leading to Jean Grey's death and the team's reformation."
  // }
} 