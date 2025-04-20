import React, { useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  Text,
  useColorScheme
} from 'react-native';
import { MyIcon } from './MyIcon';

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  label?: string;
  options: Option[];
  selectedValue?: string | number;
  onValueChange: (value: string | number) => void;
}

export const CustomSelect = ({ label, options, selectedValue, onValueChange }: Props) => {
  const [visible, setVisible] = useState(false);
  const selectedOption = options.find(opt => opt.value === selectedValue);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={{ marginBottom: 15 }}>
      {label && <Text style={[styles.label, isDarkMode && styles.labelDark]}>{label}</Text>}

      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[styles.selectBox, isDarkMode && styles.selectBoxDark]}
      >
        <Text style={[styles.selectedText, isDarkMode && styles.selectedTextDark]}>
          {selectedOption?.label || 'Selecciona una opción'}
        </Text>
        <MyIcon name="chevron-down-outline" size={20} color={isDarkMode ? '#fff' : '#333'} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <FlatList
              data={options}
              keyExtractor={item => item.value.toString()}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;

                return (
                  <TouchableOpacity
                    onPress={() => {
                      onValueChange(item.value);
                      setVisible(false);
                    }}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isDarkMode && styles.optionTextDark,
                        isSelected && styles.optionTextSelected
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  labelDark: {
    color: '#fff',
  },
  selectBox: {
    backgroundColor: '#099fe3',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectBoxDark: {
    backgroundColor: '#2c2c2c',
  },
  selectedText: {
    color: '#fff',
  },
  selectedTextDark: {
    color: '#fff',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    maxHeight: 300,
  },
  modalContentDark: {
    backgroundColor: '#2a2a2a',
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionItemSelected: {
    backgroundColor: '#03A9F4',
    borderRadius: 8,
  },
  optionText: {
    color: '#000',
  },
  optionTextDark: {
    color: '#fff',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
