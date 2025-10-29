import React, { useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    TextInput,
    Alert 
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { AppModal } from '../../../components/Modal'; 
import { styles } from './styles';
import translate from '../../../locales/i18n';

dayjs.extend(customParseFormat);

const MOCK_VACCINES = [
  { id: 1, name: 'Coronavac', laboratory: 'Sinovac', country_origin: 'China', doses: 2, min_dose_interval: 28 },
  { id: 2, name: 'Pfizer', laboratory: 'BioNTech', country_origin: 'USA/Germany', doses: 2, min_dose_interval: 21 },
  { id: 3, name: 'Janssen', laboratory: 'Johnson & Johnson', country_origin: 'USA', doses: 1, min_dose_interval: 0 },
];

const MOCK_DOSES = [
  { id: 101, date: '2025-03-10T00:00:00.000Z', dose: 1, vaccine: MOCK_VACCINES[0] },
  { id: 102, date: '2025-04-08T00:00:00.000Z', dose: 2, vaccine: MOCK_VACCINES[0] },
];


export function Vacinacao() {
  const [doses, setDoses] = useState(MOCK_DOSES);
  const [vaccines, setVaccines] = useState(MOCK_VACCINES);
  const [isDoseModalVisible, setDoseModalVisible] = useState(false);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedDose, setSelectedDose] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [selectedVaccineInfo, setSelectedVaccineInfo] = useState(null);
  const [doseDate, setDoseDate] = useState('');

  const openNewDoseModal = () => {
    setSelectedDose(null);
    setSelectedVaccine(null);
    setDoseDate('');
    setDoseModalVisible(true);
  };

  const openEditDoseModal = (dose) => {
    setSelectedDose(dose);
    setSelectedVaccine(dose.vaccine);
    setDoseDate(dayjs(dose.date).format('DD/MM/YYYY'));
    setDoseModalVisible(true);
  };

  const closeDoseModal = () => {
    setDoseModalVisible(false);
  };

  const openInfoModal = (vaccine) => {
    setSelectedVaccineInfo(vaccine);
    setInfoModalVisible(true);
  };

  // --- Funções de Lógica (sem API por enquanto) ---

  const handleSave = () => {
    const action = selectedDose ? 'editada' : 'criada';
    Alert.alert(
      `Dose ${action}!`,
      `Vacina: ${selectedVaccine.name}\nData: ${doseDate}`
    );
    closeDoseModal();
  };

  const handleDelete = () => {
    Alert.alert(
      'Dose Removida!',
      `A dose de ${selectedDose.vaccine.name} foi removida.`
    );
    closeDoseModal();
  };

  const renderVaccineSelector = () => {
    return vaccines.map((vaccine) => {
      const isSelected = selectedVaccine?.id === vaccine.id;
      return (
        <View key={vaccine.id} style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkboxRow} 
            onPress={() => setSelectedVaccine(vaccine)}
          >
            <Feather 
              name={isSelected ? 'check-circle' : 'circle'} 
              size={24} 
              color="#348eac" 
            />
            <Text style={styles.checkboxLabel}>{vaccine.name}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => openInfoModal(vaccine)}>
            <Feather name="help-circle" size={24} color="#348eac" />
          </TouchableOpacity>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>
          {doses.length > 0
            ? translate('vaccination.doses')
            : translate('vaccination.noDoses')}
        </Text>

        {doses.map((dose) => (
          <TouchableOpacity 
            key={dose.id} 
            style={styles.card} 
            onPress={() => openEditDoseModal(dose)}
          >
            <View>
              <Text style={styles.cardTextName}>{dose.vaccine.name}</Text>
              <Text style={styles.cardTextDate}>
                {`Dose ${dose.dose} - ${dayjs(dose.date).format('DD/MM/YYYY')}`}
              </Text>
            </View>
            <Feather name="edit" size={24} color="#348eac" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={openNewDoseModal}>
          <Text style={styles.addButtonText}>{translate('vaccination.add')}</Text>
        </TouchableOpacity>

      </ScrollView>

      <AppModal
        visible={isDoseModalVisible}
        onClose={closeDoseModal}
        title={selectedDose 
          ? translate('vaccination.titleEditDose') 
          : translate('vaccination.titleAddDose')
        }
      >
        <Text style={styles.modalLabel}>{translate('vaccination.dateField')}</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="DD/MM/AAAA"
          value={doseDate}
          onChangeText={setDoseDate}
          keyboardType="numeric"
          maxLength={10}
        />

        <Text style={styles.modalLabel}>{translate('vaccination.select')}</Text>
        {renderVaccineSelector()}

        <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
          <Text style={styles.modalButtonText}>{translate('vaccination.save')}</Text>
        </TouchableOpacity>

        {selectedDose && (
          <TouchableOpacity 
            style={[styles.modalButton, styles.deleteButton]} 
            onPress={handleDelete}
          >
            <Text style={styles.modalButtonText}>{translate('vaccination.delete')}</Text>
          </TouchableOpacity>
        )}
      </AppModal>

      <AppModal
        visible={isInfoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        title={selectedVaccineInfo?.name || "Informações"}
      >
        <Text style={styles.modalInfoLabel}>{translate('vaccination.laboratoryVaccine')}</Text>
        <Text style={styles.modalInfoText}>{selectedVaccineInfo?.laboratory}</Text>

        <Text style={styles.modalInfoLabel}>{translate('vaccination.countryVaccine')}</Text>
        <Text style={styles.modalInfoText}>{selectedVaccineInfo?.country_origin}</Text>
        
        <Text style={styles.modalInfoLabel}>{translate('vaccination.dosesVaccine')}</Text>
        <Text style={styles.modalInfoText}>{selectedVaccineInfo?.doses}</Text>

        <Text style={styles.modalInfoLabel}>{translate('vaccination.minIntervalVaccine')}</Text>
        <Text style={styles.modalInfoText}>
          {`${selectedVaccineInfo?.min_dose_interval} ${translate('vaccination.intervalVaccinePeriod')}`}
        </Text>
      </AppModal>

    </View>
  );
}