// Config mapping for Official National and State Disaster Relief Funds in India

export const nationalReliefFunds = [
  {
    id: 'pm-cares',
    orgName: "PM CARES Fund",
    shortDesc: "National relief assistance during emergencies & public health crises.",
    url: "https://www.pmcares.gov.in",
    badge: "NATIONAL"
  },
  {
    id: 'ndrf-relief',
    orgName: "NDRF Official Relief Channel",
    shortDesc: "Direct rescue operational channel for field deployments & equipment.",
    url: "https://ndrf.gov.in",
    badge: "NATIONAL"
  },
  {
    id: 'red-cross-india',
    orgName: "Indian Red Cross Society",
    shortDesc: "Humanitarian relief supplies, medical aid & disaster shelter.",
    url: "https://www.indianredcross.org",
    badge: "HUMANITARIAN"
  }
];

export const stateReliefFunds = {
  "Tamil Nadu": {
    orgName: "TN CM's Public Relief Fund (CMPRF)",
    shortDesc: "Official Government of Tamil Nadu disaster relief & rehabilitation fund.",
    url: "https://cmprf.tn.gov.in",
    stateCode: "TN"
  },
  "Kerala": {
    orgName: "Kerala Chief Minister's Distress Relief Fund (CMDRF)",
    shortDesc: "Official state relief channel for flood & landslide disaster recovery.",
    url: "https://cmdrf.kerala.gov.in",
    stateCode: "KL"
  },
  "Maharashtra": {
    orgName: "Maharashtra Chief Minister Relief Fund",
    shortDesc: "Official emergency assistance fund for Maharashtra state disasters.",
    url: "https://cmrf.maharashtra.gov.in",
    stateCode: "MH"
  },
  "Odisha": {
    orgName: "Odisha Chief Minister's Relief Fund",
    shortDesc: "State government relief fund for coastal cyclone & flood recovery.",
    url: "https://cmrfodisha.gov.in",
    stateCode: "OD"
  },
  "West Bengal": {
    orgName: "West Bengal CM's Relief Fund",
    shortDesc: "Official relief fund for West Bengal storm & flood rehabilitation.",
    url: "https://wb.gov.in",
    stateCode: "WB"
  },
  "Assam": {
    orgName: "Assam Chief Minister's Relief Fund",
    shortDesc: "Assam state government flood relief & Brahmaputra basin recovery.",
    url: "https://cm.assam.gov.in",
    stateCode: "AS"
  },
  "Gujarat": {
    orgName: "Gujarat Chief Minister Relief Fund",
    shortDesc: "Official Gujarat state relief fund for industrial & natural disasters.",
    url: "https://cmrf.gujarat.gov.in",
    stateCode: "GJ"
  },
  "Karnataka": {
    orgName: "Karnataka Chief Minister's Relief Fund",
    shortDesc: "Official state assistance fund for urban flood & drought relief.",
    url: "https://cmrf.karnataka.gov.in",
    stateCode: "KA"
  },
  "Delhi": {
    orgName: "Delhi Chief Minister's Relief Fund",
    shortDesc: "Official disaster relief fund for Delhi NCR emergencies.",
    url: "https://delhi.gov.in",
    stateCode: "DL"
  },
  "Delhi NCR": {
    orgName: "Delhi Chief Minister's Relief Fund",
    shortDesc: "Official disaster relief fund for Delhi NCR emergencies.",
    url: "https://delhi.gov.in",
    stateCode: "DL"
  },
  "Himachal Pradesh": {
    orgName: "Himachal Pradesh CM Disaster Relief Fund",
    shortDesc: "Official state relief fund for cloudburst & landslide recovery.",
    url: "https://cmhimachal.gov.in",
    stateCode: "HP"
  },
  "Telangana": {
    orgName: "Telangana Chief Minister's Relief Fund",
    shortDesc: "Official state emergency relief fund for Telangana region.",
    url: "https://cmrf.telangana.gov.in",
    stateCode: "TG"
  },
  "Andhra Pradesh": {
    orgName: "Andhra Pradesh Chief Minister's Relief Fund",
    shortDesc: "Official AP state relief channel for coastal cyclone recovery.",
    url: "https://ap.gov.in",
    stateCode: "AP"
  }
};

/**
 * Helper to match an incident location string (e.g. "Chennai, Tamil Nadu") to relevant relief funds
 */
export function getReliefFundsForLocation(locationName = '') {
  const matchedState = Object.keys(stateReliefFunds).find(state => 
    locationName.toLowerCase().includes(state.toLowerCase())
  );

  const funds = [];

  // If state matches, add state-specific fund first
  if (matchedState && stateReliefFunds[matchedState]) {
    const stateFund = stateReliefFunds[matchedState];
    funds.push({
      id: `state-${stateFund.stateCode.toLowerCase()}`,
      orgName: stateFund.orgName,
      shortDesc: stateFund.shortDesc,
      url: stateFund.url,
      badge: `${stateFund.stateCode} STATE FUND`
    });
  }

  // Always append national funds (up to 3 total links)
  nationalReliefFunds.forEach(fund => {
    if (funds.length < 3) {
      funds.push(fund);
    }
  });

  return {
    stateName: matchedState || null,
    funds
  };
}
