export interface Server {
  ID: number;
  Name: string;
  Port: number;
  IsTest: boolean;
  IP: string;
  IsRcd: boolean;
}

export type Servers = Array<Server>;
