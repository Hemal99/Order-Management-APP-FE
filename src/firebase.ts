import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  updateMetadata,
  uploadBytes,
} from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADAer5LRK6F5dmARp3wjqj9Gs9-tNIltU",
  authDomain: "order-app-41e22.firebaseapp.com",
  projectId: "order-app-41e22",
  storageBucket: "order-app-41e22.appspot.com",
  messagingSenderId: "835437222841",
  appId: "1:835437222841:web:fafd6428f45f85f8ceb468",
  measurementId: "G-5TJVX92VV6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
const auth = getAuth(app);

export const uploadImagetoFirebase = async (file?: File, fileName?: string) => {
  console.log({ file });

  if (!file || !fileName) return console.log("No file or fileName");

  try {
    // Upload image.
    const imageRef = ref(storage, `images/${fileName}`);
    const uploadImage = await uploadBytes(imageRef, file);

    // Create file metadata.
    const newMetadata = {
      contentType: uploadImage.metadata.contentType,
    };

    await updateMetadata(imageRef, newMetadata);

    // Get the image URL.
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error) {
    console.log(error);
  }
};

export const anonymousSignIn = async () => {
  try {
    await signInAnonymously(auth);
    console.log("Signed in Anonymously to firebase.");
  } catch (err) {
    console.log(err);
  }
};
