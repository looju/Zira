// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";

const key = process.env.EXPO_PUBLIC_FIREBASEKEY;
const authDomain = process.env.EXPO_PUBLIC_FIREBASEAUTHDOMIAN;
const projectId = process.env.EXPO_PUBLIC_FIREBASEPROJECTID;
const storageBucket = process.env.EXPO_PUBLIC_FIREBASESTORAGEBUCKET;
const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASESENDERID;
const appId = process.env.EXPO_PUBLIC_FIREBASEAPPID;

const firebaseConfig = {
  apiKey: key,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

export const listFiles = async () => {
  const storage = getStorage(app);

  // Create a reference under which you want to list
  const listRef = ref(storage, "images");

  // Find all the prefixes and items.
  const listResp = await listAll(listRef);
  return listResp.items;
};

export const uploadToFirebase = async (uri, name, onProgress) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();

  const imageRef = ref(getStorage(app), `images/${name}`);

  const uploadTask = uploadBytesResumable(imageRef, theBlob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          downloadUrl,
          metadata: uploadTask.snapshot.metadata,
        });
      }
    );
  });
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export default app;
