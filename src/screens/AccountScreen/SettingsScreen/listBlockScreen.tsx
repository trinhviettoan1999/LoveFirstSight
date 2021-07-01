import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import {
  Header,
  StatusBarCustom,
  RouteStackParamList,
  CustomIcon,
} from '../../../components';
import {getListBlock, unBlockUser} from '../../../controller';
import {SwipeListView} from 'react-native-swipe-list-view';

export const ListBlockScreen = ({
  navigation,
}: RouteStackParamList<'LoadingScreen'>) => {
  const [listBlock, setListBlock] = useState([]);
  const [status, setStatus] = useState(0);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    getListBlock().then(async (result) => {
      setListBlock(await result.json());
      setStatus(await result.status);
    });
  }, [load]);
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="List Block"
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      {status === 200 ? (
        <View style={styles.container}>
          <SwipeListView
            style={styles.container}
            data={listBlock}
            // @ts-ignore: Object is possibly 'null'.
            keyExtractor={(item) => item.userId}
            renderItem={(data) => (
              <Pressable
                style={styles.item}
                onPress={() => {
                  navigation.navigate('ProfileScreen', {
                    // @ts-ignore: Object is possibly 'null'.
                    userId: data.item.userId,
                  });
                }}>
                <Text>
                  {
                    // @ts-ignore: Object is possibly 'null'.
                    data.item.name
                  }
                </Text>
              </Pressable>
            )}
            disableRightSwipe
            rightOpenValue={-80}
            renderHiddenItem={(data) => (
              <View style={styles.itemHidden}>
                <Pressable
                  style={styles.containerRight}
                  onPress={async () => {
                    // @ts-ignore: Object is possibly 'null'.
                    await unBlockUser(data.item.userId);
                    setLoad(!load);
                  }}>
                  <CustomIcon name="bin" size={18} />
                  <Text>Unblock</Text>
                </Pressable>
              </View>
            )}
          />
          <Text style={styles.textNotify}>Swipe left to unblock user!!</Text>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Don't have list block</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  item: {
    height: 30,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHidden: {
    height: 30,
    marginRight: 1,
    marginLeft: 1,
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerLeft: {
    flex: 1,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  containerRight: {
    flex: 1,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  textNotify: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#C8C8C8',
  },
});
