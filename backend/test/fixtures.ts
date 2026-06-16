/**
 * Test data factories — the Jest analog of pytest/pydantic fixtures. Each
 * builder returns a valid object and accepts a partial override, so a test only
 * spells out the fields it cares about.
 */
import type { Request } from 'express';
import type { AuthenticatedUser } from '../src/auth/authenticated-user.interface';
import type { CreateUserDto } from '../src/user/dto/create-user.dto';
import type {
  CreateEquipmentDto,
  CreateMaintenanceDto,
} from '../src/maintenance/dto/create-maintenance.dto';
import {
  DesignatedSystem,
  ProtocolType,
} from '../src/entities/environment.enums';
import { UserRole } from '../src/entities/user.entity';

export function makeCreateUserDto(
  overrides: Partial<CreateUserDto> = {},
): CreateUserDto {
  return {
    name: 'João Silva',
    email: 'joao@osland.com',
    password: 'senha123',
    password_confirmation: 'senha123',
    role: UserRole.TECHNICIAN,
    ...overrides,
  };
}

export function makeEquipment(
  overrides: Partial<CreateEquipmentDto> = {},
): CreateEquipmentDto {
  return {
    designatedSystem: DesignatedSystem.SPLIT,
    description: 'Ar-condicionado da recepção',
    setPoint: 22,
    environmentPhotos: [
      { label: 'Frontal', fileKey: 'photo-a' },
      { label: 'Lateral', fileKey: 'photo-b' },
    ],
    ...overrides,
  };
}

export function makeCreateMaintenanceDto(
  overrides: Partial<CreateMaintenanceDto> = {},
): CreateMaintenanceDto {
  return {
    osNumber: 'OS-1001',
    agency: '0001',
    agencyName: 'Agência Centro',
    state: 'SP',
    company: 'Banco Exemplo',
    assetNumber: 'AT-42',
    latitude: '-23.55',
    longitude: '-46.63',
    description: 'Manutenção preventiva trimestral',
    protocolType: ProtocolType.PREVENTIVE,
    environmentName: 'Recepção',
    equipments: [makeEquipment()],
    ...overrides,
  };
}

/**
 * A minimal in-memory Multer file. Only the fields the upload flow reads
 * (`originalname`, `buffer`) carry meaningful values; the rest satisfy the type.
 */
export function makeMulterFile(
  fileKey: string,
  contents = 'fake-image-bytes',
): Express.Multer.File {
  const buffer = Buffer.from(contents);
  return {
    fieldname: 'equipment-photos',
    originalname: fileKey,
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: buffer.length,
    buffer,
    stream: undefined as never,
    destination: '',
    filename: '',
    path: '',
  };
}

export function makeAuthenticatedUser(
  overrides: Partial<AuthenticatedUser> = {},
): AuthenticatedUser {
  return {
    userId: '00000000-0000-0000-0000-000000000001',
    email: 'tech@osland.com',
    role: UserRole.TECHNICIAN,
    ...overrides,
  };
}

/** Build the bare `Request` the controllers read `req.user` from. */
export function makeRequest(user: AuthenticatedUser): Request {
  return { user } as unknown as Request;
}
