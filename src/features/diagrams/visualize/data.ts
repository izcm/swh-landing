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
