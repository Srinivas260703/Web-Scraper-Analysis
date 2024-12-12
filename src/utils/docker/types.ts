export interface DockerStatus {
  isRunning: boolean;
  containerId: string | null;
  ports: {
    ssh: number;
    http: number;
    https: number;
  };
  startTime?: string;
}

export interface DockerError {
  code: string;
  message: string;
  details?: string;
}