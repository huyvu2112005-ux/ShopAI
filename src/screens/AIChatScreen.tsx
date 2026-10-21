import {useThemedStyles} from '../hooks/useThemedStyles';
import React, {useRef, useState} from 'react';
import {ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemeColors} from '../constants/theme';
import ShopButton from '../components/ui/ShopButton';
import {apiError, askShopAI, ChatHistoryItem} from '../services/shopApi';

type Message = {id: string; role: 'user' | 'model'; text: string; failed?: boolean};
const suggestions = ['Tư vấn điện thoại dưới 10 triệu', 'Laptop nào phù hợp học tập?', 'Chọn tai nghe để nghe nhạc'];

export default function AIChatScreen(): React.JSX.Element {
  const {colors: COLORS, styles} = useThemedStyles(makeStyles);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const list = useRef<FlatList<Message>>(null);
  const failed = messages.find(item => item.failed);

  const send = async (text: string, retryId?: string) => {
    const clean = text.trim();
    if (!clean || busy.current || (!retryId && failed)) {return;}
    busy.current = true;
    setLoading(true);
    setError('');
    const id = retryId ?? `${Date.now()}`;
    const prior = retryId ? messages.slice(0, messages.findIndex(item => item.id === retryId)) : messages;
    const history: ChatHistoryItem[] = prior.filter(item => !item.failed).map(({role, text: value}) => ({role, text: value})).slice(-10);
    setMessages([...prior, {id, role: 'user', text: clean}]);
    setInput('');
    try {
      const reply = await askShopAI(clean, history);
      setMessages([...prior, {id, role: 'user', text: clean}, {id: `${id}-reply`, role: 'model', text: reply}]);
    } catch (cause) {
      setMessages([...prior, {id, role: 'user', text: clean, failed: true}]);
      setError(apiError(cause));
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.title}>Trợ lý ShopAI</Text>
          <TouchableOpacity disabled={loading} onPress={() => {setMessages([]); setError('');}} accessibilityRole="button">
            <Text style={styles.reset}>Cuộc trò chuyện mới</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          ref={list}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => list.current?.scrollToEnd({animated: true})}
          ListEmptyComponent={<View><Text style={styles.welcome}>Bạn cần tư vấn sản phẩm công nghệ nào?</Text>{suggestions.map(text => <TouchableOpacity key={text} style={styles.suggestion} onPress={() => {send(text);}}><Text style={styles.reset}>{text}</Text></TouchableOpacity>)}</View>}
          renderItem={({item}) => <View style={[styles.bubble, item.role === 'user' ? styles.user : styles.model]}><Text style={item.role === 'user' ? styles.userText : styles.modelText}>{item.text}</Text>{item.failed && <Text style={styles.userText}>Chưa gửi thành công</Text>}</View>}
          ListFooterComponent={loading ? <View accessibilityLiveRegion="polite" style={styles.typing}><ActivityIndicator color={COLORS.primary} /><Text style={{color: COLORS.textLight}}>Đang soạn tin...</Text></View> : undefined}
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        {failed && !loading && <View style={styles.retry}><ShopButton title="Thử lại" onPress={() => {send(failed.text, failed.id);}} /></View>}
        <View style={styles.composer}>
          <TextInput accessibilityLabel="Tin nhắn cho ShopAI" placeholder="Nhập câu hỏi về sản phẩm..." value={input} onChangeText={setInput} style={styles.input} multiline maxLength={2000} editable={!loading && !failed} />
          <ShopButton title="Gửi" loading={loading} disabled={!input.trim() || !!failed} onPress={() => {send(input);}} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (COLORS: ThemeColors) => StyleSheet.create({
  typing: {flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12},
  safe: {flex: 1, backgroundColor: COLORS.background},
  header: {padding: 16, backgroundColor: COLORS.surface},
  title: {fontSize: 24, color: COLORS.primary, fontWeight: '800', marginBottom: 8},
  reset: {color: COLORS.primary},
  messages: {padding: 16, flexGrow: 1},
  welcome: {fontSize: 18, color: COLORS.text, marginVertical: 20},
  suggestion: {padding: 14, borderRadius: 12, backgroundColor: COLORS.primarySoft, marginBottom: 10},
  bubble: {padding: 14, borderRadius: 16, maxWidth: '85%', marginBottom: 12},
  user: {alignSelf: 'flex-end', backgroundColor: COLORS.primary},
  model: {alignSelf: 'flex-start', backgroundColor: COLORS.surface},
  userText: {color: COLORS.onPrimary, lineHeight: 22},
  modelText: {color: COLORS.text, lineHeight: 22},
  error: {color: COLORS.error, paddingHorizontal: 16, marginBottom: 8},
  retry: {paddingHorizontal: 16, marginBottom: 10},
  composer: {flexDirection: 'row', padding: 12, alignItems: 'center', gap: 8, backgroundColor: COLORS.surface},
  input: {flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, maxHeight: 120, color: COLORS.text},
});
