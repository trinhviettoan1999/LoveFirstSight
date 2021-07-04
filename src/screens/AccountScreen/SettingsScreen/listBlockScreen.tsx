import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CustomIcon, Back, HeaderCustom} from '../../../components';
import {getListBlock, unBlockUser} from '../../../controller';
import {SwipeListView} from 'react-native-swipe-list-view';
import {ROUTER} from '../../../constants';
import {color} from '../../../theme';

export const ListBlockScreen = () => {
  const navigation = useNavigation();
  const [listBlock, setListBlock] = useState([]);
  const [load, setLoad] = useState(true);

  const handleUnBlock = async (data: any) => {
    // @ts-ignore: Object is possibly 'null'.
    await unBlockUser(data.item.userId);
    setLoad(true);
    loadData();
  };

  const loadData = () => {
    getListBlock().then(async (result) => {
      setListBlock(await result.json());
      setLoad(false);
    });
  };

  useEffect(() => {
    loadData();
    return () => loadData();
  }, []);

  return (
    <View style={styles.containerAll}>
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="List Block"
        leftComponent={
          <Pressable onPress={() => navigation.goBack()}>
            <Back />
          </Pressable>
        }
      />
      {load ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      ) : listBlock.length > 0 ? (
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
                  navigation.navigate(ROUTER.profile, {
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
                  onPress={() => handleUnBlock(data)}>
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
    paddingHorizontal: 10,
  },
  item: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHidden: {
    height: 40,
    marginRight: 1,
    marginLeft: 1,
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerLeft: {
    flex: 1,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  containerRight: {
    flex: 1,
    height: 40,
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
