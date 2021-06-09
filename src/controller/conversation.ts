import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

const splitName = (name: string) => {
  return name.split(/[, ]+/).pop();
};

export const getConversation = async (state: boolean, next: any) => {
  const conversationsRef = firestore().collection('conversations');
  await conversationsRef
    .where('participants', 'array-contains', auth().currentUser?.uid)
    .where('state', '==', state)
    .onSnapshot(async (conversations) => {
      const results: (void | {
        conversationId: string;
        lastModified: any;
        text: any;
        name: any;
        avatar: any;
        stateVideoCall: boolean;
      })[] = [];
      conversations.forEach(async (conversation) => {
        const length = conversations.size;
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
          next(results);
        }
      });
    });
};

export const getConversationWait = async () => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/conversation/' +
      auth().currentUser?.uid +
      '/true',
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json());
};

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

export const sendMessageRequest = (receiverId: string) => {
  return fetch(
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
  ).then((res) => res.json());
};
