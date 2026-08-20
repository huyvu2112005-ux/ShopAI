import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function ModalDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal Demo</Text>

      <Text style={styles.description}>
        Nhấn nút để mở cửa sổ Modal.
      </Text>

      <Pressable
        style={styles.openButton}
        onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>
          MỞ MODAL
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Thông báo
            </Text>

            <Text style={styles.modalText}>
              Đây là cửa sổ Modal trong React Native.
            </Text>

            <Pressable
              style={styles.closeButton}
              onPress={() => setVisible(false)}>
              <Text style={styles.buttonText}>
                ĐÓNG
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 24,
  },

  openButton: {
    backgroundColor: '#FF4D4F',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  modalBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 12,
  },

  modalText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
  },

  closeButton: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});