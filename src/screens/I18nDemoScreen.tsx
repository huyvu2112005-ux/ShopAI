import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import Typography from '@components/ui/Typography';
import ShopButton from '@components/ui/ShopButton';

import {
  COLORS,
  SIZES,
} from '@constants/theme';

export default function I18nDemoScreen() {
  const {t, i18n} = useTranslation();

  const currentLanguage = i18n.language;

  const changeToVietnamese = () => {
    i18n.changeLanguage('vi');
  };

  const changeToEnglish = () => {
    i18n.changeLanguage('en');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography
          variant="h1"
          color={COLORS.primary}>
          {t('title')}
        </Typography>

        <Typography
          variant="body1"
          color={COLORS.textLight}
          style={styles.description}>
          {t('description')}
        </Typography>

        <View style={styles.card}>
          <Typography variant="h3">
            {t('welcome')}
          </Typography>

          <Typography
            variant="body2"
            color={COLORS.textLight}
            style={styles.languageText}>
            {t('currentLanguage')}:{' '}
            {currentLanguage.startsWith('vi')
              ? t('vietnamese')
              : t('english')}
          </Typography>
        </View>

        <ShopButton
          title={t('changeToVietnamese')}
          onPress={changeToVietnamese}
          style={styles.button}
        />

        <ShopButton
          title={t('changeToEnglish')}
          onPress={changeToEnglish}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
  },

  description: {
    marginTop: 8,
    marginBottom: 24,
  },

  card: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: SIZES.radius,
    marginBottom: 24,
  },

  languageText: {
    marginTop: 8,
  },

  button: {
    marginBottom: 12,
  },
});