import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from "react";
import { Alert, Linking, Platform, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  GiftedChat,
  IMessage,
  Send,
  SendProps,
  SystemMessage,
} from "react-native-gifted-chat";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavBar } from "../../Components/NavBar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid/non-secure";
import AccessoryBar from "../../Components/AccessoryBar";
import CustomActions from "../../Components/CustomActions";
import CustomView from "../../Components/CustimView";
import earlierMessages from "../../Services/EarlierMessages";
import messagesData from "../../Services/Messages";
import * as Clipboard from "expo-clipboard";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { BlurView } from "expo-blur";
import { useCodeStore } from "store/CodeStore";
import { Image } from "expo-image";
import { ref, onValue, push, update, remove } from "firebase/database";
import { db } from "Config/firebase";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sendToServer, setSendToServer] = useState(false);
  const userId = useCodeStore((state: any) => state.id);
  const user = {
    _id: userId,
    name: "Human",
  };
  const modelKey = process.env.EXPO_PUBLIC_GEMINIKEY;
  const genAI = new GoogleGenerativeAI(modelKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const dbChatLocation = `/users/${userId}/chat`;

  useEffect(() => {
    return onValue(ref(db, dbChatLocation), (querySnapShot) => {
      let data = querySnapShot.val() || [];
      if (data !== null) {
        let ResultArray = Object.entries(data)
          .toReversed()
          .map((e) => Object.assign(e[1], { key: e[0] }));
        // console.log(ResultArray, "kkkkk");
        var Airesult = ResultArray.map((value) => ({
          _id: value.AImsg._id,
          text: value.AImsg.text,
          user: {
            _id: value.AImsg.user._id,
            name: value.AImsg.user.name,
          },
        }));

        var Userresult = ResultArray.map((value) => ({
          _id: value.userMsg._id,
          text: value.userMsg.text,
          user: {
            _id: value.userMsg.user._id,
            name: value.userMsg.user.name,
          },
        }));
        console.log(Airesult.concat(Userresult));
        const allMsgs = Airesult.concat(Userresult);
        setMessages(allMsgs);
      }
    });
  }, [isTyping]);

  const onSend = async (newMessages = []) => {
    setMessages((previousMessages) => ({ ...previousMessages, newMessages }));
    console.log(newMessages, "user input");
    setIsTyping(true);
    const prompt = newMessages[0].text;
    const result = await model.generateContent(prompt);
    const AImsg = {
      _id: Math.random().toString(36).substring(7),
      text: result.response.text().toLocaleLowerCase(),
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "Chatbot",
      },
    };
    const userMsg = {
      _id: newMessages[0]._id,
      text: newMessages[0].text,
      createdAt: newMessages[0].createdAt,
      user: {
        _id: userId,
        name: "Human",
      },
    };
    const AllMsgs = { userMsg, AImsg };
    // console.log(AllMsgs, "rainnnnn");
    push(ref(db, dbChatLocation), AllMsgs);
    setMessages((prev) => ({ ...prev, AllMsgs }));
    setIsTyping(false);
  };

  const parsePatterns = useCallback(() => {
    return [
      {
        pattern: /#(\w+)/,
        style: { textDecorationLine: "underline", color: "darkorange" },
        onPress: () => Linking.openURL("http://gifted.chat"),
      },
    ];
  }, []);

  const onPressAvatar = useCallback(() => {
    Alert.alert("Zira Ai");
  }, []);

  const handleLongPress = useCallback(
    (context: unknown, currentMessage: object) => {
      if (!currentMessage.text) return;

      const options = ["Copy text", "Cancel"];

      const cancelButtonIndex = options.length - 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (context as any).actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex: number) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setStringAsync(currentMessage.text);
              break;
            default:
              break;
          }
        }
      );
    },
    []
  );

  const renderSystemMessage = useCallback((props: any) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  }, []);

  const renderCustomView = useCallback((props: any) => {
    return <CustomView {...props} />;
  }, []);

  const renderSend = useCallback((props: SendProps<IMessage>) => {
    return (
      <Send
        {...props}
        containerStyle={{ justifyContent: "center", paddingHorizontal: 10 }}
      >
        <MaterialIcons size={30} color={Colors.primary} name={"send"} />
      </Send>
    );
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "AI Chat",
          headerTitleStyle: {
            color: Colors.white,
            fontSize: 17,
            fontWeight: "bold",
          },
          headerTransparent: true,
          headerTitle: "Messages",
          headerBackground: () => (
            <BlurView
              intensity={100}
              tint="systemThinMaterialDark"
              style={{ flex: 1 }}
            />
          ),
        }}
      />
      <SafeAreaView style={[styles.fill, styles.container]}>
        <View style={[styles.fill, styles.content]}>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            parsePatterns={parsePatterns}
            user={user}
            scrollToBottom
            onPressAvatar={onPressAvatar}
            showAvatarForEveryMessage
            renderAvatar={() => (
              <Image
                source={require("../../assets/images/ai.jpeg")}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  borderRadius: 20,
                }}
              />
            )}
            onLongPressAvatar={() => null}
            onLongPress={handleLongPress}
            quickReplyStyle={{ borderRadius: 2 }}
            quickReplyTextStyle={{
              fontWeight: "200",
            }}
            renderAccessory={() => null}
            renderActions={() => null}
            renderSystemMessage={renderSystemMessage}
            renderCustomView={renderCustomView}
            renderSend={renderSend}
            keyboardShouldPersistTaps="never"
            timeTextStyle={{
              left: { color: "red" },
              right: { color: "yellow" },
            }}
            isTyping={isTyping}
            inverted={Platform.OS !== "web"}
            infiniteScroll
            messagesContainerStyle={styles.container}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.black,
  },
  content: {
    backgroundColor: Colors.black,
  },
});

export default Chat;
