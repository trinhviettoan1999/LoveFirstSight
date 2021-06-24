import React from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {GiftedChat} from 'react-native-gifted-chat';
import {likeUser, updateStateConversation} from '.';
import {upload, getUrl} from '../firebase/storage';
import uuid from 'react-native-uuid';
import {updateConversation} from './conversation';

export const createKey = (
  appID: string,
  appCertificate: string,
  channelName: string,
  uid: number,
) => {
  return fetch(
    'https://still-brushlands-96770.herokuapp.com/agora/create-key',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appID,
        appCertificate,
        channelName,
        uid,
      }),
    },
  );
};

export const getStateVideoCall = async (conversationId: string, next: any) => {
  await firestore()
    .collection('conversations')
    .doc(conversationId)
    .onSnapshot((conversation) => {
      next(conversation.data()!.stateVideoCall);
    });
};

export const setStateVideoCall = async (
  conversationId: string,
  state: boolean,
) => {
  await firestore().collection('conversations').doc(conversationId).update({
    stateVideoCall: state,
  });
};

export async function callVideo(
  appId: string,
  channelName: string,
  ownerId: string,
) {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/notification/call',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: auth().currentUser?.uid,
        appId: appId,
        ownerId: ownerId,
        channelName: channelName,
      }),
    },
  ).then((res) => res.json());
}

export const getAllMessage = (
  conversationId: string,
  setLengthMessage: (value: React.SetStateAction<number>) => void,
  setMessages: (value: React.SetStateAction<never[]>) => void,
  setCreatedAt: (value: React.SetStateAction<number>) => void,
  setIsLoadingEarlier: (value: React.SetStateAction<boolean>) => void,
) => {
  const messagesRef = firestore().collection('conversations');
  messagesRef
    .doc(conversationId)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .onSnapshot((querySnapshot) => {
      const threads = querySnapshot.docs.map((documentSnapshot) => {
        return {
          _id: documentSnapshot.id,
          ...documentSnapshot.data(),
        };
      }) as any;
      setLengthMessage(threads.length);
      setMessages(threads);
      if (threads.length > 0) {
        setCreatedAt(threads[threads.length - 1].createdAt);
      }
      setIsLoadingEarlier(false);
    });
};

export const getMessageLoadMore = (
  conversationId: string,
  createdAt: number,
  setLengthMessage: (value: React.SetStateAction<number>) => void,
  setCreatedAt: (value: React.SetStateAction<number>) => void,
  setMessages: (value: React.SetStateAction<never[]>) => void,
  setIsLoadingEarlier: (value: React.SetStateAction<boolean>) => void,
  messages: never[],
) => {
  const messagesRef = firestore().collection('conversations');
  messagesRef
    .doc(conversationId)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .where('createdAt', '<', createdAt)
    .limit(20)
    .onSnapshot((querySnapshot) => {
      const threads = querySnapshot.docs.map((documentSnapshot) => {
        return {
          _id: documentSnapshot.id,
          ...documentSnapshot.data(),
        };
      }) as any;
      setLengthMessage(threads.length);
      if (threads.length > 0) {
        setCreatedAt(threads[threads.length - 1].createdAt);
        setMessages(GiftedChat.prepend(messages, threads));
        setIsLoadingEarlier(false);
      }
    });
};

const sendNotification = async (
  ownerId: string,
  userId: string,
  message: string,
  conversationId: string,
) => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/notification/message/' +
      ownerId +
      '/' +
      userId +
      '/' +
      message +
      '/' +
      conversationId,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json());
};

export const sendMessage = async (
  conversationId: string,
  message: string,
  userId: string,
  avatar: string,
  ownerId: string,
  firstUserId: string,
  state: any,
) => {
  const messagesRef = firestore().collection('conversations');
  await messagesRef
    .doc(conversationId)
    .collection('messages')
    .add({
      messageType: 'text',
      text: message,
      createdAt: new Date().getTime(),
      user: {
        _id: userId,
        avatar: avatar,
      },
    })
    .then(async () => {
      updateConversation(conversationId);
      sendNotification(ownerId, userId, message, conversationId);
      // @ts-ignore: Object is possibly 'null'.
      if (state && firstUserId !== auth().currentUser?.uid) {
        await likeUser(ownerId);
        await updateStateConversation(conversationId).then((res) =>
          console.log(res),
        );
      }
    });
};

export const sendImageChat = async (
  conversationId: string,
  userId: string,
  image: string,
  avatar: string,
) => {
  const messagesRef = firestore().collection('conversations');
  var fileName = `${uuid.v4()}.png`;
  // @ts-ignore: Object is possibly 'null'.
  await upload(userId, 'imagesMessages', fileName, image, () => {
    getUrl(userId, 'imagesMessages', fileName).then((result) => {
      messagesRef
        .doc(conversationId)
        .collection('messages')
        .add({
          messageType: 'image',
          image: result,
          text: '',
          createdAt: new Date().getTime(),
          user: {
            _id: userId,
            avatar: avatar,
          },
        });
    });
  });
};
