import React, {useState} from 'react';

import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

type JustifyOption =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around';

type AlignOption =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'stretch';

const JUSTIFY_OPTIONS: JustifyOption[] = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
];

const ALIGN_OPTIONS: AlignOption[] = [
  'flex-start',
  'center',
  'flex-end',
  'stretch',
];

type BoxProps = {
  label: string;
};

function DemoBox({label}: BoxProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.boxText}>
        {label}
      </Text>
    </View>
  );
}

export default function FlexboxDemo() {
  const [justify, setJustify] =
    useState<JustifyOption>('flex-start');

  const [align, setAlign] =
    useState<AlignOption>('stretch');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>
          Thực hành Flexbox
        </Text>

        <Text style={styles.description}>
          Quan sát cách các thuộc tính Flexbox thay đổi bố cục.
        </Text>

        {/* 1. FLEX DIRECTION COLUMN */}
        <Text style={styles.sectionTitle}>
          1. flexDirection: column
        </Text>

        <Text style={styles.note}>
          Các phần tử được xếp từ trên xuống dưới.
        </Text>

        <View
          style={[
            styles.demoFrame,
            styles.columnFrame,
          ]}>
          <DemoBox label="1" />
          <DemoBox label="2" />
          <DemoBox label="3" />
        </View>

        {/* 2. FLEX DIRECTION ROW */}
        <Text style={styles.sectionTitle}>
          2. flexDirection: row
        </Text>

        <Text style={styles.note}>
          Các phần tử được xếp từ trái sang phải.
        </Text>

        <View
          style={[
            styles.demoFrame,
            styles.rowFrame,
          ]}>
          <DemoBox label="1" />
          <DemoBox label="2" />
          <DemoBox label="3" />
        </View>

        {/* 3. JUSTIFY CONTENT */}
        <Text style={styles.sectionTitle}>
          3. justifyContent
        </Text>

        <Text style={styles.note}>
          Giá trị hiện tại: {justify}
        </Text>

        <View style={styles.optionContainer}>
          {JUSTIFY_OPTIONS.map(item => (
            <Pressable
              key={item}
              onPress={() => setJustify(item)}
              style={[
                styles.optionButton,
                justify === item &&
                  styles.optionButtonActive,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  justify === item &&
                    styles.optionTextActive,
                ]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={[
            styles.demoFrame,
            styles.justifyFrame,
            {
              justifyContent: justify,
            },
          ]}>
          <DemoBox label="1" />
          <DemoBox label="2" />
          <DemoBox label="3" />
        </View>

        {/* 4. ALIGN ITEMS */}
        <Text style={styles.sectionTitle}>
          4. alignItems
        </Text>

        <Text style={styles.note}>
          Giá trị hiện tại: {align}
        </Text>

        <View style={styles.optionContainer}>
          {ALIGN_OPTIONS.map(item => (
            <Pressable
              key={item}
              onPress={() => setAlign(item)}
              style={[
                styles.optionButton,
                align === item &&
                  styles.optionButtonActive,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  align === item &&
                    styles.optionTextActive,
                ]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={[
            styles.demoFrame,
            styles.alignFrame,
            {
              alignItems: align,
            },
          ]}>
          <DemoBox label="1" />
          <DemoBox label="2" />
          <DemoBox label="3" />
        </View>

        {/* 5. FLEX RATIO */}
        <Text style={styles.sectionTitle}>
          5. flex: 1 và flex: 2
        </Text>

        <Text style={styles.note}>
          Không gian được chia theo tỉ lệ 1 : 2.
        </Text>

        <View style={styles.flexRatioFrame}>
          <View style={styles.flexOne}>
            <Text style={styles.ratioText}>
              flex: 1
            </Text>
          </View>

          <View style={styles.flexTwo}>
            <Text style={styles.ratioText}>
              flex: 2
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF4D4F',
  },

  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginTop: 22,
  },

  note: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 8,
  },

  demoFrame: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },

  columnFrame: {
    flexDirection: 'column',
  },

  rowFrame: {
    flexDirection: 'row',
  },

  justifyFrame: {
    flexDirection: 'row',
    minHeight: 90,
  },

  alignFrame: {
    flexDirection: 'row',
    minHeight: 150,
  },

  box: {
    width: 56,
    height: 56,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },

  boxText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },

  optionButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 6,
    marginBottom: 6,
  },

  optionButtonActive: {
    backgroundColor: '#FF4D4F',
  },

  optionText: {
    fontSize: 12,
    color: '#374151',
  },

  optionTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  flexRatioFrame: {
    flexDirection: 'row',
    height: 80,
    marginBottom: 20,
  },

  flexOne: {
    flex: 1,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 4,
  },

  flexTwo: {
    flex: 2,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  ratioText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});