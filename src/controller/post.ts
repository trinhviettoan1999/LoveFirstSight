import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';

export const addPost = (
  userId: string,
  content: string,
  collections: any,
  next: any,
) => {
  const createdAt = new Date().getTime();
  if (collections.length === 0) {
    firestore()
      .collection('news')
      .add({
        userId,
        content,
        collections,
        createdAt,
      })
      .then(() => next());
    return;
  }
  let listColections: {
    collectionId: string;
    path: string;
    mediaType: string;
  }[] = [];
  collections.forEach((collection: any) => {
    if (collection.mediaType === 'image') {
      const reference = storage().ref(
        `${userId}/imagesPost/${collection.collectionId}`,
      );
      reference.putFile(collection.path).then(() => {
        reference.getDownloadURL().then((result) => {
          listColections.push({
            collectionId: uuid.v4(),
            path: result,
            mediaType: 'image',
          });
          if (listColections.length === collections.length) {
            firestore()
              .collection('news')
              .add({
                userId,
                content,
                collections: listColections,
                createdAt,
              })
              .then(() => next());
          }
        });
      });
    } else {
      const reference = storage().ref(
        `${userId}/videosPost/${collection.collectionId}`,
      );
      reference.putFile(collection.path).then(() => {
        reference.getDownloadURL().then((result) => {
          listColections.push({
            collectionId: uuid.v4(),
            path: result,
            mediaType: 'video',
          });
          if (listColections.length === collections.length) {
            firestore()
              .collection('news')
              .add({
                userId,
                content,
                collections: listColections,
                createdAt,
              })
              .then(() => next());
          }
        });
      });
    }
  });
};

export const deletePost = (postId: string) => {
  firestore()
    .collection('news')
    .doc(postId)
    .delete()
    .then(() => console.log('Delete Success!!'));
};

const getListMatched = async (userId: string) => {
  let listMatched: string[] = [];
  await firestore()
    .collection('users')
    .where('likedUsers', 'array-contains', userId)
    .get()
    .then((querySnapshot) => {
      let list: string[] = [];
      querySnapshot.forEach((user) => list.push(user.id));
      return list;
    })
    .then(async (result) => {
      await firestore()
        .collection('users')
        .doc(userId)
        .get()
        .then((documentSnapshot) => {
          documentSnapshot.data()?.likedUsers.forEach((likedUserId: string) => {
            if (result.includes(likedUserId)) {
              listMatched.push(likedUserId);
            }
          });
        });
    });
  return listMatched;
};

export const getAllPosts = (userId: string, next: any) => {
  getListMatched(userId).then((result) => {
    result.push(userId);
    firestore()
      .collection('news')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async (querySnapshot) => {
        next(
          querySnapshot.docs.filter((item) =>
            result.includes(item.data().userId),
          ),
        );
      });
  });
};

export const votePost = (postId: string) => {
  const reference = firestore().doc(`news/${postId}`);
  reference.update({
    votes: firestore.FieldValue.arrayUnion(auth().currentUser?.uid),
  });
};

export const unVotePost = (postId: string) => {
  const reference = firestore().doc(`news/${postId}`);
  reference.update({
    votes: firestore.FieldValue.arrayRemove(auth().currentUser?.uid),
  });
};

export const commentPost = (comment: string, postId: string) => {
  const reference = firestore().doc(`news/${postId}`);
  reference.update({
    comments: firestore.FieldValue.arrayUnion({
      comment: comment,
      userId: auth().currentUser?.uid,
      commentId: uuid.v4(),
    }),
  });
};

export const getComments = (postId: string, next: any) => {
  firestore()
    .doc(`news/${postId}`)
    .onSnapshot((documentSnapshot) => {
      next(documentSnapshot.data()?.comments);
    });
};

export const deleteComment = (
  postId: string,
  commentId: string,
  comment: string,
  userId: string,
) => {
  const reference = firestore().doc(`news/${postId}`);
  reference.update({
    comments: firestore.FieldValue.arrayRemove({
      comment,
      commentId,
      userId,
    }),
  });
};

export const editComment = (
  postId: string,
  commentId: string,
  comment: string,
  userId: string,
) => {
  const reference = firestore().doc(`news/${postId}`);
  reference.update({
    comments: firestore.FieldValue.arrayUnion({
      comment,
      commentId,
      userId,
    }),
  });
};
