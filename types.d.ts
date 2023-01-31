type ClubType = {
    name: string;
    fullName: string;
    email: string;
    id: string;
    photoUrl?: string;
}

type StatsType = {
    totalClubs: number,
    totalEvents: number,
}

type NewClubType ={
    name: string;
    fullName: string;
    email: string;
    password?: string;
    photoUrl?: string;
}