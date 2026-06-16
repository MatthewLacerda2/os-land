// Enums kept in their own module (no entity imports) so they can be referenced
// by entities and DTOs without forming an import cycle between
// environment.entity and maintenance-order.entity.

export enum DesignatedSystem {
  SPLIT = 'split',
  SELF = 'self',
  SPLITAO = 'splitao',
}

export enum ProtocolType {
  CORRECTIVE = 'corrective',
  PREVENTIVE = 'preventive',
}
