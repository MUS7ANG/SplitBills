import {collection, addDoc, query, orderBy, where, getDocs, doc, getDoc} from 'firebase/firestore'
import {IPost} from '../../types'; 
import { db } from '../../firebase'

export const createPost = async (post:Omit<IPost, 'id'>) => {
    const postsCollection = collection(db, 'posts');
    const docRef = await addDoc(postsCollection, post);
    return {...post, id: docRef.id}
}


export const getPosts = async (userId?:string):Promise<IPost[]> => {
    const postsCollection = collection(db, 'posts');
    let q = query(postsCollection, orderBy('createdAt', 'desc'));
    if (userId) {
        try {
          q = query(
            postsCollection,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
          )
          const querySnapShot = await getDocs(q)
          return querySnapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as IPost[];

        }catch(error){
            console.log('error = ', error)
        }
    }
    const querySnapShot = await getDocs(q);
    return querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as IPost[];
    
}

export const getPost = async (id: string): Promise<IPost | null> => {
    try {
        const postRef = doc(db, "posts", id);
        const postSnap = await getDoc(postRef);
        console.log("Post exists:", postSnap.exists(), "Data:", postSnap.data());
        if (postSnap.exists()) {
            return { id: postSnap.id, ...postSnap.data() } as IPost;
        }
        return null;
    } catch (error) {
        console.error("Error in getPost:", error);
        throw error;
    }
};