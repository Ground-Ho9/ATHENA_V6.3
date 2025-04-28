
import { db } from './firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export const getTopSeasonalPlayers = async (count = 10) => {
  const ref = collection(db, 'users');
  const q = query(ref, orderBy('seasonalRank', 'asc'), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
