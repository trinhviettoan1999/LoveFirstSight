import React from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {ButtonCustom, CustomIcon} from '..';
import {cameraLaunch, deleteImage, galleryLaunch} from '../../controller';
import auth from '@react-native-firebase/auth';

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
        icon={<CustomIcon name="addcamera" size={30} color="#6A1616" />}
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
        icon={<CustomIcon name="addpicture" size={30} color="#6A1616" />}
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
          icon={<CustomIcon name="bin" size={30} color="#6A1616" />}
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
  },
});
