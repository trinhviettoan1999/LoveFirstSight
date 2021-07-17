import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

const splitName = (name: string) => {
  return name.split(/[, ]+/).pop();
};

export const getConversation = async (state: boolean, next: any) => {
  const conversationsRef = await firestore().collection('conversations');
  await conversationsRef
    .orderBy('createdAt', 'desc')
    .onSnapshot(async (conversations) => {
      const newConversations = conversations.docs.filter(
        (item) =>
          item.data().state === state &&
          item.data().participants.includes(auth().currentUser?.uid),
      );
      const results: (void | {
        conversationId: string;
        lastModified: any;
        text: any;
        name: any;
        avatar: any;
        stateVideoCall: boolean;
      })[] = [];
      if (newConversations.length <= 0) {
        return next([]);
      }
      newConversations.forEach(async (conversation) => {
        const length = newConversations.length;
        results.push(
          await conversationsRef
            .doc(conversation.id)
            .collection('messages')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get()
            .then((messages) => {
              const mes: FirebaseFirestoreTypes.DocumentData[] = [];
              messages.forEach((message) => {
                mes.push(message.data());
              });
              const users = conversation.data()!.users;
              let receiver, sender;

              if (users[0].userId === auth().currentUser?.uid) {
                receiver = users[1];
                sender = users[0];
              } else {
                receiver = users[0];
                sender = users[1];
              }
              if (mes.length) {
                if (mes[0].user._id === auth().currentUser?.uid) {
                  sender.name = 'You';
                } else {
                  sender.name = receiver.name;
                }
                if (mes[0].messageType === 'text') {
                  return {
                    conversationId: conversation.id,
                    stateVideoCall: conversation.data().stateVideoCall,
                    lastModified: mes[0].createdAt,
                    text: mes[0].text,
                    name: receiver.name,
                    avatar: receiver.avatar,
                    userId: receiver.userId,
                  };
                } else if (mes[0].messageType === 'audio') {
                  return {
                    conversationId: conversation.id,
                    stateVideoCall: conversation.data()!.stateVideoCall,
                    lastModified: mes[0].createdAt,
                    text: splitName(sender.name) + ' sent a voice message.',
                    name: receiver.name,
                    avatar: receiver.avatar,
                    userId: receiver.userId,
                  };
                } else {
                  return {
                    conversationId: conversation.id,
                    stateVideoCall: conversation.data()!.stateVideoCall,
                    lastModified: mes[0].createdAt,
                    text: splitName(sender.name) + ' sent an image.',
                    name: receiver.name,
                    avatar: receiver.avatar,
                    userId: receiver.userId,
                  };
                }
              } else {
                return {
                  conversationId: conversation.id,
                  stateVideoCall: conversation.data()!.stateVideoCall,
                  lastModified: conversation.data()!.matchedAt,
                  text: 'You matched ' + splitName(receiver.name),
                  name: receiver.name,
                  avatar: receiver.avatar,
                  userId: receiver.userId,
                };
              }
            })
            .catch((err) => console.log(err)),
        );
        if (results.length === length) {
          results.sort(function (value1, value2) {
            return value1?.lastModified - value2?.lastModified;
          });
          next(results.reverse());
        }
      });
    });
};

// export const getConversationWait = async () => {
//   return await fetch(
//     'https://still-brushlands-96770.herokuapp.com/conversation/' +
//       auth().currentUser?.uid +
//       '/true',
//     {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json, text/plain, */*',
//         'Content-Type': 'application/json',
//       },
//     },
//   ).then((res) => res.json());
// };

export const updateStateConversation = (conversationId: any) => {
  return fetch(
    'https://still-brushlands-96770.herokuapp.com/conversation/update-state',
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId: conversationId,
      }),
    },
  );
};

export const sendMessageRequest = async (receiverId: string) => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/conversation/send-message',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId: auth().currentUser?.uid,
        receiverId: receiverId,
      }),
    },
  )
    .then((res) => res.json())
    .then((result) => result)
    .catch((err) => console.log('err: ', err));
};

export const updateConversation = async (conversationId: string) => {
  const conversationsRef = await firestore().collection('conversations');
  const createdAt = new Date().getTime();
  conversationsRef.doc(conversationId).update({
    createdAt,
    senderId: auth().currentUser?.uid,
    isRead: false,
  });
};

export const checkIsReadConversation = async (
  conversationId: string,
  next: any,
) => {
  return await firestore()
    .collection('conversations')
    .doc(conversationId)
    .onSnapshot((result) => {
      if (result !== null) {
        if (
          result.data()?.isRead === false &&
          result.data()?.senderId !== auth().currentUser?.uid
        ) {
          return next(true);
        } else {
          return next(false);
        }
      }
    });
};

export const updateStatusIsRead = (conversationId: string) => {
  const conversationsRef = firestore().collection('conversations');
  conversationsRef.doc(conversationId).update({
    isRead: true,
  });
};

export const getCountNotRead = async (next: any) => {
  if (auth().currentUser?.uid === undefined) {
    return;
  }
  return await firestore()
    .collection('conversations')
    .where('participants', 'array-contains', auth().currentUser?.uid)
    .where('isRead', '==', false)
    .onSnapshot((snapshot) => {
      if (snapshot !== null) {
        if (snapshot.size) {
          if (snapshot.docs.length > 0) {
            next(
              snapshot.docs.filter(
                (conversation) =>
                  conversation.data().senderId !== auth().currentUser?.uid,
              ),
            );
          } else {
            next([]);
          }
        }
      }
    });
};
