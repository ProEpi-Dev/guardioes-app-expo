export interface ProfileStatus {
  isComplete: boolean;
  profile?: {
    genderId?: number;
    locationId?: number;
    externalIdentifier?: string;
  };
}

export interface UpdateProfilePayload {
  genderId: number;
  locationId: number;
  externalIdentifier: string;
}

export interface DropdownOption {
  key: number | string;
  label: string;
  value: number;
}
