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
