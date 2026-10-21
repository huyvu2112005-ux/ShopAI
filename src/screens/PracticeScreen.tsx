import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useThemeMode} from '../contexts/ThemeContext';
import ShopButton from '../components/ui/ShopButton';
import ShopInput from '../components/ui/ShopInput';
import Typography from '../components/ui/Typography';
import useCountdown from '../hooks/useCountdown';
import {AppDispatch, RootState} from '../store/redux/store';
import {decrement, increment, resetCounter} from '../store/redux/counterSlice';
import FetchDemo from './demos/FetchDemo';
import {addToCart, removeProduct, clearCart} from '../store/redux/cartSlice';
import {MOCK_PRODUCTS} from '../data/mockProducts';

export default function PracticeScreen() {
  const {colors, toggleTheme} = useThemeMode();
  const [name, setName] = useState('');
  const [showFetch, setShowFetch] = useState(false);
  const count = useSelector((state: RootState) => state.counter.value);
  const demoItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const timer = useCountdown(10);
  if (showFetch) {return <View style={[styles.fill, {backgroundColor: colors.background}]}><ShopButton title="Quay lại bài thực hành" onPress={() => setShowFetch(false)} /><FetchDemo /></View>;}
  return <ScrollView style={{backgroundColor: colors.background}} contentContainerStyle={styles.content}>
    <Typography variant="h1">Bài thực hành 2–6</Typography>
    <Typography variant="body2">Khu vực học tập của bản Debug. Redux ở đây độc lập với giỏ hàng Zustand.</Typography>
    <ShopInput label="State và TextInput" placeholder="Nhập tên của bạn" value={name} onChangeText={setName} />
    <Typography>Xin chào {name || 'bạn'}!</Typography>
    <ShopButton title="Đổi sáng / tối — Context + useReducer" variant="outline" onPress={toggleTheme} />
    <Typography variant="h2">UI Kit và Custom Hook</Typography>
    <Typography>Khuyến mãi còn {timer.seconds} giây</Typography>
    <ShopButton title="Bắt đầu đếm ngược" disabled={timer.seconds === 0 || timer.isRunning} onPress={timer.start} />
    <ShopButton title="Làm lại" variant="secondary" onPress={timer.reset} />
    <ShopButton title="Nút loading" loading onPress={() => {}} />
    <Typography variant="h2">Redux Toolkit</Typography>
    <Text accessibilityLabel={`Bộ đếm Redux ${count}`} style={[styles.count, {color: colors.primary}]}>{count}</Text>
    <View style={styles.row}><ShopButton title="−1" variant="outline" onPress={() => dispatch(decrement())} /><ShopButton title="+1" onPress={() => dispatch(increment())} /><ShopButton title="Reset" variant="secondary" onPress={() => dispatch(resetCounter())} /></View>
    <Typography variant="h2">Giỏ hàng Redux demo</Typography>
    <ShopButton title="Thêm sản phẩm vào Redux" onPress={() => dispatch(addToCart(MOCK_PRODUCTS[0]))} />
    {demoItems.map(item => <View key={item.id}><Typography>{item.name} × {item.quantity}</Typography><ShopButton title="Xóa sản phẩm demo" variant="outline" onPress={() => dispatch(removeProduct(item.id))} /></View>)}
    <Typography>Tổng Redux: {demoItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('vi-VN')} đ</Typography>
    <ShopButton title="Xóa giỏ Redux demo" variant="secondary" onPress={() => dispatch(clearCart())} />
    <ShopButton title="Mở demo Fetch của bài 2" variant="outline" onPress={() => setShowFetch(true)} />
  </ScrollView>;
}
const styles = StyleSheet.create({fill: {flex: 1}, content: {padding: 20, gap: 16}, row: {flexDirection: 'row', gap: 12}, count: {fontSize: 36, fontWeight: '800'}});
