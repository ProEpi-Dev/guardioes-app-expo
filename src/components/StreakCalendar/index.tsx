import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['D','S','T','Q','Q','S','S'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

interface StreakCalendarProps {
    markedDates: any;
    loading: boolean;
    onMonthChange: (year: number, month: number) => void;
}

export function StreakCalendar({ markedDates, loading, onMonthChange }: StreakCalendarProps) {
    return (
        <View style={styles.calendarCard}>
            {loading && (
                <ActivityIndicator size="small" color="#2ECC71" style={styles.loadingIndicator} />
            )}
            <Calendar
                markingType={'custom'}
                markedDates={markedDates}
                hideExtraDays={true}
                onMonthChange={(month: any) => onMonthChange(month.year, month.month)}
                renderArrow={(direction) => (
                    <Text style={{ fontSize: 30, color: '#A0AEC0', paddingHorizontal: 10 }}>
                        {direction === 'left' ? '‹' : '›'}
                    </Text>
                )}
                theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#A0AEC0', 
                            todayTextColor: '#2980B9', 
                            dayTextColor: '#2D3748', 
                            arrowColor: '#CBD5E0', 
                            monthTextColor: '#2980B9', 
                            textMonthFontWeight: '600',
                            textDayFontWeight: '500',
                            textDayHeaderFontWeight: '500',
                            textDayFontSize: 16,
                            textMonthFontSize: 18,
                            textDayHeaderFontSize: 14,
                            'stylesheet.calendar.header': {
                                header: {
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 10,
                                    marginTop: 8,
                                    alignItems: 'center',
                                    marginBottom: 15 
                                }
                            }
                        } as any} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    calendarCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingBottom: 10,
        paddingTop: 10,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
    },
    loadingIndicator: {
        position: 'absolute',
        top: 30,
        right: 20,
        zIndex: 10,
    },
});