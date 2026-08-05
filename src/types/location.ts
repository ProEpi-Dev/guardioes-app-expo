import type { PaginationQuery } from './api';

export interface ParentLocation {
  id: number;
  name: string;
  parent?: ParentLocation; // Recursivo até 3 níveis
}

export interface Location {
  id: number;
  parentId: number | null;
  parent?: ParentLocation; // Hierarquia até 3 níveis
  name: string;
  orgLevel: 'COUNTRY' | 'STATE_DISTRICT' | 'CITY_COUNCIL';
  latitude: number | null;
  longitude: number | null;
  polygons: any | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationDto {
  name: string;
  parentId?: number;
  orgLevel?: 'COUNTRY' | 'STATE_DISTRICT' | 'CITY_COUNCIL';
  latitude?: number;
  longitude?: number;
  polygons?: any;
  active?: boolean;
}

export interface UpdateLocationDto {
  name?: string;
  parentId?: number;
  orgLevel?: 'COUNTRY' | 'STATE_DISTRICT' | 'CITY_COUNCIL';
  longitude?: number;
  latitude?: number;
  polygons?: any;
  active?: boolean;
}

export interface LocationQuery extends PaginationQuery {
  active?: boolean;
  parentId?: number;
  orgLevel?: 'COUNTRY' | 'STATE_DISTRICT' | 'CITY_COUNCIL';
}
