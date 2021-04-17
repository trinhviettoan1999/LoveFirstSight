const RtcTokenBuilder = require('./RtcTokenBuilder').RtcTokenBuilder;
const RtcRole = require('./RtcTokenBuilder').Role;

type props = {
  appId: string;
  appCertificate: string;
  channelName: string;
  uid: number;
};

// Build token with uid
export const createToken = ({
  appId,
  appCertificate,
  channelName,
  uid,
}: props) => {
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  return RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs,
  );
};
