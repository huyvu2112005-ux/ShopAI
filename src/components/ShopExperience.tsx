import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import LottieView from 'lottie-react-native';
import '../i18n';
import Typography from './ui/Typography';
import ShopButton from './ui/ShopButton';
import useCountdown from '../hooks/useCountdown';
import {useThemeColors} from '../contexts/ThemeContext';

// Keep the chapter 3 language, animation and hook exercises reachable on Home.
export default function ShopExperience() {
  const {t, i18n} = useTranslation();
  const colors = useThemeColors();
  const timer = useCountdown(10);
  return <View style={[styles.card, {backgroundColor: colors.surface}]}>
    <Typography variant="h2">{t('welcome')}</Typography>
    <View style={styles.row}>
      <ShopButton title="Tiếng Việt" variant="outline" disabled={i18n.language.startsWith('vi')} onPress={() => {i18n.changeLanguage('vi');}} />
      <ShopButton title="English" variant="outline" disabled={i18n.language.startsWith('en')} onPress={() => {i18n.changeLanguage('en');}} />
    </View>
    <View style={styles.row}>
      <LottieView source={require('../assets/animations/loading.json')} autoPlay loop style={styles.animation} />
      <Typography>{t('countdown', {seconds: timer.seconds})}</Typography>
    </View>
    <ShopButton title={timer.seconds === 0 ? t('restart') : timer.isRunning ? t('pause') : t('start')} onPress={timer.seconds === 0 ? timer.reset : timer.isRunning ? timer.pause : timer.start} />
  </View>;
}
const styles = StyleSheet.create({card: {padding: 16, margin: 12, borderRadius: 16, gap: 12}, row: {flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap'}, animation: {width: 48, height: 48}});
