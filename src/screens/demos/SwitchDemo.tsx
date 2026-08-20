import React, {useState} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';

export default function SwitchDemo() {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Switch Demo</Text>

      <Text style={styles.description}>
        Bật hoặc tắt chế độ thông báo.
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Thông báo</Text>

        <Switch
          value={isEnabled}
          onValueChange={toggleSwitch}
        />
      </View>

      <Text style={styles.status}>
        Trạng thái: {isEnabled ? 'Đang bật' : 'Đang tắt'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 30,
  },

  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50',
  },

  status: {
    marginTop: 24,
    fontSize: 17,
    fontWeight: '600',
    color: '#FF4D4F',
    textAlign: 'center',
  },
});