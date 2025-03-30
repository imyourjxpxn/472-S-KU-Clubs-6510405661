import Activity from "./Activity";

export default interface Club {
    id: string;
    clubCode: string;
    clubName: string;
    clubType: string;
    campus: string;
    clubPresident: string;
    advisor: string;
    aboutClub: string;
    activities: Activity[];
    committee?: Committee[];
  }