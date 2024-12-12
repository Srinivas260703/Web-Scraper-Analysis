import { DOCKER_COMMANDS } from './commands';
import type { DockerStatus, DockerError } from './types';
import type { DockerContainer } from '../../types/docker';

export class KaliManager {
  private static instance: KaliManager;
  private status: DockerStatus = {
    isRunning: false,
    containerId: null,
    ports: {
      ssh: 2222,
      http: 8080,
      https: 8443
    }
  };

  private constructor() {}

  static getInstance(): KaliManager {
    if (!KaliManager.instance) {
      KaliManager.instance = new KaliManager();
    }
    return KaliManager.instance;
  }

  async startContainer(): Promise<DockerContainer> {
    try {
      if (this.status.isRunning) {
        throw this.createError('CONTAINER_RUNNING', 'Kali container is already running');
      }

      // Simulated Docker container start sequence
      console.log('Pulling Kali Linux image...');
      await this.simulateCommand(DOCKER_COMMANDS.PULL_KALI);
      
      console.log('Starting Kali container...');
      const containerId = `kali-${Date.now()}`;
      await this.simulateCommand(DOCKER_COMMANDS.RUN_KALI);

      this.status = {
        isRunning: true,
        containerId,
        ports: {
          ssh: 2222,
          http: 8080,
          https: 8443
        },
        startTime: new Date().toISOString()
      };

      return {
        id: containerId,
        status: 'running',
        name: 'kali-security',
        ports: {
          22: this.status.ports.ssh,
          80: this.status.ports.http,
          443: this.status.ports.https
        }
      };
    } catch (error) {
      throw this.createError('START_FAILED', `Failed to start Kali container: ${error.message}`);
    }
  }

  async stopContainer(): Promise<void> {
    if (!this.status.containerId) {
      throw this.createError('NO_CONTAINER', 'No container is running');
    }

    try {
      await this.simulateCommand(`${DOCKER_COMMANDS.STOP_CONTAINER} ${this.status.containerId}`);
      await this.simulateCommand(`${DOCKER_COMMANDS.REMOVE_CONTAINER} ${this.status.containerId}`);
      
      this.status = {
        isRunning: false,
        containerId: null,
        ports: {
          ssh: 2222,
          http: 8080,
          https: 8443
        }
      };
    } catch (error) {
      throw this.createError('STOP_FAILED', `Failed to stop container: ${error.message}`);
    }
  }

  async executeCommand(command: string): Promise<string> {
    if (!this.status.isRunning || !this.status.containerId) {
      throw this.createError('NOT_RUNNING', 'Container not running');
    }

    try {
      const fullCommand = `${DOCKER_COMMANDS.EXEC_COMMAND} ${this.status.containerId} ${command}`;
      return await this.simulateCommand(fullCommand);
    } catch (error) {
      throw this.createError('EXEC_FAILED', `Command execution failed: ${error.message}`);
    }
  }

  getStatus(): DockerStatus {
    return { ...this.status };
  }

  private createError(code: string, message: string, details?: string): DockerError {
    return { code, message, details };
  }

  private async simulateCommand(command: string): Promise<string> {
    // Simulated command execution with realistic delays
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Executed: ${command}`;
  }
}