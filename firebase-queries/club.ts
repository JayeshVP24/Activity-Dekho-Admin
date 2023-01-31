import { adminFiredb } from "@/config/firebase-admin";

export const getClubList: () => Promise<ClubType[]> = async () => {
  return await adminFiredb
    .collection("clubs")
    .get()
    .then((snap) => {
      let clubs: ClubType[] = [];
      snap.docs.forEach((doc) => {
        clubs.push({
          id: doc.id,
          name: doc.data().name,
          email: doc.data().email,
          photoUrl: doc.data().photoUrl || null,
          fullName: doc.data().fullName,
        });
      });
      return clubs;
    })
    .catch((err) => err);
};

export const getStats = async (clubList: ClubType[]) => {
  return new Promise<StatsType>(
    async (resolve, reject) => {
      let eventCount: number = 0;
      // console.log("clubList at getStats: ", clubList);
      // const clubCount = await adminFiredb.collection("clubs").count().get()
      const clubCount = clubList.length;
      for (const club of clubList) {
        // console.log("club: ", club);
          await adminFiredb
            .collection("clubs")
            .doc(club.id.toString())
            .collection("EVENTS")
            .count()
            .get()
            .then((snap) => (eventCount += snap.data().count))
            .catch((err) => {
              console.log(err);
              reject(err.message)
            });
      }
      resolve({
        totalClubs: clubCount,
        totalEvents: eventCount,
      });
      // return {
      //   // clubsCount: clubCount.data().count,
      //   clubsCount: clubCount,
      //   eventsCount: 0,
      // };
    }
  );
};

export const addNewClub = async (newClub: NewClubType, photo: File) => {
  return new Promise<ClubType>((resolve, reject) => {
    console.log({newClub, photo})
    resolve({} as ClubType)
  })
}