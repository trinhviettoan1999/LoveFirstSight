import React from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {ButtonCustom} from '..';
import {cameraLaunch, deleteImage, galleryLaunch} from '../../controller';
import auth from '@react-native-firebase/auth';
import {BinFill, CameraFill, GalleryFill} from '../AllSvgIcon/AllSvgIcon';

interface PropsModal {
  isModalVisible: boolean;
  setIsModalVisible: any;
  fileName: string;
  images?: any;
  edit?: boolean;
  setLoadAvatar?: any;
  loadAvatar?: boolean;
}

export const ModalPicture = ({
  isModalVisible,
  setIsModalVisible,
  fileName,
  setLoadAvatar,
  loadAvatar,
  images,
  edit,
}: PropsModal) => {
  return (
    <Modal
      backdropTransitionOutTiming={0}
      swipeDirection="down"
      onSwipeComplete={() => setIsModalVisible(false)}
      hideModalContentWhileAnimating
      isVisible={isModalVisible}
      style={styles.modal}
      onBackdropPress={() => setIsModalVisible(false)}
      backdropOpacity={0.5}>
      <ButtonCustom
        buttonStyle={styles.buttonModal}
        titleStyle={styles.text}
        title="Open camera"
        icon={<CameraFill />}
        onPress={() => {
          setIsModalVisible(false);
          cameraLaunch({
            // @ts-ignore: Object is possibly 'null'.
            uid: auth().currentUser.uid,
            fileFolder: 'images',
            fileName: fileName,
            images,
            edit,
            setLoadAvatar,
            loadAvatar,
          });
        }}
      />
      <ButtonCustom
        buttonStyle={styles.buttonModal}
        titleStyle={styles.text}
        title="Upload From Gallery"
        icon={<GalleryFill />}
        onPress={() => {
          setIsModalVisible(false);
          galleryLaunch({
            // @ts-ignore: Object is possibly 'null'.
            uid: auth().currentUser.uid,
            fileFolder: 'images',
            fileName: fileName,
            images,
            edit,
            setLoadAvatar,
            loadAvatar,
          });
        }}
      />
      {!edit ? null : (
        <ButtonCustom
          buttonStyle={styles.buttonModal}
          titleStyle={styles.text}
          title="Delete Image"
          icon={<BinFill />}
          onPress={() => {
            deleteImage(fileName, images);
            setIsModalVisible(false);
          }}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonModal: {
    backgroundColor: '#F8F8F8',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#000000',
    marginLeft: 5,
  },
});
