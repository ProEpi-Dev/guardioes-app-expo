export interface MarkerData {
  latitude: number;
  longitude: number;
  symptom: string[];
  id: string;
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
