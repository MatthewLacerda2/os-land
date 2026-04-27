import client from './client';

export interface MaintenanceItem {
  id: string;
  osNumber: string;
  location: string;
  company: string;
  createdAt: string;
}

export interface MaintenanceListResponse {
  items: MaintenanceItem[];
  total: number;
  offset: number;
  limit: number;
}

export interface CreateEquipmentPhoto {
  label: string;
  fileKey: string;
  file: File;
}

export interface CreateEquipment {
  name: string;
  protocolType: string;
  designatedSystem: string;
  environmentPhotos: CreateEquipmentPhoto[];
}

export interface CreateMaintenanceRequest {
  technicianId: string;
  osNumber: string;
  agency: string;
  state: string;
  company?: string;
  latitude: string;
  longitude: string;
  description: string;
  frontalPicture: File;
  ticketPicture: File;
  condenserPicture: File;
  faultPicture: File;
  equipments: CreateEquipment[];
}

export interface MaintenanceCreateResponse {
  id: string;
  agency: string;
}

export interface MaintenanceReportResponse {
  url: string;
  filename: string;
}

export interface MaintenancePhoto {
  id: string;
  path: string;
  label: string;
}

export interface MaintenanceEnvironment {
  id: string;
  name: string;
  designatedSystem: string;
  protocolType: string;
  photos: MaintenancePhoto[];
}

export interface MaintenanceViewResponse {
  id: string;
  osNumber: string;
  latitude: string;
  longitude: string;
  agency: string;
  state: string;
  company: string;
  description: string;
  createdAt: string;
  initialPhotos: string[];
  technicianName?: string;
  environments: MaintenanceEnvironment[];
}

export const maintenanceApi = {
  list: async (offset = 0, limit = 10): Promise<MaintenanceListResponse> => {
    const response = await client.get('/maintenance/list', {
      params: { offset, limit },
    });
    return response.data;
  },

  create: async (data: CreateMaintenanceRequest): Promise<MaintenanceCreateResponse> => {
    const formData = new FormData();
    
    const processedEquipments = data.equipments.map((eq, eqIdx) => {
      const photos = eq.environmentPhotos.map((p, pIdx) => {
        const fileKey = `eq_${eqIdx}_photo_${pIdx}`;
        formData.append('equipment-photos', p.file, fileKey);
        return { label: p.label, fileKey };
      });

      return {
        ...eq,
        environmentPhotos: photos
      };
    });

    // Append metadata first (best practice for many multipart parsers)
    const metadata = {
      technicianId: data.technicianId,
      osNumber: data.osNumber,
      agency: data.agency,
      state: data.state,
      company: data.company,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      equipments: processedEquipments,
    };

    Object.entries(metadata).forEach(([key, value]) => {
      if (key === 'equipments') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, value as string);
      }
    });

    // Append main photos
    formData.append('frontal-picture', data.frontalPicture);
    formData.append('ticket-picture', data.ticketPicture);
    formData.append('condenser-picture', data.condenserPicture);
    formData.append('fault-picture', data.faultPicture);

    const response = await client.post('/maintenance/create', formData);
    return response.data;
  },

  getReport: async (id: string): Promise<MaintenanceReportResponse> => {
    const response = await client.get(`/maintenance/report/${id}`);
    return response.data;
  },

  view: async (id: string): Promise<MaintenanceViewResponse> => {
    const response = await client.get(`/maintenance/view/${id}`);
    return response.data;
  },
};
