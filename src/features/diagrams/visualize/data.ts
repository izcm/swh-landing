type Status = "active" | "pending" | "inactive";

type Record = {
  id: number;
  country: string;
  region: string;
  status: Status;
};

type CityAggregate = {
  city: string;
  total: number;
  active: number;
  pending: number;
  inactive: number;
};

type City = {
  city: string;
  region: string;
  x: number;
  y: number;
  busy?: boolean;
  veryBusy?: boolean;
};

// x, y: where the city is on ScandinaviaOrthographic, in its own coordinates
// (scandinaviaOrthographicBounds, 600 tall)
export const cities: { [country: string]: City[] } = {
  norway: [
    { city: "Stavanger", region: "Rogaland", x: 12, y: 447, veryBusy: true },
    { city: "Bergen", region: "Vestland", x: 12, y: 391 },
    { city: "Oslo", region: "Oslo", x: 106, y: 412 },
    { city: "Trondheim", region: "Trøndelag", x: 102, y: 290, busy: true },
    { city: "Tromsø", region: "Troms", x: 209, y: 71, busy: true },
  ],
  sweden: [
    { city: "Stockholm", region: "Stockholm County", x: 237, y: 430 },
    { city: "Gothenburg", region: "Västra Götaland", x: 129, y: 488 },
    { city: "Malmö", region: "Skåne", x: 153, y: 565 },
    { city: "Umeå", region: "Västerbotten", x: 252, y: 264 },
    { city: "Östersund", region: "Jämtland", x: 169, y: 297 },
    { city: "Sundsvall", region: "Västernorrland", x: 212, y: 324 },
    { city: "Falun", region: "Dalarna", x: 190, y: 385 },
    { city: "Karlstad", region: "Värmland", x: 155, y: 430 },
  ],
  finland: [
    { city: "Helsinki", region: "Uusimaa", x: 349, y: 375, busy: true },
    { city: "Turku", region: "Southwest Finland", x: 307, y: 373 },
    { city: "Tampere", region: "Pirkanmaa", x: 324, y: 338 },
    { city: "Oulu", region: "North Ostrobothnia", x: 326, y: 214 },
  ],
  denmark: [
    { city: "Copenhagen", region: "Capital Region", x: 137, y: 560 },
    { city: "Aarhus", region: "Central Jutland", x: 91, y: 544, busy: true },
    // { city: "Odense", region: "Southern Denmark", x: 97, y: 571 },
    // { city: "Aalborg", region: "North Jutland", x: 88, y: 512 },
  ],
};
