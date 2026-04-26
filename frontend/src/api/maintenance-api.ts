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

export const maintenanceApi = {
  list: async (offset = 0, limit = 10): Promise<MaintenanceListResponse> => {
    const response = await client.get('/maintenance/list', {
      params: { offset, limit },
    });
    return response.data;
  },

  create: async (data: CreateMaintenanceRequest): Promise<MaintenanceCreateResponse> => {
    const formData = new FormData();
    
    formData.append('frontal-picture', data.frontalPicture);
    formData.append('ticket-picture', data.ticketPicture);
    formData.append('condenser-picture', data.condenserPicture);
    formData.append('fault-picture', data.faultPicture);

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

    const response = await client.post('/maintenance/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getReport: async (id: string): Promise<MaintenanceReportResponse> => {
    const response = await client.get(`/maintenance/report/${id}`);
    return response.data;
  },
};
