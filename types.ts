export interface BoardingPassData {
  name: string;
  boardingTime: string;
  gate: string;
  flight: string;
  origin: string;
  destination: string;
  date: string;
  seat: string;
  travelClass: string;
}

export const INITIAL_DATA: BoardingPassData = {
  name: "ZHANG/SAN",
  boardingTime: "09:45",
  gate: "A12",
  flight: "MU5183",
  origin: "BEIJING (PEK)",
  destination: "SHANGHAI (SHA)",
  date: "2023-10-01",
  seat: "12A",
  travelClass: "ECONOMY CLASS / 经济舱",
};